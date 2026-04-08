import type { GedComType, IndiKey } from '@treeviz/gedcom-parser';

/**
 * Input accepted by all converter functions.
 * Can be a raw GEDCOM string or an already-parsed GedCom object.
 */
export type ConvertInput = string | GedComType;

/**
 * Base options shared across all converters.
 */
export interface BaseConvertOptions {
  /** Limit output to a specific set of individual IDs. */
  filter?: IndiKey[];
  /** Whether to include living/private individuals. Default: false */
  includePrivate?: boolean;
  /** Locale override for label translations (e.g. 'hu', 'en'). */
  locale?: string;
}

/**
 * Options for convertToGedcom.
 */
export type GedcomConvertOptions = BaseConvertOptions;

/**
 * Options for convertToJson.
 */
export interface JsonConvertOptions extends BaseConvertOptions {
  /** Pretty-print the JSON output. Default: false */
  pretty?: boolean;
}

/**
 * Options for convertToExcel.
 */
export interface ExcelConvertOptions extends BaseConvertOptions {
  /** Create a separate sheet per entity type (INDI, FAM, SOUR, etc.). Default: true */
  sheetPerType?: boolean;
}

/**
 * Options for convertToCsv.
 */
export interface CsvConvertOptions extends BaseConvertOptions {
  /** Which entity type to export. Default: 'INDI' */
  type?: 'INDI' | 'FAM' | 'SOUR' | 'all';
  /** Column delimiter. Default: ',' */
  delimiter?: string;
}

/**
 * Options for convertToDocx.
 */
export interface DocxConvertOptions extends BaseConvertOptions {
  /** Include media/photos in the document. Default: false */
  includePhotos?: boolean;
}

/**
 * Options for convertToPdf.
 */
export interface PdfConvertOptions extends BaseConvertOptions {
  /** Include media/photos in the PDF. Default: false */
  includePhotos?: boolean;
  /** Page orientation. Default: 'portrait' */
  orientation?: 'portrait' | 'landscape';
}

/**
 * Options for convertToCard (vCard).
 */
export interface CardConvertOptions extends BaseConvertOptions {
  /** vCard format version. Default: '3.0' */
  version?: '3.0' | '4.0';
}

/**
 * Options for convertToSvg.
 */
export interface SvgConvertOptions extends BaseConvertOptions {
  /** The root individual to start the pedigree chart from. */
  rootIndi?: IndiKey;
  /** Number of ancestor generations to render. Default: 4 */
  generations?: number;
  /** Chart layout direction. Default: 'left-right' */
  direction?: 'top-down' | 'left-right';
  /** Box width in pixels. Default: 200 */
  boxWidth?: number;
  /** Box height in pixels. Default: 80 */
  boxHeight?: number;
}

/**
 * Global converter settings injected via the state factory.
 */
export interface ConverterSettings {
  /** Name formatting order. Default: 'given-first' */
  nameOrder?: 'given-first' | 'surname-first';
  /** date-fns compatible date format pattern. Default: 'dd MMM yyyy' */
  dateFormat?: string;
  /** Place component ordering. Default: 'city-first' */
  placeOrder?: 'city-first' | 'country-first';
  /** Include living/private individuals by default. Default: false */
  includePrivate?: boolean;
  /** Default locale for label translations. Default: 'en' */
  locale?: string;
}

export type { GedComType, IndiKey };
