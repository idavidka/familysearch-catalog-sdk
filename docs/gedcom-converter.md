# `@treeviz/gedcom-convert` — Design & Architecture Documentation

## Overview

`@treeviz/gedcom-convert` is a standalone, reusable TypeScript package responsible for converting GEDCOM data into various output formats. It is designed to be fully decoupled from `@treeviz/gedcom-visualiser` and can be used independently in any Node.js or browser project.

The package builds on top of `@treeviz/gedcom-parser` (a stable, production-ready package) and provides a clean, function-based API for all export/conversion operations.

---

## Goals

- Provide a single source of truth for all GEDCOM export/conversion logic
- Decouple conversion from the visualiser UI
- Enable CLI usage for batch processing and CI pipelines
- Be fully testable in isolation
- Support pluggable i18n, state, and formatting via factories

---

## Package Location

```
packages/
└── gedcom-converter/
    ├── src/
    │   ├── index.ts              # Main entry point
    │   ├── types/
    │   │   └── index.ts          # Shared type definitions
    │   ├── factories/
    │   │   ├── index.ts          # Re-exports all factories
    │   │   ├── i18n-factory.ts   # Pluggable i18n provider
    │   │   └── state-factory.ts  # Pluggable state/settings provider
    │   ├── converters/
    │   │   ├── index.ts          # Re-exports all converters
    │   │   ├── gedcom.ts         # → .ged (GEDCOM)
    │   │   ├── json.ts           # → .json
    │   │   ├── excel.ts          # → .xlsx
    │   │   ├── csv.ts            # → .csv
    │   │   ├── docx.ts           # → .docx (Word)
    │   │   ├── pdf.ts            # → .pdf
    │   │   ├── card.ts           # → .vcf (vCard)
    │   │   └── svg.ts            # → .svg (pedigree chart)
    │   ├── utils/
    │   │   └── index.ts          # Shared formatting helpers
    │   └── cli/
    │       └── index.ts          # CLI entry point
    ├── bin/
    │   └── gedcom-convert.js     # Executable wrapper
    ├── __tests__/
    │   ├── gedcom.test.ts
    │   ├── json.test.ts
    │   ├── excel.test.ts
    │   ├── csv.test.ts
    │   ├── docx.test.ts
    │   ├── pdf.test.ts
    │   ├── card.test.ts
    │   └── svg.test.ts
    ├── package.json
    ├── tsconfig.json
    ├── tsup.config.ts
    ├── vitest.config.ts
    └── README.md
```

---

## Dependencies

| Package | Purpose |
|---|---|
| `@treeviz/gedcom-parser` | Parse GEDCOM files and access structured data |
| `xlsx` | Generate Excel spreadsheets (.xlsx) |
| `csv-stringify` | Generate CSV files |
| `docx` | Generate Word documents (.docx) |
| `pdfkit` | Generate PDF files |
| `commander` | CLI argument parsing |
| `chalk` | CLI output formatting |

---

## Public API

### Core Converter Functions

All converter functions accept a parsed GEDCOM object (from `@treeviz/gedcom-parser`) or a raw GEDCOM string.

```typescript
import {
  convertToGedcom,
  convertToJson,
  convertToExcel,
  convertToCsv,
  convertToDocx,
  convertToPdf,
  convertToCard,
  convertToSvg,
} from '@treeviz/gedcom-convert';
```

#### `convertToGedcom(input, options?)`

Re-serializes parsed GEDCOM data back to a `.ged` string.

```typescript
const gedcomString = await convertToGedcom(parsedGedcom, {
  filter?: IndiKey[],   // Optional: limit to specific individuals
});
```

#### `convertToJson(input, options?)`

Converts GEDCOM to a structured JSON object or JSON string.

```typescript
const json = await convertToJson(parsedGedcom, {
  pretty?: boolean,     // Indent output (default: false)
  filter?: IndiKey[],
});
```

#### `convertToExcel(input, options?)`

