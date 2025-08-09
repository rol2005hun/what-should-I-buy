# GitHub Copilot Instructions

## Coding Style Guidelines

### JavaScript/TypeScript Style
- **NO COMMENTS** in code - clean, self-explanatory code only
- **NO CONSOLE.LOG** statements - use proper debugging tools or remove debug code
- **Semicolons required** at the end of statements (not after closing braces `}`)
- Use semicolons after: variable declarations, function calls, return statements, imports, exports
- Do NOT use semicolons after: closing braces `}`, object/array closing braces

### Examples:
```typescript
// ✅ CORRECT
const searchQuery = ref('');
const isLoading = computed(() => store.loading);
const results = await api.search(query);
return { data, error };

// ❌ WRONG
const searchQuery = ref('') // missing semicolon
const isLoading = computed(() => store.loading)}; // semicolon after brace
console.log('debug info'); // no console.log allowed
```

### Vue.js Specific
- Use composition API with `<script setup>`
- Prefer `const` over `let` when possible
- Use proper TypeScript typing
- Template syntax should be clean without inline comments

### General Principles
- Write clean, readable code without comments
- Let variable and function names be self-explanatory
- Use consistent formatting
- Follow Nuxt 4 conventions and best practices
- No debug statements in production code

### Internationalization Rules
- **NEVER use hardcoded language checks** like `language === 'hu'` or `language === 'en'`
- Always use structured language objects/maps for multilingual content
- Example of CORRECT pattern:
```typescript
const messages = {
  en: { title: 'English Title', description: 'English description' },
  hu: { title: 'Magyar cím', description: 'Magyar leírás' }
};
const content = messages[language as keyof typeof messages] || messages.en;
```
- Example of WRONG pattern:
```typescript
// ❌ NEVER DO THIS
const title = language === 'hu' ? 'Magyar cím' : 'English Title';
```

## Project Context
- **Framework**: Nuxt 4 with TypeScript
- **State Management**: Pinia
- **Styling**: SCSS with CSS custom properties
- **Architecture**: Clean, SOLID principles
- **Structure**: App directory convention

## Always Remember
1. Semicolons on statement ends (not brace ends)
2. No code comments
3. No console.log statements
4. Clean, self-documenting code
5. **NEVER HARDCODE LANGUAGE CODES** - Always use proper internationalization patterns with language objects/maps instead of if-else or ternary operators for language-specific content
6. Use structured language maps instead of language === 'hu' comparisons
5. Consistent TypeScript typing
6. Follow established project patterns
