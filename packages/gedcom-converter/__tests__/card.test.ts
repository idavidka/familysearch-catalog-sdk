import { describe, it, expect, beforeEach } from 'vitest';
import { convertToCard } from '../src/converters/card.js';
import { resetConverterSettings } from '../src/factories/state-factory.js';

const MINIMAL_GEDCOM = `0 HEAD
1 GEDC
2 VERS 5.5.1
1 CHAR UTF-8
0 @I1@ INDI
1 NAME John /Smith/
1 SEX M
1 BIRT
2 DATE 1 JAN 1900
0 @I2@ INDI
1 NAME Mary /Jones/
1 SEX F
0 TRLR`;

describe('convertToCard', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('returns a non-empty vCard string', async () => {
    const result = await convertToCard(MINIMAL_GEDCOM);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('output contains BEGIN:VCARD and END:VCARD markers', async () => {
    const result = await convertToCard(MINIMAL_GEDCOM);
    expect(result).toContain('BEGIN:VCARD');
    expect(result).toContain('END:VCARD');
  });

  it('output contains VERSION field', async () => {
    const result = await convertToCard(MINIMAL_GEDCOM, { version: '4.0' });
    expect(result).toContain('VERSION:4.0');
  });

  it('output includes FN for each individual', async () => {
    const result = await convertToCard(MINIMAL_GEDCOM);
    expect(result).toContain('FN:');
  });
});
