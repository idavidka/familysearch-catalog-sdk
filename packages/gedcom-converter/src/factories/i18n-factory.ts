/**
 * I18n provider factory for pluggable translation.
 * Allows the consuming project to inject its own i18n function.
 *
 * Follows the same pattern as @treeviz/gedcom-parser's i18n-factory.
 */

/**
 * I18n provider function type.
 * Mimics the i18next.t() function signature.
 */
export type I18nProvider = (key: string, options?: Record<string, unknown>) => string;

/** Default provider: returns the key as-is (English fallback). */
const defaultProvider: I18nProvider = (key: string) => key;

let currentProvider: I18nProvider = defaultProvider;

/**
 * Set a custom i18n provider.
 * Call this once at application startup to inject your translation function.
 *
 * @example
 * ```typescript
 * import { setI18nProvider } from '@treeviz/gedcom-convert/factories/i18n-factory';
 * import i18n from './translation/i18n';
 *
 * setI18nProvider((key, options) => i18n.t(key, options));
 * ```
 */
export const setI18nProvider = (provider: I18nProvider): void => {
  currentProvider = provider;
};

/**
 * Get the current i18n provider.
 * Used internally by converter modules for label translation.
 */
export const getI18n = (): I18nProvider => currentProvider;

/**
 * Reset to the default (passthrough) i18n provider.
 * Useful for resetting state between tests.
 */
export const resetI18nProvider = (): void => {
  currentProvider = defaultProvider;
};

/**
 * Convenience object that mimics the i18next interface.
 * Usage: `i18n.t('birth', { name: 'John' })`
 */
export const i18n = {
  t: (key: string, options?: Record<string, unknown>): string =>
    currentProvider(key, options),
};