Generates an Excel workbook buffer with sheets for individuals, families, sources, etc.

```typescript
const buffer = await convertToExcel(parsedGedcom, {
  sheetPerType?: boolean,  // Separate sheet per entity type (default: true)
  filter?: IndiKey[],
});
```

#### `convertToCsv(input, options?)`

Generates one or multiple CSV strings (one per entity type).

```typescript
const csv = await convertToCsv(parsedGedcom, {
  type?: 'INDI' | 'FAM' | 'all',  // Which entity to export (default: 'INDI')
  delimiter?: string,              // Column delimiter (default: ',')
  filter?: IndiKey[],
});
```

#### `convertToDocx(input, options?)`

Generates a Word document buffer containing formatted individual profiles.

```typescript
const buffer = await convertToDocx(parsedGedcom, {
  includePhotos?: boolean,
  filter?: IndiKey[],
});
```

#### `convertToPdf(input, options?)`

Generates a PDF buffer with formatted genealogical data.

```typescript
const buffer = await convertToPdf(parsedGedcom, {
  includePhotos?: boolean,
  orientation?: 'portrait' | 'landscape',
  filter?: IndiKey[],
});
```

#### `convertToCard(input, options?)`

Generates vCard (`.vcf`) formatted contact cards for individuals.

```typescript
const vcfString = await convertToCard(parsedGedcom, {
  version?: '3.0' | '4.0',  // vCard version (default: '3.0')
  filter?: IndiKey[],
});
```

#### `convertToSvg(input, options?)`

Generates an SVG pedigree/family tree chart.

```typescript
const svgString = await convertToSvg(parsedGedcom, {
  rootIndi?: IndiKey,    // Starting individual
  generations?: number,  // Depth (default: 4)
  direction?: 'top-down' | 'left-right',
});
```

---

## Factory Pattern

Following the convention established in `@treeviz/gedcom-parser`, this package exposes pluggable factories for external dependency injection.

### I18n Factory

Used to inject a translation function so that generated document labels (e.g., "Birth", "Death", "Marriage") appear in the correct language.

```typescript
import { setI18nProvider } from '@treeviz/gedcom-convert/factories';
import i18n from './your-i18n-setup';

setI18nProvider((key, options) => i18n.t(key, options));
```

The default provider returns the key as-is (English fallback).

### State/Settings Factory

Used to inject global settings like name format, date format, place order, etc.

```typescript
import { setConverterSettings } from '@treeviz/gedcom-convert/factories';

setConverterSettings({
  nameOrder: 'given-first',    // 'given-first' | 'surname-first'
  dateFormat: 'DD MMM YYYY',   // date-fns compatible pattern
  placeOrder: 'city-first',    // 'city-first' | 'country-first'
  includePrivate: false,        // Whether to include living individuals
  locale: 'en',                 // Locale hint for formatting
});
```

Settings are persisted globally and can be overridden per-call via options.

---

## Input Variants

Each converter accepts the following input types:

| Type | Description |
|---|---|
| `string` | Raw GEDCOM file content — will be parsed internally |
| `GedComType` | Already-parsed GEDCOM object from `@treeviz/gedcom-parser` |

```typescript
// From raw GEDCOM string:
const result = await convertToJson('0 HEAD\n1 GEDC\n...');

// From pre-parsed object:
import GedcomTree from '@treeviz/gedcom-parser';
const { gedcom } = GedcomTree.parse(rawContent);
const result = await convertToJson(gedcom);
```

---

## CLI Interface

The package ships with a CLI tool: `gedcom-convert`

### Installation

```bash
npm install -g @treeviz/gedcom-convert
```

### Usage

```bash
gedcom-convert <input.ged> --format <format> [options]
```

### Supported Formats

| Format | Description |
|---|---|
| `gedcom` | Re-serialize as .ged |
| `json` | JSON representation |
| `excel` | Excel spreadsheet (.xlsx) |
| `csv` | CSV file |
| `docx` | Word document (.docx) |
| `pdf` | PDF document |
| `card` | vCard (.vcf) |
| `svg` | SVG pedigree chart |

