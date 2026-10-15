"use client";

import React, { useState } from "react";
import { AlertCircleIcon } from "hugeicons-react";
import {
  organizePdfPages,
  splitAllPdfPages,
  SplitPdfResult,
} from "@/lib/pdf-engine/pdf-organizer";
import { renderAllPdfPageThumbnails } from "@/lib/pdf-engine/pdf-thumbnail";
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

  const handleFileChange = async (selectedFile: File) => {
    // 1. Strict Extension & MIME validation
    const hasPdfExtension = /\.pdf$/i.test(selectedFile.name);
    const isPdfMime = selectedFile.type === "application/pdf" || selectedFile.type === "";

    if (!hasPdfExtension && !isPdfMime) {
      setErrorMessage(`Invalid file: "${selectedFile.name}". Only PDF documents (.pdf) are allowed.`);
      return;
    }

    try {
      // 2. Strict Magic Header validation (Read first 5 bytes to verify %PDF-)
      const headerBytes = new Uint8Array(await selectedFile.slice(0, 5).arrayBuffer());
      const headerString = String.fromCharCode(...headerBytes);
      if (!headerString.startsWith("%PDF-")) {
        setErrorMessage(`Corrupted or fake PDF: "${selectedFile.name}" does not have a valid %PDF- binary header.`);
        return;
      }
      setErrorMessage(null);
      setFile(selectedFile);
      setResult(null);

      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = doc.getPageCount();

      const initialPages: PageMeta[] = Array.from({ length: total }, (_, i) => ({
        pageNumber: i + 1,
        rotation: 0,
        isSelected: true,
      }));
      setPages(initialPages);

      // Asynchronously render real page thumbnails for visual preview
      renderAllPdfPageThumbnails(selectedFile, 50).then((thumbMap) => {
        setThumbnails(thumbMap);
      });
    } catch (err) {
      console.error("PDF read error:", err);
      setErrorMessage("Could not parse this PDF. It may be password-protected.");
    }
  };

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
        <PdfDropzone onFileSelect={handleFileChange} />
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
        />
      )}

      {result && (
        <PdfResultCard result={result} onDownload={handleDownloadResult} />
      )}

      <PdfPreviewModal
        activePreviewPage={activePreviewPage}
        pages={pages}
        thumbnails={thumbnails}
        onClose={() => setActivePreviewPage(null)}
        onPageChange={setActivePreviewPage}
        onRotatePage={handleRotatePage}
      />
    </div>
  );
}
