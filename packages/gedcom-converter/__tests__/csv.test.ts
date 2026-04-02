import { describe, it, expect, beforeEach } from 'vitest';
import { convertToCsv } from '../src/converters/csv.js';
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
2 PLAC London
0 @I2@ INDI
1 NAME Mary /Jones/
1 SEX F
0 TRLR`;

describe('convertToCsv', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('returns a non-empty CSV string for INDI type', async () => {
    const result = await convertToCsv(MINIMAL_GEDCOM, { type: 'INDI' });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('output contains header row', async () => {
    const result = await convertToCsv(MINIMAL_GEDCOM, { type: 'INDI' });
    expect(result.split('\n').length).toBeGreaterThan(1);
  });

  it('supports custom delimiter', async () => {
    const result = await convertToCsv(MINIMAL_GEDCOM, { type: 'INDI', delimiter: ';' });
    expect(result).toContain(';');
  });
});
