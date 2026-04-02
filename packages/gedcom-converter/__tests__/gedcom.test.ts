import { describe, it, expect, beforeEach } from 'vitest';
import { convertToGedcom } from '../src/converters/gedcom.js';
import { resetConverterSettings } from '../src/factories/state-factory.js';

const MINIMAL_GEDCOM = `0 HEAD
1 GEDC
2 VERS 5.5.1
1 CHAR UTF-8
0 @I1@ INDI
1 NAME John /Smith/
1 SEX M
0 @I2@ INDI
1 NAME Mary /Jones/
1 SEX F
0 TRLR`;

describe('convertToGedcom', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('round-trips a GEDCOM string', async () => {
    const result = await convertToGedcom(MINIMAL_GEDCOM);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('output contains HEAD and TRLR markers', async () => {
    const result = await convertToGedcom(MINIMAL_GEDCOM);
    expect(result).toContain('HEAD');
    expect(result).toContain('TRLR');
  });

  it('output contains individual records', async () => {
    const result = await convertToGedcom(MINIMAL_GEDCOM);
    expect(result).toContain('INDI');
  });
});
