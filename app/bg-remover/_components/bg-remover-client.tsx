"use client";

import React, { useState } from "react";
import { BgDropzone } from "./bg-dropzone";
import { BgPreviewComparison } from "./bg-preview-comparison";
import { SparklesIcon, AlertCircleIcon } from "hugeicons-react";
import { toast } from "sonner";

export function BgRemoverClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = async (file: File) => {
    // Revoke previous URLs
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);

    const orig = URL.createObjectURL(file);
    setSelectedFile(file);
    setOriginalUrl(orig);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setErrorMessage(null);
    setIsLoading(true);
    setProgressPercent(0);
    setLoadingStep("Initializing browser AI environment...");

    try {
      // Dynamic import to guarantee client-side only loading of WASM & ONNX runtime
      const { removeBackground } = await import("@imgly/background-removal");

      setLoadingStep("Loading on-device neural network model...");

      const outputBlob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setProgressPercent(pct);
            if (key.includes("fetch")) {
              setLoadingStep(`Downloading AI weights (${pct}%)...`);
            } else if (key.includes("compute")) {
              setLoadingStep(`Analyzing image & cutting out background (${pct}%)...`);
            } else {
              setLoadingStep(`Processing neural mask (${pct}%)...`);
            }
          }
        },
        model: "medium", // balanced quality and performance
      });

      const resultUrl = URL.createObjectURL(outputBlob);
      setProcessedBlob(outputBlob);
      setProcessedUrl(resultUrl);
      toast.success("Background successfully removed!");
    } catch (err: unknown) {
      console.error("Background removal failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to process image locally.";
      setErrorMessage(`Error: ${msg}. Please try with a slightly smaller photo or a different format.`);
      toast.error("Background removal failed on device.");
    } finally {
      setIsLoading(false);
      setProgressPercent(0);
      setLoadingStep("");
    }
  };

  const handleClear = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setSelectedFile(null);
    setOriginalUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setErrorMessage(null);
  };

  const handleDownload = async (
    format: "image/png" | "image/webp" | "image/jpeg",
    bgColor?: string
  ) => {
    if (!processedBlob || !selectedFile) return;

    try {
      const isTransparent = !bgColor || bgColor === "transparent";

      if (isTransparent && format === "image/png") {
        // Direct download of the transparent PNG blob
        const link = document.createElement("a");
        link.href = URL.createObjectURL(processedBlob);
        link.download = `untraceme-${selectedFile.name.replace(/\.[^/.]+$/, "")}-no-bg.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        return;
      }

      // Draw onto canvas to composite with custom background color or alternative format
      const img = new Image();
      const blobUrl = URL.createObjectURL(processedBlob);
      img.src = blobUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }

      // Fill background color if specified
      if (!isTransparent && bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw cutout on top
      ctx.drawImage(img, 0, 0);

      const quality = format === "image/jpeg" ? 0.95 : 0.98;
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `untraceme-${selectedFile.name.replace(/\.[^/.]+$/, "")}-backdrop.${ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          URL.revokeObjectURL(blobUrl);
          toast.success("Image exported successfully!");
        },
        format,
        quality
      );
    } catch (e) {
      console.error("Export failed:", e);
      toast.error("Failed to export composite image.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <BgDropzone
        onImageSelected={handleImageSelected}
        selectedFile={selectedFile}
        onClear={handleClear}
        disabled={isLoading}
      />

      {/* Loading Progress State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card space-y-4 text-center animate-pulse">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <SparklesIcon className="size-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              {loadingStep || "Processing image with AI neural network..."}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              The first run downloads the WebAssembly neural model directly into your browser cache.
            </p>
          </div>
          {progressPercent > 0 && (
            <div className="w-full max-w-xs bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs">
          <AlertCircleIcon className="size-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Result Comparison & Backdrop Picker */}
      {processedUrl && originalUrl && selectedFile && (
        <BgPreviewComparison
          originalUrl={originalUrl}
          processedUrl={processedUrl}
          originalFileName={selectedFile.name}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

