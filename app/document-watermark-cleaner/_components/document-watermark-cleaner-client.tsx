"use client";

import React, { useState } from "react";
import { DocumentUploadPane } from "./document-upload-pane";
import { DocumentPreviewPane } from "./document-preview-pane";
import { DocumentAuditPane } from "./document-audit-pane";
import {
  auditDocumentWatermarks,
  sanitizeDocument,
  DocWatermarkAudit,
} from "@/lib/document-engine/document-watermark-cleaner";

export function DocumentWatermarkCleanerClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audit, setAudit] = useState<DocWatermarkAudit | null>(null);
  const [sanitizedBlob, setSanitizedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSanitized, setIsSanitized] = useState<boolean>(false);
  const [cleanStats, setCleanStats] = useState<{
    zeroWidthRemoved: number;
    watermarksScrubbed: number;
    metadataFieldsCleared: number;
  } | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsSanitized(false);
    setSanitizedBlob(null);
    setCleanStats(null);
    setIsProcessing(true);

    try {
      const result = await auditDocumentWatermarks(file);
      setAudit(result);
    } catch {
      setAudit({
        fileType: "unknown",
        fileName: file.name,
        fileSizeBytes: file.size,
        zeroWidthCount: 0,
        invisibleCharMatches: [],
        hiddenWatermarkFound: false,
        embeddedMetadataTags: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSanitize = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const result = await sanitizeDocument(selectedFile, {
        cleanZeroWidth: true,
        removeWordWatermarks: true,
        scrubMetadata: true,
      });

      setSanitizedBlob(result.sanitizedBlob);
      setCleanStats({
        zeroWidthRemoved: result.zeroWidthRemoved,
        watermarksScrubbed: result.watermarksScrubbed,
        metadataFieldsCleared: result.metadataFieldsCleared,
      });
      setIsSanitized(true);
    } catch (err) {
      console.error("Document sanitization error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAudit(null);
    setSanitizedBlob(null);
    setIsSanitized(false);
    setCleanStats(null);
  };

  const downloadFileName = selectedFile
    ? `untraceme-clean-${selectedFile.name}`
    : "untraceme-cleaned-document.docx";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Upload & Document Details */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <DocumentUploadPane
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onSanitize={handleSanitize}
          isProcessing={isProcessing}
          isSanitized={isSanitized}
          onReset={handleReset}
        />

        <DocumentPreviewPane
          audit={audit}
          sanitizedBlob={sanitizedBlob}
          isProcessing={isProcessing}
          isSanitized={isSanitized}
          downloadFileName={downloadFileName}
        />
      </div>

      {/* Right Column: Forensic Watermark & Steganography Audit */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <DocumentAuditPane
          audit={audit}
          isSanitized={isSanitized}
          cleanStats={cleanStats}
        />
      </div>
    </div>
  );
}

