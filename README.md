# @treeviz/familysearch-catalog-sdk

> Part of the [@treeviz](https://www.npmjs.com/org/treeviz) organization - A collection of tools for genealogy data processing and visualization.

A modern TypeScript SDK for interacting with the FamilySearch Catalog and Places APIs. This package provides reusable utilities for resolving place names, looking up parish records, and extracting coverage periods from genealogical records.

## Features

- 🗺️ **Places API** - Search and normalize place names
- 📚 **Catalog API** - Search parish and civil records
- 🔍 **Metadata Parsing** - Extract parish names, date ranges, and registry types
- 💾 **Smart Caching** - In-memory LRU cache with TTL support
- 🔐 **OAuth Integration** - Reuses `@treeviz/familysearch-sdk` for authentication
- 📘 **TypeScript-first** - Full type definitions included
- ⚡ **Promise-based** - Modern async/await API

## Installation

```bash
npm install @treeviz/familysearch-catalog-sdk
```

## Quick Start

```typescript
import { FamilySearchCatalog } from "@treeviz/familysearch-catalog-sdk";

// Initialize the resolver
const resolver = new FamilySearchCatalog({
  clientId: process.env.FS_CLIENT_ID!,
  clientSecret: process.env.FS_CLIENT_SECRET,
  environment: "production",
  enableCache: true,
});

// Resolve a place name
const result = await resolver.resolvePlace("Kismaros, Hungary");

console.log(result);
// Output:
// {
//   placeId: "...",
//   standardizedName: "Kismaros, Pest, Hungary",
//   registry: "Roman Catholic Parish of Nagymaros",
//   coverage: "1730-1895",
//   sources: [...]
// }
```

## Usage

### Basic Place Resolution

```typescript
const result = await resolver.resolvePlace("Budapest");

if (result) {
  console.log(`Standardized: ${result.standardizedName}`);
  console.log(`Registry: ${result.registry}`);
  console.log(`Coverage: ${result.coverage}`);
}
```

### Search Places

```typescript
const places = await resolver.searchPlaces("Kismaros", 5);

for (const place of places) {
  console.log(`${place.name} - ${place.fullName}`);
  
  // URLs are automatically generated for the configured environment
  console.log(`Place details: ${place.url}`);
  console.log(`Catalog search: ${place.catalogUrl}`);
  console.log(`Records search: ${place.recordsUrl}`);
}
```

**Note:** The SDK automatically generates FamilySearch web UI URLs (`url`, `catalogUrl`, `recordsUrl`) for each place result based on the configured environment (production/beta/integration).

### Search Catalog

```typescript
const records = await resolver.searchCatalog("Kismaros, Hungary");

for (const record of records) {
  console.log(`${record.title} (${record.coverageYears})`);
  console.log(`Author: ${record.author}`);
  console.log(`URL: ${record.url}`);
}
```

### Using Individual Modules

```typescript
import { CatalogPlacesClient, PlacesAPI, CatalogAPI } from "@treeviz/familysearch-catalog-sdk";

const client = new CatalogPlacesClient({
  clientId: process.env.FS_CLIENT_ID!,
  environment: "production",
});

const places = new PlacesAPI(client);
const catalog = new CatalogAPI(client);

// Search places
const placeResults = await places.searchPlace("Budapest");

// Search catalog
const catalogResults = await catalog.searchByPlace("Budapest");

// Extract coverage period
const coverage = catalog.getCoveragePeriod(catalogResults);
console.log(`Coverage: ${coverage?.startYear}-${coverage?.endYear}`);
```

### Parser Utilities

```typescript
import * as Parser from "@treeviz/familysearch-catalog-sdk/parser";

// Extract parish name from title
const parish = Parser.extractParishName("Roman Catholic Parish of Nagymaros");
console.log(parish); // "Nagymaros"

// Parse date range
const range = Parser.parseDateRange("Records from 1730-1895");
console.log(range); // { start: 1730, end: 1895 }

// Extract registry type
const type = Parser.extractRegistryType("Roman Catholic Parish of Nagymaros");
console.log(type); // "Roman Catholic"

// Normalize place name
const normalized = Parser.normalizePlaceName("Kismarós");
console.log(normalized); // "kismaros"
```

### Caching

```typescript
const resolver = new FamilySearchCatalog({
  clientId: process.env.FS_CLIENT_ID!,
  enableCache: true,
  cacheTTL: 3600, // 1 hour
});

// First call - makes API request
await resolver.resolvePlace("Budapest");

// Second call - uses cached result
await resolver.resolvePlace("Budapest");

// Clear cache
resolver.clearCache();

// Get cache stats
const stats = resolver.getCacheStats();
console.log(`Cache size: ${stats.size}, enabled: ${stats.enabled}`);
```

### Authentication

```typescript
// Set access token for authenticated requests
resolver.setAccessToken("your-oauth-token");

// Now you can make authenticated requests
const result = await resolver.resolvePlace("Budapest");
```

## API Reference

### FamilySearchCatalog

The main class for high-level operations.

#### Constructor

```typescript
new FamilySearchCatalog(config: CatalogPlacesClientConfig)
```

**Config options:**
- `clientId` (required) - FamilySearch OAuth client ID
- `clientSecret` (optional) - FamilySearch OAuth client secret
- `environment` (optional) - Environment: `"production"` (default), `"beta"`, or `"integration"`
- `enableCache` (optional) - Enable caching (default: `true`)
- `cacheTTL` (optional) - Cache TTL in seconds (default: `3600`)
- `debug` (optional) - Enable debug logging (default: `false`)

#### Methods

- `resolvePlace(placeName, options?)` - Resolve a place name
- `searchPlaces(query, count?)` - Search for places
- `searchCatalog(placeName, count?)` - Search catalog
- `getPlaceById(placeId)` - Get place details by ID
- `setAccessToken(token)` - Set OAuth access token
- `clearCache()` - Clear the cache
- `getCacheStats()` - Get cache statistics

### PlacesAPI

Low-level Places API.

- `searchPlace(query, options?)` - Search for places
- `getPlaceById(placeId)` - Get place by ID
- `normalizePlace(placeName)` - Normalize a place name

### CatalogAPI

Low-level Catalog API.

- `searchByPlace(placeName, options?)` - Search catalog by place
- `getRecordDetails(recordId)` - Get catalog record details
- `getCoveragePeriod(records)` - Extract coverage period from records
- `extractParishInfo(records)` - Extract parish information

### Parser Utilities

- `extractParishName(title)` - Extract parish name from title
- `extractRegistryType(title)` - Extract registry type
- `parseDateRange(text)` - Parse date range from text
- `extractAuthor(attribution)` - Extract author name
- `formatYearRange(start, end)` - Format year range as string
- `normalizePlaceName(placeName)` - Normalize place name for comparison
- `calculateSimilarity(str1, str2)` - Calculate string similarity

## Type Definitions

### ResolvedPlace

```typescript
interface ResolvedPlace {
  placeId: string;
  standardizedName: string;
  registry: string;
  coverage: string;
  sources: CatalogSource[];
}
```

### CatalogSource

```typescript
interface CatalogSource {
  id: string;
  title: string;
  author: string;
  years: string;
  url: string;
}
```

### PlaceSearchResult

```typescript
interface PlaceSearchResult {
  id: string;
  name: string;
  fullName: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  parent?: {
    id: string;
    name: string;
  };
}
```

### CatalogSearchResult

```typescript
interface CatalogSearchResult {
  id: string;
  title: string;
  author: string;
  coverageYears: string;
  place: string;
  type: string;
  url: string;
  metadata?: Record<string, unknown>;
}
```

## Dependencies

This package depends on:
- `@treeviz/familysearch-sdk` - For OAuth authentication and base HTTP client

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## Related Packages

- [@treeviz/familysearch-sdk](https://www.npmjs.com/package/@treeviz/familysearch-sdk) - Core FamilySearch API SDK
- [@treeviz/gedcom-parser](https://www.npmjs.com/package/@treeviz/gedcom-parser) - GEDCOM file parser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

Copyright (c) 2026 idavidka and @treeviz contributors

## Author

idavidka and @treeviz contributors

## Repository

https://github.com/idavidka/familysearch-catalog-sdk
