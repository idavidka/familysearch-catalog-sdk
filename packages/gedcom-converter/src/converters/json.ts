import type { ConvertInput, JsonConvertOptions } from '../types/index.js';
import { resolveInput } from '../utils/index.js';

/**
 * Convert a GEDCOM file to a JSON string.
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns JSON string representation of the GEDCOM tree.
 */
export async function convertToJson(
  input: ConvertInput,
  options: JsonConvertOptions = {},
): Promise<string> {
  const gedcom = resolveInput(input);
  const filter = options.filter;

  const rawJson = gedcom.toJson(undefined, filter ? { indis: filter } : undefined);

  if (options.pretty) {
    try {
      return JSON.stringify(JSON.parse(rawJson), null, 2);
    } catch {
      return rawJson;
    }
  }

  return rawJson;
}
