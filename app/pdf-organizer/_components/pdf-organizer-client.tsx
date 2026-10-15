"use client";

import React, { useState } from "react";
import { AlertCircleIcon } from "hugeicons-react";
import {
  organizePdfPages,
  splitAllPdfPages,
  SplitPdfResult,
} from "@/lib/pdf-engine/pdf-organizer";
import { renderPdfPageRangeThumbnails } from "@/lib/pdf-engine/pdf-thumbnail";
import { PDFDocument } from "pdf-lib";
import { PageMeta } from "./types";
import { PdfDropzone } from "./pdf-dropzone";
import { PdfOrganizerWorkspace } from "./pdf-organizer-workspace";
import { PdfPreviewModal } from "./pdf-preview-modal";
import { PdfResultCard } from "./pdf-result-card";

export function PdfOrganizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [result, setResult] = useState<SplitPdfResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activePreviewPage, setActivePreviewPage] = useState<number | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const renderedPagesRef = React.useRef<Set<number>>(new Set());
  const isRenderingBatchRef = React.useRef<boolean>(false);

  const handleFileChange = async (selectedFile: File) => {
    // 1. Strict Extension & MIME validation
    const hasPdfExtension = /\.pdf$/i.test(selectedFile.name);
    const isPdfMime = selectedFile.type === "application/pdf" || selectedFile.type === "";

    if (!hasPdfExtension && !isPdfMime) {
      setErrorMessage(`Invalid file: "${selectedFile.name}". Only PDF documents (.pdf) are allowed.`);
      return;
    }

    setIsLoadingPdf(true);
    setErrorMessage(null);
    setResult(null);

    try {
      // 2. Strict Magic Header validation
      const headerBytes = new Uint8Array(await selectedFile.slice(0, 5).arrayBuffer());
      const headerString = String.fromCharCode(...headerBytes);
      if (!headerString.startsWith("%PDF-")) {
        setErrorMessage(`Corrupted or fake PDF: "${selectedFile.name}" does not have a valid %PDF- binary header.`);
        setIsLoadingPdf(false);
        return;
      }

      // Fast in-browser page count extraction using PDF.js worker
      const pdfjsLib = await import("pdfjs-dist");
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }

      const buffer = await selectedFile.arrayBuffer();
      let totalPages = 0;

      try {
        const loadingTask = pdfjsLib.getDocument({
          data: buffer,
          disableFontFace: true,
        });
        const pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
      } catch (pdfjsErr) {
        console.warn("PDF.js count fallback to pdf-lib:", pdfjsErr);
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        totalPages = doc.getPageCount();
      }

      if (totalPages === 0) {
        setErrorMessage("Could not detect any pages in this document.");
        setIsLoadingPdf(false);
        return;
      }

      const initialPages: PageMeta[] = Array.from({ length: totalPages }, (_, i) => ({
        pageNumber: i + 1,
        rotation: 0,
        isSelected: true,
      }));

      renderedPagesRef.current.clear();
      setThumbnails({});

      // Only display the workspace once pages are fully initialized!
      setFile(selectedFile);
      setPages(initialPages);
      setIsLoadingPdf(false);
    } catch (err) {
      console.error("PDF read error:", err);
      setErrorMessage("Could not parse this PDF. It may be corrupted or password-protected.");
      setIsLoadingPdf(false);
    }
  };

  const handleBatchChange = React.useCallback(
    (startPage: number, endPage: number) => {
      if (!file) return;

      // Smart Fast-Mode: For large documents (>100 pages, e.g. 26,000 pages),
      // we only render the first 8 pages of any batch so CPU/GPU stays at 60 FPS,
      // and any page can be zoomed/inspected on-demand in milliseconds!
      const isLargeDoc = pages.length > 100;
      const targetEnd = isLargeDoc ? Math.min(endPage, startPage + 7) : endPage;

      const unrendered: number[] = [];
      for (let p = startPage; p <= targetEnd; p++) {
        if (!renderedPagesRef.current.has(p)) {
          unrendered.push(p);
        }
      }

      if (unrendered.length === 0 || isRenderingBatchRef.current) return;
      isRenderingBatchRef.current = true;

      unrendered.forEach((p) => renderedPagesRef.current.add(p));

      renderPdfPageRangeThumbnails(
        file,
        startPage,
        targetEnd,
        (_count, pageNum, url) => {
          setThumbnails((prev) => ({ ...prev, [pageNum]: url }));
        }
      ).finally(() => {
        isRenderingBatchRef.current = false;
      });
    },
    [file, pages.length]
  );

  const handleRotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const handleRotateAll = () => {
    setPages((prev) =>
      prev.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))
    );
  };

  const handleToggleSelect = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, isSelected: !p.isSelected } : p))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, isSelected: select })));
  };

  const handleExportSelected = async () => {
    if (!file) return;
    const selected = pages
      .map((p, idx) => ({ pageIndex: idx, rotation: p.rotation, isSelected: p.isSelected }))
      .filter((p) => p.isSelected);

    if (selected.length === 0) {
      setErrorMessage("Please select at least 1 page to export.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const res = await organizePdfPages(file, selected, `untraceme-organized-${baseName}.pdf`);
      setResult(res);
    } catch (err) {
      console.error("Export error:", err);
      setErrorMessage("Failed to build organized PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplitAllToZip = async () => {
    if (!file) return;
    setIsSplitting(true);
    setErrorMessage(null);

    try {
      const singlePages = await splitAllPdfPages(file);
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      singlePages.forEach((item) => {
        zip.file(item.filename, item.blob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const zipFilename = `untraceme-split-${baseName}-${Date.now()}.zip`;

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Split pages error:", err);
      setErrorMessage("Failed to split PDF into individual files.");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownloadResult = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    renderedPagesRef.current.clear();
    isRenderingBatchRef.current = false;
    setThumbnails({});
    setFile(null);
    setPages([]);
    setResult(null);
    setErrorMessage(null);
    setActivePreviewPage(null);
  };

  return (
    <div className="space-y-6 flex-1">
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!file ? (
        <PdfDropzone onFileSelect={handleFileChange} isLoading={isLoadingPdf} />
      ) : (
        <PdfOrganizerWorkspace
          file={file}
          pages={pages}
          thumbnails={thumbnails}
          isProcessing={isProcessing}
          isSplitting={isSplitting}
          onRotatePage={handleRotatePage}
          onRotateAll={handleRotateAll}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onClear={handleClear}
          onExportSelected={handleExportSelected}
          onSplitAllToZip={handleSplitAllToZip}
          onOpenPreview={setActivePreviewPage}
          onBatchChange={handleBatchChange}
        />
      )}

      {result && (
        <PdfResultCard result={result} onDownload={handleDownloadResult} />
      )}

      <PdfPreviewModal
        file={file}
        activePreviewPage={activePreviewPage}
        pages={pages}
        thumbnails={thumbnails}
        onClose={() => setActivePreviewPage(null)}
        onPageChange={setActivePreviewPage}
        onRotatePage={handleRotatePage}
        onThumbnailGenerated={(pageNum, url) => {
          setThumbnails((prev) => ({ ...prev, [pageNum]: url }));
        }}
      />
    </div>
  );
}