### Options

| Flag | Description | Default |
|---|---|---|
| `--format <fmt>` | Output format (required) | — |
| `--out <path>` | Output file path | `<input>.<ext>` |
| `--filter <ids>` | Comma-separated list of individual IDs to include | all |
| `--pretty` | Pretty-print JSON output | false |
| `--generations <n>` | Number of pedigree generations (SVG only) | 4 |
| `--locale <lang>` | Language for labels (e.g., `hu`, `en`) | `en` |
| `--quiet` | Suppress output messages | false |

### Examples

```bash
# Convert to JSON
gedcom-convert family.ged --format json --out family.json --pretty

# Convert to Excel
gedcom-convert family.ged --format excel --out family.xlsx

# Convert to PDF (filtered)
gedcom-convert family.ged --format pdf --filter @I1@,@I2@ --out output.pdf

# Generate SVG pedigree starting from individual @I1@
gedcom-convert family.ged --format svg --generations 5 --out tree.svg
```

### Exit Codes

| Code | Meaning |
|---|---|
| `0` | Success |
| `1` | Input file not found or unreadable |
| `2` | Parse error (invalid GEDCOM) |
| `3` | Conversion error |
| `4` | Invalid arguments |

---

## Type Definitions

### `ConvertInput`

```typescript
type ConvertInput = string | GedComType;
```

### `BaseConvertOptions`

```typescript
interface BaseConvertOptions {
  filter?: IndiKey[];       // Limit output to specific individuals
  includePrivate?: boolean; // Include living/private individuals
  locale?: string;          // Override locale for labels
}
```

### `ConverterSettings`

```typescript
interface ConverterSettings {
  nameOrder?: 'given-first' | 'surname-first';
  dateFormat?: string;
  placeOrder?: 'city-first' | 'country-first';
  includePrivate?: boolean;
  locale?: string;
}
```

---

## Testing Strategy

All tests use Vitest and mock all file I/O. HTTP calls are not applicable (no network usage).

Each converter module has a dedicated test file covering:

1. **Happy path**: Valid GEDCOM input → expected output format
2. **String input**: Raw GEDCOM string is parsed correctly before converting
3. **Filter option**: Only requested individuals appear in output
4. **Empty input**: Empty GEDCOM tree returns valid but empty output
5. **Error handling**: Invalid input throws descriptive errors

Example test pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { convertToJson } from '../src/converters/json';

describe('convertToJson', () => {
  it('converts a simple GEDCOM to JSON', async () => {
    const input = `0 HEAD\n1 GEDC\n2 VERS 5.5.1\n0 TRLR`;
    const result = await convertToJson(input, { pretty: true });
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed).toBeDefined();
  });
});
```

---

## Acceptance Criteria

- [ ] `@treeviz/gedcom-convert` package exists at `packages/gedcom-converter/`
- [ ] Package uses `@treeviz/gedcom-parser` internally
- [ ] All export formats are implemented: `gedcom`, `json`, `excel`, `csv`, `docx`, `pdf`, `card`, `svg`
- [ ] Factory pattern implemented for i18n and settings
- [ ] CLI interface works and is documented
- [ ] Unit tests cover all converter modules
- [ ] TypeScript strict mode enabled
- [ ] Build succeeds with `npm run build`
- [ ] Tests pass with `npm test`

---

## Rationale

Extracting GEDCOM conversion logic into a standalone package:

- Makes export functionality independently testable and maintainable
- Enables reuse in backend services, batch processing, CI pipelines
- Decouples UI presentation from data transformation
- Allows the visualiser to simply call `convertTo*(gedcom)` and receive a ready-to-download buffer/string
- Follows the same architecture pattern as `@treeviz/gedcom-parser` for consistency within the `@treeviz` ecosystem
