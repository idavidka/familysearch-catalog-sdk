# `@treeviz/gedcom-convert`

Standalone GEDCOM conversion library for JavaScript/TypeScript. Convert GEDCOM genealogy files to multiple output formats: JSON, Excel, CSV, DOCX, PDF, vCard, SVG, and back to GEDCOM.

Built on top of [`@treeviz/gedcom-parser`](https://www.npmjs.com/package/@treeviz/gedcom-parser).

---

## Installation

```bash
npm install @treeviz/gedcom-convert
```

> **Note:** Excel export uses [`exceljs`](https://www.npmjs.com/package/exceljs) instead of `xlsx` (SheetJS), because the `xlsx` package has known unpatched vulnerabilities (ReDoS, prototype pollution). `exceljs` is a well-maintained, vulnerability-free alternative.

## Quick Start

```typescript
import { convertToJson, convertToExcel, convertToPdf } from '@treeviz/gedcom-convert';
import { readFileSync } from 'node:fs';

const gedcomContent = readFileSync('family.ged', 'utf-8');

// Convert to JSON
const json = await convertToJson(gedcomContent, { pretty: true });

// Convert to Excel
const xlsxBuffer = await convertToExcel(gedcomContent);

// Convert to PDF
const pdfBuffer = await convertToPdf(gedcomContent);
```

## Supported Formats

| Format | Function | Output |
|---|---|---|
| GEDCOM | `convertToGedcom` | `string` |
| JSON | `convertToJson` | `string` |
| Excel | `convertToExcel` | `Buffer` |
| CSV | `convertToCsv` | `string` |
| Word | `convertToDocx` | `Buffer` |
| PDF | `convertToPdf` | `Buffer` |
| vCard | `convertToCard` | `string` |
| SVG | `convertToSvg` | `string` |

## API

All converter functions accept either a **raw GEDCOM string** or a **pre-parsed `GedComType`** object from `@treeviz/gedcom-parser`.

### `convertToGedcom(input, options?)`

Re-serializes parsed GEDCOM data back to a `.ged` string.

```typescript
const ged = await convertToGedcom(parsedGedcom);
```

### `convertToJson(input, options?)`

```typescript
const json = await convertToJson(gedcomString, { pretty: true });
```

### `convertToExcel(input, options?)`

```typescript
const buffer = await convertToExcel(gedcomString, { sheetPerType: true });
```

### `convertToCsv(input, options?)`

```typescript
const csv = await convertToCsv(gedcomString, { type: 'INDI', delimiter: ';' });
```

### `convertToDocx(input, options?)`

```typescript
const buffer = await convertToDocx(gedcomString);
```

### `convertToPdf(input, options?)`

```typescript
const buffer = await convertToPdf(gedcomString, { orientation: 'landscape' });
```

### `convertToCard(input, options?)`

```typescript
const vcf = await convertToCard(gedcomString, { version: '4.0' });
```

### `convertToSvg(input, options?)`

```typescript
const svg = await convertToSvg(gedcomString, { rootIndi: '@I1@', generations: 5 });
```

## Factories (Pluggable Configuration)

### I18n Provider

Inject a translation function to localise document labels:

```typescript
import { setI18nProvider } from '@treeviz/gedcom-convert/factories';
import i18n from './i18n';

setI18nProvider((key, options) => i18n.t(key, options));
```

### Global Settings

```typescript
import { setConverterSettings } from '@treeviz/gedcom-convert/factories';

setConverterSettings({
  nameOrder: 'surname-first',
  locale: 'hu',
  dateFormat: 'yyyy. MMM dd.',
  placeOrder: 'country-first',
});
```

## CLI

```bash
npx gedcom-convert family.ged --format json --out family.json --pretty
npx gedcom-convert family.ged --format excel --out family.xlsx
npx gedcom-convert family.ged --format pdf --orientation landscape
npx gedcom-convert family.ged --format svg --generations 5 --out tree.svg
```

### Options

| Flag | Description | Default |
|---|---|---|
| `--format <fmt>` | Output format (required) | — |
| `--out <path>` | Output file path | `<input>.<ext>` |
| `--filter <ids>` | Comma-separated individual IDs | all |
| `--pretty` | Pretty-print JSON | false |
| `--generations <n>` | SVG pedigree depth | 4 |
| `--locale <lang>` | Label locale | `en` |
| `--include-private` | Include private individuals | false |
| `-q, --quiet` | Suppress output | false |

## License

MIT
