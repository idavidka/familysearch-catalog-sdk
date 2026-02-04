# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-03

### Added
- Initial release of `@treeviz/familysearch-catalog-sdk`
- **FamilySearchCatalog** - High-level API for resolving place names and parish records
- **PlacesAPI** - Search and normalize FamilySearch places
- **CatalogAPI** - Search FamilySearch catalog for parish records
- **Parser utilities** - Extract parish names, date ranges, and registry types
- **MemoryCache** - LRU cache with TTL support
- **Environment-aware URL generation** - Automatically generate FamilySearch web UI URLs based on environment (production/beta/integration)
  - `url` - Place details page URL
  - `catalogUrl` - Catalog search URL with place filter
  - `recordsUrl` - Historical records search URL
- **TypeScript-first** - Full type definitions included
- **OAuth integration** - Reuses `@treeviz/familysearch-sdk` for authentication
- **CLI example tool** - `npm run example:cli` for testing place searches

### Features
- 🗺️ Places API - Search and normalize place names
- 📚 Catalog API - Search parish and civil records
- 🔍 Metadata Parsing - Extract parish names, date ranges, registry types
- 💾 Smart Caching - In-memory LRU cache with TTL
- 🔐 OAuth Support - Token-based authentication
- 📘 TypeScript - Full type definitions
- ⚡ Promise-based - Modern async/await API
- 🌍 Multi-environment - Production, beta, integration support

### Dependencies
- `@treeviz/familysearch-sdk` - Core FamilySearch API SDK

### Package Metadata
- **Repository**: https://github.com/idavidka/familysearch-catalog-sdk
- **Author**: idavidka and @treeviz contributors
- **License**: MIT
- **Node**: >=20.0.0
