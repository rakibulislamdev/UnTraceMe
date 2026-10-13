"use client";

import React, { useState } from "react";
import { DropzonePane, MAX_IMAGES_COUNT } from "./_components/dropzone-pane";
import { MetadataBadgeList } from "./_components/metadata-badge-list";
import { ImageComparison, SanitizedImageItem } from "./_components/image-comparison";
import { SanitizeActions } from "./_components/sanitize-actions";
import { sanitizeImageLocally } from "@/lib/image-engine/canvas-cleaner";
import { AdContainer } from "@/app/_components/ad-container";
import { Image01Icon } from "hugeicons-react";

export default function ImageSanitizerPage() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [sanitizedItems, setSanitizedItems] = useState<SanitizedImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImagesSelected = (newFiles: File[]) => {
    setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    sanitizedItems.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      URL.revokeObjectURL(item.sanitizedUrl);
    });

    setSelectedImages([]);
    setSanitizedItems([]);
  };

  const handleSanitizeBatch = async () => {
    if (selectedImages.length === 0) return;
    setIsProcessing(true);

    try {
      const results: SanitizedImageItem[] = [];

      for (const file of selectedImages) {
        const originalUrl = URL.createObjectURL(file);
        const { blob, url: sanitizedUrl } = await sanitizeImageLocally(file);

        results.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          originalUrl,
          sanitizedUrl,
          blob,
          size: file.size,
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
    const ext = item.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
    const link = document.createElement("a");
    link.href = item.sanitizedUrl;
    link.download = `untraceme-${item.name.replace(/\.[^/.]+$/, "")}-clean.${ext}`;
    link.click();
  };

  const handleDownloadAll = () => {
    sanitizedItems.forEach((item, idx) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, idx * 250);
    });
  };

  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <Image01Icon className="size-4" />
          <span>Module 02</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          AI Image Trace & Metadata Sanitizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Cleanse C2PA content credentials, embedded prompts, and EXIF tracking metadata completely inside your browser. Batch processing up to {MAX_IMAGES_COUNT} images simultaneously.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Tool Workspace */}
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
        />

        <MetadataBadgeList
          hasImage={selectedImages.length > 0}
          isSanitized={sanitizedItems.length > 0}
        />

        <ImageComparison
          items={sanitizedItems}
          onDownloadSingle={handleDownloadSingle}
        />
      </div>

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
