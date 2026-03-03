# GitHub Copilot Instructions - FamilySearch Catalog SDK

---

## ⚠️ MANDATORY BEHAVIORAL RULES — READ FIRST, ALWAYS APPLY

These rules are **non-negotiable** and apply to **every single response**, without exception.

### 1. 🌐 Response Language

> **ALWAYS respond in the same language the user used in their question.**
> - User writes in Hungarian → respond in Hungarian
> - User writes in English → respond in English
> - **NEVER** switch languages mid-response unless the user explicitly asks
> - This rule overrides all other language rules in this document

### 2. 📝 Suggested Commit Message — ALWAYS Required After Changes

> **EVERY response where any file, code, or configuration was modified MUST end with a suggested commit message.**
> This is automatic and unconditional — never skip it, never ask if needed.

**Required format at the end of every modifying response:**

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```

**Rules:**
- Use **Conventional Commits** format: `type(scope): subject`
- Keep it **under 72 characters**
- Use **imperative mood** ("add feature", not "added feature")
- **Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

---

## Project Overview

**FamilySearch Catalog SDK** (`@treeviz/familysearch-catalog-sdk`) is a TypeScript SDK for interacting with the FamilySearch Catalog and Places APIs. It provides a type-safe interface for querying parish records, coverage periods, and resolving place names.

### Tech Stack

- **Language**: TypeScript
- **Build Tool**: tsup
- **Testing**: Vitest
- **HTTP Client**: axios
- **Peer Dependency**: `@treeviz/familysearch-sdk`
- **Module Format**: ES Modules + CJS

### Project Structure

```
familysearch-catalog-sdk/
├── src/
│   ├── client/        # HTTP client setup and configuration
│   ├── catalog/       # Catalog API (parish records, collections)
│   ├── places/        # Places API (place resolution, hierarchy)
│   ├── parser/        # Response parsing utilities
│   ├── cache/         # Caching layer for API responses
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Helper utilities
│   ├── __tests__/     # Unit tests
│   └── index.ts       # Main entry point
├── CATALOG_SERVICE_GUIDE.md
└── README.md
```

### Key Features

1. **Catalog API**: Query FamilySearch catalog collections and parish records
2. **Places API**: Resolve place names and navigate geographic hierarchy
3. **Coverage Periods**: Fetch available time ranges for record collections
4. **Caching**: Built-in cache layer to reduce redundant API calls
5. **Type Safety**: Full TypeScript support with detailed response types
6. **Axios-based**: Reliable HTTP client with interceptor support

### Code Style & Conventions

1. **Language**: All code, comments, and documentation must be in **English**
   - Variable names, function names, class names must be in English
   - All inline and documentation comments must be in English
   - All `.md` files must be in English
   - **Copilot Responses**: Always respond in the **same language as the user's question**
2. **TypeScript**: Strict mode enabled, avoid `any` types
3. **File Naming**: `kebab-case.ts`
4. **Error Handling**: Throw descriptive, typed errors with context
5. **Testing**: Mock all HTTP requests in tests (no real API calls)
6. **Caching**: Cache expensive API calls; document TTL assumptions

### Commit Message Convention

Follow **Conventional Commits** specification:

**Format:** `<type>(<scope>): <subject>`

**Examples:**
```
feat(catalog): add coverage period filtering
fix(places): handle missing place hierarchy
docs: update catalog search guide
test(cache): add cache invalidation tests
refactor(parser): simplify record parsing logic
```

### Common Tasks

#### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

#### Building
```bash
npm run build         # Build for production (tsup)
npm run dev           # Development watch mode
npm run clean         # Remove dist/
```

#### Publishing to NPM
```bash
npm version patch|minor|major
npm run build
npm publish
```

### API Structure

#### Entry Points (package.json exports)

- `.` — Main index (re-exports everything)
- `./client` — HTTP client configuration
- `./catalog` — Catalog API functions
- `./places` — Places API functions
- `./parser` — Response parsers
- `./cache` — Cache utilities

#### Usage Example

```typescript
import { CatalogClient } from '@treeviz/familysearch-catalog-sdk';
import { FamilySearchClient } from '@treeviz/familysearch-sdk';

const fsClient = new FamilySearchClient({ appKey: 'YOUR_KEY', redirectUri: '...' });
const catalogClient = new CatalogClient({ fsClient });

// Search parish records
const results = await catalogClient.searchParishRecords({ place: 'Budapest', year: 1850 });

// Resolve a place
const place = await catalogClient.resolvePlace('Budapest, Hungary');
```

### Testing Best Practices

1. **Mock HTTP**: Use Vitest to mock axios responses
2. **Test Cache**: Verify cache hit/miss logic separately
3. **Error Cases**: Test API errors (404, 401, 429, 500)
4. **Type Assertions**: Ensure response types match TypeScript definitions

### Security Best Practices

1. **Auth Token**: Delegate authentication to `@treeviz/familysearch-sdk`
2. **No Hardcoded Keys**: Never commit API keys or tokens
3. **HTTPS Only**: All API calls must use HTTPS

### Common Issues & Solutions

#### Missing Peer Dependency
- Ensure `@treeviz/familysearch-sdk` is installed as a peer dependency
- The catalog SDK requires an authenticated FamilySearch client

#### Rate Limiting
- FamilySearch Catalog API has rate limits
- Use the built-in cache to reduce API calls
- Handle 429 responses with retry logic

### Contact & Resources

- **NPM Package**: `@treeviz/familysearch-catalog-sdk`
- **Repository**: https://github.com/idavidka/familysearch-catalog-sdk
- **FamilySearch API Docs**: https://www.familysearch.org/developers/
- **Parent Project**: TreeViz Monorepo

---

**When working on this project:**
1. Always write in English (code, comments, docs)
2. Mock all HTTP requests in tests
3. Follow FamilySearch API guidelines
4. Use the cache layer for expensive queries
5. Implement proper error handling
6. **After completing changes, ALWAYS suggest a commit message** following Conventional Commits format

**Commit Message Reminder:**
After making any changes, ALWAYS provide a suggested commit message at the end of your response:

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```
