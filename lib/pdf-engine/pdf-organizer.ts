/**
 * PDF Splitter & Page Organizer Engine
 * Built on pdf-lib (100% in-browser).
 * Reorders pages, extracts selected pages, rotates pages, and splits documents without server uploads.
 */

import { PDFDocument, degrees } from "pdf-lib";

export interface PdfPageItem {
  pageNumber: number; // 1-indexed
  originalIndex: number; // 0-indexed
  rotation: number; // 0, 90, 180, 270
  isSelected: boolean;
}

export interface SplitPdfResult {
  blob: Blob;
  filename: string;
  sizeBytes: number;
  pageCount: number;
}

/**
 * Creates a new PDF document from selected / reordered pages of an input PDF
 */
export async function organizePdfPages(
  file: File,
  pages: { pageIndex: number; rotation: number }[],
  outputFilename: string
): Promise<SplitPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  // Copy specified pages into new document
  const indices = pages.map((p) => p.pageIndex);
  const copiedPages = await newDoc.copyPages(sourceDoc, indices);

  copiedPages.forEach((page, i) => {
    const additionalRotation = pages[i].rotation || 0;
    const currentAngle = page.getRotation().angle;
    page.setRotation(degrees((currentAngle + additionalRotation) % 360));
    newDoc.addPage(page);
  });

  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });

  return {
    blob,
    filename: outputFilename,
    sizeBytes: blob.size,
    pageCount: copiedPages.length,
  };
}

/**
 * Extracts each page into an individual separate PDF document
 */
export async function splitAllPdfPages(
  file: File
): Promise<{ pageNumber: number; blob: Blob; filename: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = sourceDoc.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  const results: { pageNumber: number; blob: Blob; filename: string }[] = [];

  for (let i = 0; i < totalPages; i++) {
    const singleDoc = await PDFDocument.create();
    const [page] = await singleDoc.copyPages(sourceDoc, [i]);
    singleDoc.addPage(page);
    const pdfBytes = await singleDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    results.push({
      pageNumber: i + 1,
      blob,
      filename: `${baseName}-page-${i + 1}.pdf`,
    });
  }

  return results;
}
