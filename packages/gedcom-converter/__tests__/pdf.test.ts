import { describe, it, expect, beforeEach } from 'vitest';
import { convertToPdf } from '../src/converters/pdf.js';
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
0 TRLR`;

describe('convertToPdf', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('returns a non-empty Buffer', async () => {
    const result = await convertToPdf(MINIMAL_GEDCOM);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });

  it('output starts with PDF magic bytes (%PDF)', async () => {
    const result = await convertToPdf(MINIMAL_GEDCOM);
    const header = result.slice(0, 5).toString('ascii');
    expect(header).toMatch(/^%PDF-/);
  });

  it('supports landscape orientation', async () => {
    const result = await convertToPdf(MINIMAL_GEDCOM, { orientation: 'landscape' });
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });
});
