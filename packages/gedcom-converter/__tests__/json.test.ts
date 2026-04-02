import { describe, it, expect, beforeEach } from 'vitest';
import { convertToJson } from '../src/converters/json.js';
import { resetConverterSettings } from '../src/factories/state-factory.js';
import { resetI18nProvider } from '../src/factories/i18n-factory.js';

const MINIMAL_GEDCOM = `0 HEAD
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
1 CHAR UTF-8
0 @I1@ INDI
1 NAME John /Smith/
1 SEX M
1 BIRT
2 DATE 1 JAN 1900
2 PLAC London
1 DEAT
2 DATE 5 MAR 1970
2 PLAC Paris
0 @I2@ INDI
1 NAME Mary /Jones/
1 SEX F
1 BIRT
2 DATE 15 JUN 1905
0 TRLR`;

describe('convertToJson', () => {
  beforeEach(() => {
    resetConverterSettings();
    resetI18nProvider();
  });

  it('converts a simple GEDCOM string to JSON', async () => {
    const result = await convertToJson(MINIMAL_GEDCOM);
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed).toBeDefined();
  });

  it('returns pretty-printed JSON when pretty option is true', async () => {
    const result = await convertToJson(MINIMAL_GEDCOM, { pretty: true });
    expect(result).toContain('\n');
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('returns compact JSON when pretty option is false', async () => {
    const compact = await convertToJson(MINIMAL_GEDCOM, { pretty: false });
    const pretty = await convertToJson(MINIMAL_GEDCOM, { pretty: true });
    expect(compact.length).toBeLessThan(pretty.length);
  });
});
