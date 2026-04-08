import type { ConvertInput, GedcomConvertOptions } from '../types/index.js';
import { resolveInput } from '../utils/index.js';

/**
 * Re-serialize a parsed GEDCOM tree back to a .ged string.
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns GEDCOM-formatted string.
 */
export async function convertToGedcom(
  input: ConvertInput,
  options: GedcomConvertOptions = {},
): Promise<string> {
  const gedcom = resolveInput(input);
  const filter = options.filter;

  return gedcom.toGedcom(undefined, 0, filter ? { indis: filter } : undefined);
}
