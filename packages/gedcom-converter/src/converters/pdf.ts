import PDFDocument from 'pdfkit';
import type { Common } from '@treeviz/gedcom-parser';
import type { ConvertInput, PdfConvertOptions } from '../types/index.js';
import { resolveInput, t } from '../utils/index.js';

/**
 * Convert GEDCOM data to a PDF buffer.
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns Buffer containing the PDF document.
 */
export async function convertToPdf(
  input: ConvertInput,
  options: PdfConvertOptions = {},
): Promise<Buffer> {
  const gedcom = resolveInput(input);
  const filterKeys = options.filter ? new Set(options.filter) : null;
  const layout = options.orientation === 'landscape' ? 'landscape' : 'portrait';

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ layout, margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).font('Helvetica-Bold').text(t('family_tree'), { align: 'center' });
    doc.moveDown();

    const indis = gedcom.indis();

    if (indis) {
      indis.forEach((indi) => {
        if (!indi) return;
        const key = indi.id as string;
        if (filterKeys && !filterKeys.has(key as never)) return;

        const name = indi.toName() ?? key;
        const sex = indi.get<Common>('SEX')?.toValue() ?? '';
        const birthDate = indi.getBirthDate() ?? '';
        const birthPlace = indi.getBirthPlace() ?? '';
        const deathDate = indi.getDeathDate() ?? '';
        const deathPlace = indi.getDeathPlace() ?? '';

        if (doc.y > doc.page.height - 150) {
          doc.addPage();
        }

        doc.fontSize(14).font('Helvetica-Bold').text(name);
        doc.fontSize(10).font('Helvetica');

        if (sex) {
          doc.text(`${t('sex')}: ${sex}`);
        }
        if (birthDate || birthPlace) {
          doc.text(`${t('birth')}: ${[birthDate, birthPlace].filter(Boolean).join(', ')}`);
        }
        if (deathDate || deathPlace) {
          doc.text(`${t('death')}: ${[deathDate, deathPlace].filter(Boolean).join(', ')}`);
        }

        doc.moveDown(0.5);
        doc
          .strokeColor('#cccccc')
          .lineWidth(0.5)
          .moveTo(50, doc.y)
          .lineTo(doc.page.width - 50, doc.y)
          .stroke();
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
}
