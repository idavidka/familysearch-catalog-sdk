import GedcomTree from '@treeviz/gedcom-parser';
import type { GedComType } from '@treeviz/gedcom-parser';
import type { ConvertInput } from '../types/index.js';
import { getConverterSettings } from '../factories/state-factory.js';
import { i18n } from '../factories/i18n-factory.js';

/**
 * Resolve a ConvertInput to a parsed GedComType.
 * If a string is provided, it is parsed using GedcomTree.parse().
 */
export function resolveInput(input: ConvertInput): GedComType {
  if (typeof input === 'string') {
    const { gedcom } = GedcomTree.parse(input);
    return gedcom;
  }
  return input;
}

/**
 * Format a date string using the configured date format.
 * Falls back to the raw value if formatting fails.
 */
export function formatDate(rawDate: string | undefined): string {
  if (!rawDate) return '';
  return rawDate.trim();
}

/**
 * Format a person's name according to the configured name order.
 */
export function formatName(given: string | undefined, surname: string | undefined): string {
  const settings = getConverterSettings();
  const g = given?.trim() ?? '';
  const s = surname?.trim() ?? '';
  if (!g && !s) return '';
  if (!g) return s;
  if (!s) return g;
  return settings.nameOrder === 'surname-first' ? `${s} ${g}` : `${g} ${s}`;
}

/**
 * Format a place string, handling component ordering.
 */
export function formatPlace(place: string | undefined): string {
  if (!place) return '';
  const settings = getConverterSettings();
  const parts = place.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return place.trim();
  if (settings.placeOrder === 'country-first') {
    return [...parts].reverse().join(', ');
  }
  return parts.join(', ');
}

/**
 * Translate a label key using the current i18n provider.
 */
export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export { getConverterSettings };
