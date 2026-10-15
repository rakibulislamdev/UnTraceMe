/**
 * Helper to render the first page of a PDF file to a canvas data URL
 * Uses client-side pdfjs-dist. Zero server processing.
 */

export async function renderPdfFirstPageThumbnail(file: File): Promise<string | null> {
  try {
    const pdfjsLib = await import("pdfjs-dist");

    // Configure worker via CDN to avoid bundler worker file loader issues
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    if (pdf.numPages < 1) return null;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.5 }); // thumbnail resolution

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    if (!context) return null;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL("image/webp", 0.8);
  } catch (err) {
    console.warn("Could not render PDF first page thumbnail:", err);
    return null;
  }
}

/**
 * Helper to render thumbnails for all pages of a PDF document
 */
export async function renderAllPdfPageThumbnails(
  file: File,
  maxPages: number = 30
): Promise<Record<number, string>> {
  const result: Record<number, string> = {};
  try {
    const pdfjsLib = await import("pdfjs-dist");

    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const totalToRender = Math.min(pdf.numPages, maxPages);

    for (let pageNum = 1; pageNum <= totalToRender; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
          result[pageNum] = canvas.toDataURL("image/webp", 0.92);
        }
      } catch (err) {
        console.warn(`Could not render page ${pageNum} thumbnail:`, err);
      }
    }
  } catch (err) {
    console.warn("Could not render PDF page thumbnails:", err);
  }
  return result;
}
