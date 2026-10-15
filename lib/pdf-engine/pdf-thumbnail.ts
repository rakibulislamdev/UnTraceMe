/**
 * Helper to render the first page of a PDF file to a canvas data URL
 * Uses client-side pdfjs-dist. Zero server processing.
 */

function setupPdfWorker(pdfjsLib: any) {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    } else {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
  }
}

export async function renderPdfFirstPageThumbnail(file: File): Promise<string | null> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    setupPdfWorker(pdfjsLib);

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      disableFontFace: true,
    });
    const pdf = await loadingTask.promise;

    if (pdf.numPages < 1) return null;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.35 });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    // Hardware-accelerated 2D canvas context (GPU composited)
    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    });

    if (!context) return null;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const url = canvas.toDataURL("image/webp", 0.7);
    page.cleanup();
    pdf.destroy();
    return url;
  } catch (err) {
    console.warn("Could not render PDF first page thumbnail:", err);
    return null;
  }
}

/**
 * Helper to render a single specific page of a PDF file on-demand (used for zoom modal or lazy view)
 */
export async function renderSinglePdfPageThumbnail(
  file: File,
  pageNum: number,
  scale: number = 0.8
): Promise<string | null> {
  let loadingTask: any = null;
  let pdf: any = null;
  let page: any = null;

  try {
    const pdfjsLib = await import("pdfjs-dist");
    setupPdfWorker(pdfjsLib);

    const arrayBuffer = await file.arrayBuffer();
    loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise;

    if (pageNum < 1 || pageNum > pdf.numPages) return null;

    page = await pdf.getPage(pageNum);
    // Scale 2.0 provides ultra-sharp, crisp text readable down to small footnote fonts
    const viewport = page.getViewport({ scale: Math.max(scale, 2.0) });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const context = canvas.getContext("2d");
    if (!context) return null;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL("image/webp", 0.90);
  } catch (err) {
    console.warn(`Could not render single page ${pageNum} preview:`, err);
    return null;
  } finally {
    if (page && typeof page.cleanup === "function") {
      page.cleanup();
    }
    if (pdf && typeof pdf.destroy === "function") {
      pdf.destroy();
    }
    if (loadingTask && typeof loadingTask.destroy === "function") {
      loadingTask.destroy();
    }
  }
}

/**
 * Helper to render thumbnails for a specific range of pages (Lazy / On-Demand)
 */
export async function renderPdfPageRangeThumbnails(
  file: File,
  startPage: number = 1,
  endPage: number = 60,
  onProgress?: (renderedCount: number, pageNum: number, url: string) => void
): Promise<Record<number, string>> {
  const result: Record<number, string> = {};
  let loadingTask: any = null;
  let pdf: any = null;

  try {
    const pdfjsLib = await import("pdfjs-dist");
    setupPdfWorker(pdfjsLib);

    const arrayBuffer = await file.arrayBuffer();
    loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdf = await loadingTask.promise;

    const actualStart = Math.max(1, startPage);
    const actualEnd = Math.min(pdf.numPages, endPage);
    const CHUNK_SIZE = 4; // Chunked batching: process 4 pages at a time

    for (let chunkStart = actualStart; chunkStart <= actualEnd; chunkStart += CHUNK_SIZE) {
      const chunkEnd = Math.min(chunkStart + CHUNK_SIZE - 1, actualEnd);

      for (let pageNum = chunkStart; pageNum <= chunkEnd; pageNum++) {
        let page: any = null;
        try {
          page = await pdf.getPage(pageNum);
          // Scale 0.35 is perfect for thumbnail previews and reduces canvas pixel memory by 70%
          const viewport = page.getViewport({ scale: 0.35 });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          const context = canvas.getContext("2d");

          if (context) {
            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;

            const dataUrl = canvas.toDataURL("image/webp", 0.80);
            result[pageNum] = dataUrl;
            if (onProgress) {
              onProgress(pageNum, pageNum, dataUrl);
            }
          }
        } catch (err) {
          console.warn(`Could not render page ${pageNum} thumbnail:`, err);
        } finally {
          if (page && typeof page.cleanup === "function") {
            page.cleanup();
          }
        }
      }

      // Chunk breathing room: releases CPU & GPU memory buffer back to browser
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  } catch (err) {
    console.warn("Could not render PDF page thumbnails:", err);
  } finally {
    if (pdf && typeof pdf.destroy === "function") {
      pdf.destroy();
    }
    if (loadingTask && typeof loadingTask.destroy === "function") {
      loadingTask.destroy();
    }
  }
  return result;
}
