export interface RedditPost {
    title: string;
    selftext: string;
    url: string;
    score: number;
    num_comments: number;
    created_utc?: number;
    subreddit?: string;
}

export interface RedditResponse {
    data: {
        children: Array<{
            data: RedditPost;
        }>;
    };
}