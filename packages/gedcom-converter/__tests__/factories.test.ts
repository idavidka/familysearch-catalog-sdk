import { describe, it, expect, beforeEach } from 'vitest';
import { setI18nProvider, getI18n, resetI18nProvider, i18n } from '../src/factories/i18n-factory.js';
import { setConverterSettings, getConverterSettings, resetConverterSettings } from '../src/factories/state-factory.js';

describe('i18n-factory', () => {
  beforeEach(() => {
    resetI18nProvider();
  });

  it('default provider returns the key as-is', () => {
    expect(i18n.t('birth')).toBe('birth');
    expect(i18n.t('some_key')).toBe('some_key');
  });

  it('custom provider is called with the key', () => {
    const translations: Record<string, string> = { birth: 'Születés', death: 'Halálozás' };
    setI18nProvider((key) => translations[key] ?? key);
    expect(i18n.t('birth')).toBe('Születés');
    expect(i18n.t('death')).toBe('Halálozás');
    expect(i18n.t('unknown_key')).toBe('unknown_key');
  });

  it('resetI18nProvider restores the default', () => {
    setI18nProvider(() => 'always-this');
    expect(i18n.t('anything')).toBe('always-this');
    resetI18nProvider();
    expect(i18n.t('birth')).toBe('birth');
  });

  it('getI18n returns the current provider function', () => {
    const provider = getI18n();
    expect(typeof provider).toBe('function');
    expect(provider('hello')).toBe('hello');
  });
});

describe('state-factory', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('default settings have expected values', () => {
    const s = getConverterSettings();
    expect(s.nameOrder).toBe('given-first');
    expect(s.locale).toBe('en');
    expect(s.includePrivate).toBe(false);
  });

  it('setConverterSettings merges settings', () => {
    setConverterSettings({ locale: 'hu', nameOrder: 'surname-first' });
    const s = getConverterSettings();
    expect(s.locale).toBe('hu');
    expect(s.nameOrder).toBe('surname-first');
    expect(s.includePrivate).toBe(false);
  });

  it('resetConverterSettings restores defaults', () => {
    setConverterSettings({ locale: 'de', includePrivate: true });
    resetConverterSettings();
    const s = getConverterSettings();
    expect(s.locale).toBe('en');
    expect(s.includePrivate).toBe(false);
  });
});
