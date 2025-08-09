import OpenAI from 'openai';
import type { SearchRequest, SearchResponse, RedditResponse, ProductSuggestion } from '#shared/types';
import { sendDiscordLog } from '../../shared/utils/discordLogger';

export default defineEventHandler(async (event): Promise<SearchResponse> => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    });
  }

  const body = await readBody<SearchRequest>(event);
  const config = useRuntimeConfig();

  if (!body.query?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query is required'
    });
  }

  if (!body.language) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Language is required'
    });
  }

  const query = body.query.trim();
  const language = body.language;
  const startTime = Date.now();

  try {
    if (!config.openrouterApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OpenRouter API key not configured'
      });
    }

    await sendDiscordLog(`User searched for: "${query}" (Language: ${language})`, 'INFO', config.discordWebhookUrl);

    const redditData = await fetchRedditData(query, language);
    const suggestions = await generateSuggestions(query, redditData, config.openrouterApiKey, language);

    const searchTime = Date.now() - startTime;

    await sendDiscordLog(`Generated ${suggestions.length} suggestions for: "${query}" in ${searchTime}ms`, 'INFO', config.discordWebhookUrl);

    return {
      suggestions,
      totalResults: suggestions.length,
      searchTime
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const searchTime = Date.now() - startTime;

    await sendDiscordLog(`Search failed for "${query}": ${errorMessage} (${searchTime}ms)`, 'ERROR', config.discordWebhookUrl);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Search failed'
    });
  }
})

async function fetchRedditData(query: string, language: string): Promise<string> {
  try {
    return await fetchFromRedditAPI(query, language);
  } catch (error) {
    console.warn('Reddit API failed, trying RSS feed:', error);
    try {
      return await fetchFromRedditRSS(query, language);
    } catch (rssError) {
      console.warn('Reddit RSS failed, using fallback:', rssError);
      return await generateFallbackContent(query);
    }
  }
}

async function fetchFromRedditAPI(query: string, language: string): Promise<string> {
  const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=15&sort=top&t=month`;

  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
  });

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status}`);
  }

  const data: RedditResponse = await response.json();

  const posts = data.data.children
    .map(child => child.data)
    .filter(post => post.selftext || post.title)
    .slice(0, 8);

  if (posts.length === 0) {
    return `No relevant Reddit discussions found for "${query}"`;
  }

  return posts.map(post => `
Title: ${post.title}
Content: ${post.selftext.slice(0, 600)}
Score: ${post.score}
Comments: ${post.num_comments}
Subreddit: ${post.subreddit || 'Unknown'}
---`).join('\n');
}

async function fetchFromRedditRSS(query: string, language: string): Promise<string> {
  const rssUrl = `https://www.reddit.com/search.rss?q=${encodeURIComponent(query)}&limit=15&sort=top&t=month`;

  const response = await fetch(rssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    }
  });

  if (!response.ok) {
    throw new Error(`Reddit RSS error: ${response.status}`);
  }

  const rssText = await response.text();

  const titleMatches = rssText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
  const descriptionMatches = rssText.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/g) || [];

  if (titleMatches.length === 0) {
    return `No relevant Reddit discussions found for "${query}"`;
  }

  let content = '';
  for (let i = 1; i < Math.min(titleMatches.length, 9); i++) {
    const title = titleMatches[i]?.replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, '') || '';
    const description = descriptionMatches[i]?.replace(/<description><!\[CDATA\[/, '').replace(/\]\]><\/description>/, '') || '';

    if (title) {
      content += `
Title: ${title}
Content: ${description.slice(0, 600)}
---`;
    }
  }

  return content || `Limited Reddit data found for "${query}"`;
}

async function generateFallbackContent(query: string): Promise<string> {
  return `Search query: "${query}"\n\nUnable to fetch Reddit data, but performing AI analysis based on product category.`;
}

