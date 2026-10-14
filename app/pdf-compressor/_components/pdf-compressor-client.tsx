"use client";

import { useState } from "react";
import { PdfDropzone } from "./pdf-dropzone";
import { PdfControls } from "./pdf-controls";
import { PdfResults } from "./pdf-results";
import { motion, AnimatePresence } from "framer-motion";
import {
  PdfSanitizeOptions,
  PdfMetadataInfo,
  PdfProcessResult,
  inspectPdfMetadata,
  sanitizeAndCompressPdf,
  mergeAndSanitizePdfs
} from "@/lib/pdf-engine/pdf-sanitizer";

export function PdfCompressorClient() {
  const [selectedPdfs, setSelectedPdfs] = useState<File[]>([]);
  const [metadataInfo, setMetadataInfo] = useState<PdfMetadataInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [results, setResults] = useState<PdfProcessResult[]>([]);

  const [options, setOptions] = useState<PdfSanitizeOptions>({
    compressionPreset: "extreme",
    stripMetadata: true,
    cleanXmpStream: true,
    cleanStructureTree: true,
    removeAnnotations: false,
  });

  const handlePdfsSelected = async (newFiles: File[]) => {
    const updated = [...selectedPdfs, ...newFiles];
    setSelectedPdfs(updated);
    setResults([]);

    // Inspect first PDF metadata for quick preview
    if (newFiles.length > 0 && !metadataInfo) {
      try {
        const info = await inspectPdfMetadata(newFiles[0]);
        setMetadataInfo(info);
      } catch (err) {
        console.error("Failed to inspect PDF:", err);
      }
    }
  };

  const handleRemovePdf = (index: number) => {
    setSelectedPdfs((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length === 0) {
        setMetadataInfo(null);
        setResults([]);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    setSelectedPdfs([]);
    setMetadataInfo(null);
    setResults([]);
  };

  // Process all PDFs individually in batch
  const handleProcessBatch = async () => {
    if (selectedPdfs.length === 0) return;

    setIsProcessing(true);
    const newResults: PdfProcessResult[] = [];

    try {
      for (const file of selectedPdfs) {
        const res = await sanitizeAndCompressPdf(file, options);
        newResults.push(res);
      }
      setResults(newResults);
    } catch (err) {
      console.error("Error batch processing PDFs:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Combine / Merge all selected PDFs into a single file
  const handleMergePdfs = async () => {
    if (selectedPdfs.length < 2) return;

    setIsMerging(true);
    try {
      const mergedResult = await mergeAndSanitizePdfs(selectedPdfs, options);
      setResults([mergedResult]);
    } catch (err) {
      console.error("Error merging PDFs:", err);
    } finally {
      setIsMerging(false);
    }
  };

  // Package multiple output PDFs into a ZIP bundle
  const handleDownloadAllZip = async () => {
    if (results.length === 0) return;
    setIsZipping(true);

    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      results.forEach((item, idx) => {
        const safeName = item.filename.toLowerCase().endsWith(".pdf")
          ? item.filename
          : `${item.filename}.pdf`;
        zip.file(`untraceme-sanitized-${idx + 1}-${safeName}`, item.blob);
      });

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const zipUrl = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `untraceme-pdf-bundle-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("Failed to generate ZIP:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Dropzone (Up to 15 PDFs with Drag & Drop Reordering) */}
      <PdfDropzone
        selectedPdfs={selectedPdfs}
        onPdfsSelected={handlePdfsSelected}
        onRemovePdf={handleRemovePdf}
        onReorderPdfs={(newOrder) => setSelectedPdfs(newOrder)}
        onClearAll={handleClearAll}
        disabled={isProcessing || isMerging}
      />

      {/* Configuration & Actions */}
      <AnimatePresence>
        {selectedPdfs.length > 0 && (
          <motion.div
            key="pdf-workspace-controls"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <PdfControls
              options={options}
              metadataInfo={metadataInfo}
              onChangeOptions={(newOpts) => setOptions((prev) => ({ ...prev, ...newOpts }))}
              isProcessing={isProcessing || isMerging}
            />

            <PdfResults
              results={results}
              isProcessing={isProcessing}
              isMerging={isMerging}
              onProcessBatch={handleProcessBatch}
              onMergePdfs={handleMergePdfs}
              fileCount={selectedPdfs.length}
              onDownloadAllZip={handleDownloadAllZip}
              isZipping={isZipping}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
