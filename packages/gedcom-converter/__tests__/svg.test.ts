import { describe, it, expect, beforeEach } from 'vitest';
import { convertToSvg } from '../src/converters/svg.js';
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
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
0 TRLR`;

describe('convertToSvg', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('returns a non-empty SVG string', async () => {
    const result = await convertToSvg(MINIMAL_GEDCOM);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('output is valid SVG (starts with <svg)', async () => {
    const result = await convertToSvg(MINIMAL_GEDCOM);
    expect(result.trim()).toMatch(/^<svg /);
    expect(result).toContain('</svg>');
  });

  it('returns empty SVG for empty GEDCOM', async () => {
    const result = await convertToSvg('0 HEAD\n1 GEDC\n2 VERS 5.5.1\n0 TRLR');
    expect(result).toContain('<svg');
  });
});
