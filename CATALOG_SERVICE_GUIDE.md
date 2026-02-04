# FamilySearch Catalog Service v3 API - Usage Guide

## Overview

The Catalog Service v3 API allows you to search for parish records and church registers on FamilySearch. This API requires **session cookie authentication** (not OAuth tokens).

## Quick Start

### 1. Get Your Session Cookie

1. Log in to [FamilySearch.org](https://www.familysearch.org)
2. Open Developer Tools (F12)
3. Go to **Application** > **Cookies** > `https://www.familysearch.org`
4. Copy all cookie values (especially `fssessionid`)

Example cookie format:
```
fssessionid=abc123...; other=values...
```

### 2. Use the SDK

```typescript
import { FamilySearchCatalog } from '@treeviz/familysearch-catalog-sdk';

// Initialize with session cookie
const resolver = new FamilySearchCatalog({
  environment: 'production',
  sessionCookie: 'fssessionid=abc123...',
  debug: true, // Enable debug logging
});

// Search for catalog records
const records = await resolver.searchCatalogService('Balatonudvari, Veszprém, Magyarország');

// Display results
records.forEach(record => {
  console.log(`${record.title}`);
  console.log(`  Parish: ${record.parish}`);
  console.log(`  Religion: ${record.religion}`);
  console.log(`  Coverage: ${record.coverageYears}`);
  console.log(`  Available at: ${record.repositories.join(', ')}`);
});
```

## API Response Structure

### CatalogServiceRecord

```typescript
{
  id: string;                  // Record identifier (e.g., "91636")
  title: string;               // Record title (e.g., "Anyakönyvek, 1734-1839")
  creators: string[];          // Array of creators/sources
  subjects: string[];          // Subject categories
  coverageYears: string;       // Extracted year range (e.g., "1734-1839")
  repositories: string[];      // Availability (e.g., ["Online", "FamilySearch Library"])
  url: string;                 // Direct link to record
  parish?: string;             // Extracted parish name (e.g., "Balaton-Udvari")
  religion?: string;           // Extracted denomination (e.g., "Református")
}
```

### Example Response

```json
{
  "id": "91636",
  "title": "Anyakönyvek, 1734-1839",
  "creators": [
    "Magyarország. Országos Levéltár",
    "Református Egyház, Balaton-Udvari"
  ],
  "subjects": ["Church records"],
  "coverageYears": "1734-1839",
  "repositories": ["Granite Mountain Record Vault", "FamilySearch Library", "Online"],
  "url": "https://www.familysearch.org/service/search/catalog/item/koha:91636",
  "parish": "Balaton-Udvari",
  "religion": "Református"
}
```

## How It Works

The SDK performs a **two-step search**:

1. **Step 1**: Search by place to get subject IDs
   ```
   GET /service/search/catalog/v3/search?q.place=Balatonudvari&groupBy=placeSubject
   ```

2. **Step 2**: For each subject ID, fetch detailed records
   ```
   GET /service/search/catalog/v3/search?q.place=Balatonudvari&q.subjectId=133492089
   ```

## Supported Religions/Denominations

The SDK automatically detects:

- **Roman Catholic** (`Római Katólikus`)
- **Reformed** (`Református`)
- **Greek Catholic** (`Görög Katólikus`)
- **Lutheran** (`Evangélikus`)
- **Jewish** (`Zsidó`)

## Testing

Run the test script:

```bash
cd packages/familysearch-catalog-sdk
npm run build
node test-catalog-service.js "your-cookie-here" "Balatonudvari, Veszprém, Magyarország"
```

## Advanced Usage

### Set Session Cookie Later

```typescript
const resolver = new FamilySearchCatalog({ environment: 'production' });

// Set cookie later
resolver.setSessionCookie('fssessionid=abc123...');

// Now you can search
const records = await resolver.searchCatalogService('Place Name');
```

### Custom Options

```typescript
const records = await resolver.searchCatalogService('Place Name', 50); // Max 50 results
```

### Error Handling

```typescript
try {
  const records = await resolver.searchCatalogService('Place Name');
} catch (error) {
  if (error.message.includes('Session cookie is required')) {
    console.error('Please provide a valid session cookie');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Important Notes

⚠️ **Session Cookies Expire**: FamilySearch session cookies typically expire after a few hours. You'll need to refresh the cookie periodically.

⚠️ **Undocumented API**: This is an unofficial endpoint that may change without notice. Use with caution in production.

⚠️ **Rate Limiting**: Be respectful of FamilySearch's servers. Cache results when possible.

## Troubleshooting

### "Session cookie is required" Error

Make sure you've set the cookie:
```typescript
resolver.setSessionCookie('fssessionid=...');
```

### No Results Found

- Check if the place name is correct and in the right format
- Verify your session cookie is still valid (try logging in again)
- The place might not have any catalog records

### HTTP 401/403 Errors

Your session cookie has expired. Get a new one by:
1. Log out and log back in to FamilySearch.org
2. Get the new cookie from Developer Tools
3. Update your SDK configuration

## See Also

- [FamilySearch Catalog](https://www.familysearch.org/search/catalog)
- [Places API Documentation](../docs/familysearch_place_film_parish_resolver_guide.md)
- [SDK Main README](./README.md)
