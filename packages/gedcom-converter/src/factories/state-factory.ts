import type { ConverterSettings } from '../types/index.js';

/**
 * State/settings factory for pluggable global converter configuration.
 * Allows the consuming project to inject default settings such as
 * name order, date format, locale, etc.
 */

const defaultSettings: ConverterSettings = {
  nameOrder: 'given-first',
  dateFormat: 'dd MMM yyyy',
  placeOrder: 'city-first',
  includePrivate: false,
  locale: 'en',
};

let currentSettings: ConverterSettings = { ...defaultSettings };

/**
 * Set global converter settings.
 * These will be used as defaults for all converter calls unless overridden per-call.
 *
 * @example
 * ```typescript
 * import { setConverterSettings } from '@treeviz/gedcom-convert/factories/state-factory';
 *
 * setConverterSettings({
 *   nameOrder: 'surname-first',
 *   locale: 'hu',
 *   dateFormat: 'yyyy. MMM dd.',
 * });
 * ```
 */
export const setConverterSettings = (settings: Partial<ConverterSettings>): void => {
  currentSettings = { ...currentSettings, ...settings };
};

/**
 * Get the current global converter settings.
 * Used internally by converters to apply defaults.
 */
export const getConverterSettings = (): ConverterSettings => ({ ...currentSettings });

/**
 * Reset settings to their built-in defaults.
 * Useful for resetting state between tests.
 */
export const resetConverterSettings = (): void => {
  currentSettings = { ...defaultSettings };
};
