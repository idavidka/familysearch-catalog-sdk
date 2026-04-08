import type { ConvertInput, SvgConvertOptions } from '../types/index.js';
import type { IndiKey } from '../types/index.js';
import { resolveInput } from '../utils/index.js';

/**
 * Convert GEDCOM data to an SVG pedigree chart.
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns SVG string.
 */
export async function convertToSvg(
  input: ConvertInput,
  options: SvgConvertOptions = {},
): Promise<string> {
  const gedcom = resolveInput(input);
  const generations = options.generations ?? 4;
  const direction = options.direction ?? 'left-right';
  const boxW = options.boxWidth ?? 200;
  const boxH = options.boxHeight ?? 80;
  const hGap = 40;
  const vGap = 20;

  const rootKey = options.rootIndi ?? (gedcom.indis()?.keys()[0] as IndiKey | undefined);
  if (!rootKey) {
    return '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  }

  interface TreeNode {
    id: IndiKey;
    gen: number;
    pos: number;
  }

  const nodes: TreeNode[] = [];
  const queue: { id: IndiKey; gen: number; pos: number }[] = [{ id: rootKey, gen: 0, pos: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id) || current.gen >= generations) continue;
    visited.add(current.id);
    nodes.push(current);

    const indi = gedcom.indi(current.id);
    if (!indi) continue;

    const parentFams = indi.getFamilies('FAMC');
    if (parentFams) {
      parentFams.forEach((fam) => {
        if (!fam) return;
        const father = fam.getHusband()?.first();
        const mother = fam.getWife()?.first();
        if (father) {
          queue.push({ id: father.id as IndiKey, gen: current.gen + 1, pos: current.pos * 2 });
        }
        if (mother) {
          queue.push({ id: mother.id as IndiKey, gen: current.gen + 1, pos: current.pos * 2 + 1 });
        }
      });
    }
  }

  const maxGen = Math.max(...nodes.map((n) => n.gen), 0);
  const maxPosPerGen = new Map<number, number>();
  for (const node of nodes) {
    const maxPos = maxPosPerGen.get(node.gen) ?? 0;
    if (node.pos > maxPos) maxPosPerGen.set(node.gen, node.pos);
  }

  const totalCols = maxGen + 1;
  const totalRows = Math.pow(2, maxGen);

  const svgWidth = direction === 'left-right'
    ? totalCols * (boxW + hGap) + hGap
    : totalRows * (boxW + hGap) + hGap;

  const svgHeight = direction === 'left-right'
    ? totalRows * (boxH + vGap) + vGap
    : totalCols * (boxH + vGap) + vGap;

  const elements: string[] = [];

  for (const node of nodes) {
    const indi = gedcom.indi(node.id);
    const name = indi?.toName() ?? node.id;
    const birth = indi?.getBirthDate() ?? '';

    let x: number;
    let y: number;
    const slotCount = Math.pow(2, node.gen);
    const slotH = svgHeight / slotCount;

    if (direction === 'left-right') {
      x = node.gen * (boxW + hGap) + hGap;
      y = node.pos * slotH + (slotH - boxH) / 2;
    } else {
      x = node.pos * (boxW + hGap) + hGap;
      y = node.gen * (boxH + vGap) + vGap;
    }

    elements.push(renderBox(x, y, boxW, boxH, name, birth));
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`,
    `<style>`,
    `.box { fill: #f0f4ff; stroke: #4a6fb5; stroke-width: 1.5; rx: 6; }`,
    `.name { font-family: sans-serif; font-size: 12px; font-weight: bold; fill: #222; }`,
    `.detail { font-family: sans-serif; font-size: 10px; fill: #555; }`,
    `</style>`,
    ...elements,
    `</svg>`,
  ].join('\n');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderBox(x: number, y: number, w: number, h: number, name: string, detail: string): string {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="box"/>`,
    `<text x="${x + w / 2}" y="${y + h / 2 - 8}" text-anchor="middle" class="name">${escapeXml(name)}</text>`,
    detail
      ? `<text x="${x + w / 2}" y="${y + h / 2 + 10}" text-anchor="middle" class="detail">${escapeXml(detail)}</text>`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}
