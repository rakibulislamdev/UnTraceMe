"use client";

import React, { useState } from "react";
import { DropzonePane, MAX_IMAGES_COUNT } from "./dropzone-pane";
import { MetadataBadgeList } from "./metadata-badge-list";
import { ImageComparison, SanitizedImageItem } from "./image-comparison";
import { SanitizeActions } from "./sanitize-actions";
import { sanitizeImageLocally } from "@/lib/image-engine/canvas-cleaner";
import { scanImageMetadata, ScannedMetadataResult } from "@/lib/image-engine/metadata-scanner";

export function ImageSanitizerClient() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [sanitizedItems, setSanitizedItems] = useState<SanitizedImageItem[]>([]);
  const [scannedInfo, setScannedInfo] = useState<ScannedMetadataResult | null>(null);
  const [exportFormat, setExportFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImagesSelected = async (newFiles: File[]) => {
    setSelectedImages((prev) => [...prev, ...newFiles]);

    // Inspect first image metadata
    if (newFiles[0]) {
      const scanResult = await scanImageMetadata(newFiles[0]);
      setScannedInfo(scanResult);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setScannedInfo(null);
      return updated;
    });
  };

  const handleClearAll = () => {
    sanitizedItems.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      URL.revokeObjectURL(item.sanitizedUrl);
    });

    setSelectedImages([]);
    setSanitizedItems([]);
    setScannedInfo(null);
  };

  const handleSanitizeBatch = async () => {
    if (selectedImages.length === 0) return;
    setIsProcessing(true);

    try {
      const results: SanitizedImageItem[] = [];

      for (const file of selectedImages) {
        const originalUrl = URL.createObjectURL(file);

        // Sanitize with micro-dithering and selected format
        const { blob, url: sanitizedUrl } = await sanitizeImageLocally(file, {
          format: exportFormat,
          quality: 0.96,
          applyMicroDither: true,
        });

        results.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          originalUrl,
          sanitizedUrl,
          blob,
          size: blob.size,
        });
      }

      setSanitizedItems(results);
    } catch (err) {
      console.error("Batch sanitization failed:", err);
      alert("Failed to sanitize one or more images in the batch.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: SanitizedImageItem) => {
    const ext = exportFormat === "image/png" ? "png" : exportFormat === "image/webp" ? "webp" : "jpg";
    const link = document.createElement("a");
    link.href = item.sanitizedUrl;
    link.download = `untraceme-${item.name.replace(/\.[^/.]+$/, "")}-clean.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    sanitizedItems.forEach((item, idx) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, idx * 300);
    });
  };

  return (
    <div className="space-y-6 flex-1">
      <DropzonePane
        onImagesSelected={handleImagesSelected}
        selectedImages={selectedImages}
        onRemoveImage={handleRemoveImage}
        onClearAll={handleClearAll}
        disabled={isProcessing}
      />

      <SanitizeActions
        onSanitize={handleSanitizeBatch}
        onDownloadAll={handleDownloadAll}
        onClear={handleClearAll}
        isProcessing={isProcessing}
        canSanitize={selectedImages.length > 0}
        sanitizedCount={sanitizedItems.length}
        totalCount={selectedImages.length}
        format={exportFormat}
        setFormat={setExportFormat}
      />

      <MetadataBadgeList
        hasImage={selectedImages.length > 0}
        isSanitized={sanitizedItems.length > 0}
        scannedInfo={scannedInfo}
      />

      <ImageComparison
        items={sanitizedItems}
        onDownloadSingle={handleDownloadSingle}
      />
    </div>
  );
}
