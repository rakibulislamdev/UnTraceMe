"use client";

import React from "react";
import { BgDropzone } from "./bg-dropzone";
import { BgResultCard } from "./bg-result-card";
import { BgProcessingLoader } from "./bg-processing-loader";
import { BgErrorBanner } from "./bg-error-banner";
import { useBgRemover } from "./use-bg-remover";

export function BgRemoverClient() {
  const {
    selectedFile,
    originalUrl,
    processedUrl,
    isLoading,
    displayProgress,
    errorMessage,
    handleImageSelected,
    handleClear,
    handleDownload,
  } = useBgRemover();

  return (
    <div className="space-y-6">
      {/* 1. Upload View (Shown when no image is being processed or processed) */}
      {!isLoading && !processedUrl && (
        <BgDropzone
          onImageSelected={handleImageSelected}
          selectedFile={selectedFile}
          onClear={handleClear}
          disabled={isLoading}
        />
      )}

      {/* 2. Loading State */}
      {isLoading && (
        <BgProcessingLoader displayProgress={displayProgress} />
      )}

      {/* 3. Error Banner */}
      {errorMessage && <BgErrorBanner message={errorMessage} />}

      {/* 4. Result View */}
      {processedUrl && originalUrl && selectedFile && (
        <BgResultCard
          originalUrl={originalUrl}
          processedUrl={processedUrl}
          originalFileName={selectedFile.name}
          onDownload={handleDownload}
          onReset={handleClear}
        />
      )}
    </div>
  );
}