async function generateSuggestions(query: string, redditData: string, apiKey: string, language: string): Promise<ProductSuggestion[]> {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

  const systemPrompt = `You are an expert product advisor analyzing Reddit discussions. The user is searching for "${query}".

Based on the Reddit data, provide exactly 3 product recommendations.

IMPORTANT: Respond in ${language} language for product names and descriptions.

Provide your response in the following format (WITHOUT the json markdown markers):
PRODUCT_1_NAME: [Product name]
PRODUCT_1_REASON: [Detailed explanation why you recommend it]
PRODUCT_1_CONFIDENCE: [Number between 0.6 and 1.0]
PRODUCT_1_CATEGORIES: [Category1,Category2,Category3]
PRODUCT_1_PRICE: [low/medium/high]
PRODUCT_1_LINK: [URL if available, or empty]

PRODUCT_2_NAME: [Product name]
PRODUCT_2_REASON: [Detailed explanation why you recommend it]
PRODUCT_2_CONFIDENCE: [Number between 0.6 and 1.0]
PRODUCT_2_CATEGORIES: [Category1,Category2,Category3]
PRODUCT_2_PRICE: [low/medium/high]
PRODUCT_2_LINK: [URL if available, or empty]

PRODUCT_3_NAME: [Product name]
PRODUCT_3_REASON: [Detailed explanation why you recommend it]
PRODUCT_3_CONFIDENCE: [Number between 0.6 and 1.0]
PRODUCT_3_CATEGORIES: [Category1,Category2,Category3]
PRODUCT_3_PRICE: [low/medium/high]
PRODUCT_3_LINK: [URL if available, or empty]`;

  const userPrompt = `Reddit data analysis for "${query}":

${redditData}

Provide 3 product recommendations based on this data.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-20b:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1172,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const suggestions: ProductSuggestion[] = [];

    for (let i = 1; i <= 3; i++) {
      const nameMatch = response.match(new RegExp(`PRODUCT_${i}_NAME:\\s*(.+)`, 'm'));
      const reasonMatch = response.match(new RegExp(`PRODUCT_${i}_REASON:\\s*(.+)`, 'm'));
      const confidenceMatch = response.match(new RegExp(`PRODUCT_${i}_CONFIDENCE:\\s*([0-9.]+)`, 'm'));
      const categoriesMatch = response.match(new RegExp(`PRODUCT_${i}_CATEGORIES:\\s*(.+)`, 'm'));
      const priceMatch = response.match(new RegExp(`PRODUCT_${i}_PRICE:\\s*(low|medium|high)`, 'm'));
      const linkMatch = response.match(new RegExp(`PRODUCT_${i}_LINK:\\s*(.+)`, 'm'));

      if (nameMatch?.[1] && reasonMatch?.[1]) {
        const name = nameMatch[1].trim();
        const reason = reasonMatch[1].trim();
        const confidence = confidenceMatch?.[1] ? Math.min(Math.max(parseFloat(confidenceMatch[1]), 0.6), 1.0) : 0.7;
        const categories = categoriesMatch?.[1] ? categoriesMatch[1].split(',').map(c => c.trim()) : ['General'];
        const priceRange = priceMatch?.[1] && ['low', 'medium', 'high'].includes(priceMatch[1])
          ? priceMatch[1] as 'low' | 'medium' | 'high'
          : 'medium';
        const link = linkMatch?.[1] ? linkMatch[1].trim() : '';

        suggestions.push({
          name,
          reason,
          confidence,
          categories,
          priceRange,
          link: link === 'empty' ? '' : link
        });
      }
    }

    if (suggestions.length === 0) {
      throw new Error('No valid suggestions parsed');
    }

    return suggestions;

  } catch (error) {
    console.error('AI generation failed:', error);

    return [{
      name: 'Service Temporarily Unavailable',
      reason: 'We encountered an error while generating product recommendations. Please try your search again in a few moments. If the problem persists, please contact our development team.',
      confidence: 0.1,
      categories: ['Error'],
      priceRange: 'medium' as const,
      link: ''
    }];
  }
}