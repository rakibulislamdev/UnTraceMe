"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  Loading03Icon,
  AlertCircleIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { CompressorDropzone } from "./compressor-dropzone";
import { CompressorControls } from "./compressor-controls";
import { CompressorResults } from "./compressor-results";
import {
  compressImage,
  CompressionOptions,
  CompressedImageResult
} from "@/lib/image-engine/image-compressor";

export function ImageCompressorClient() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | null>(null);
  const [results, setResults] = useState<CompressedImageResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [options, setOptions] = useState<CompressionOptions>({
    quality: 0.82, // 82% visually identical & huge size reduction
    format: "original",
    maxWidth: undefined,
    stripMetadata: true,
  });

  const handleImagesSelected = (newFiles: File[]) => {
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setResults([]);
    setErrorMessage(null);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setResults([]);
  };

  const handleClearAll = () => {
    setSelectedImages([]);
    setResults([]);
    setErrorMessage(null);
  };

  const handleCompress = async () => {
    if (selectedImages.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setResults([]);

    try {
      const outputList: CompressedImageResult[] = [];
      const total = selectedImages.length;

      for (let i = 0; i < total; i++) {
        setProcessingProgress({ current: i + 1, total });
        // Minor realistic micro-delay so UI feels deliberate and smooth
        await new Promise((r) => setTimeout(r, 220));
        const res = await compressImage(selectedImages[i], options);
        outputList.push(res);
      }

      setResults(outputList);
    } catch (err) {
      console.error("Image compression error:", err);
      setErrorMessage("An error occurred during compression. Please try again with different settings.");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  const handleDownloadSingle = (item: CompressedImageResult) => {
    const a = document.createElement("a");
    a.href = item.previewUrl;
    const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "");
    const ext = item.format === "image/webp" ? "webp" : item.format === "image/jpeg" ? "jpg" : "png";
    a.download = `untraceme-${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    if (results.length === 0) return;

    if (results.length === 1) {
      handleDownloadSingle(results[0]);
      return;
    }

    try {
      setIsZipping(true);
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add each compressed blob to the zip bundle with untraceme prefix
      results.forEach((item, index) => {
        const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "");
        const ext = item.format === "image/webp" ? "webp" : item.format === "image/jpeg" ? "jpg" : "png";
        const fileName = `untraceme-${baseName}-${index + 1}.${ext}`;
        zip.file(fileName, item.compressedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `untraceme-optimized-bundle-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(zipUrl), 3000);
    } catch (err) {
      console.error("Failed to generate ZIP archive:", err);
      // Fallback: download individually if zip generation errors
      results.forEach((item, index) => {
        setTimeout(() => handleDownloadSingle(item), index * 200);
      });
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 flex-1">
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* File Dropzone */}
      <CompressorDropzone
        selectedImages={selectedImages}
        onImagesSelected={handleImagesSelected}
        onRemoveImage={handleRemoveImage}
        onClearAll={handleClearAll}
        disabled={isProcessing}
      />

      {/* Revealed Controls and Action Button */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <motion.div
            key="compressor-active-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <CompressorControls
              options={options}
              setOptions={setOptions}
              disabled={isProcessing}
            />

            {/* Main Action Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Ready to optimize {selectedImages.length} {selectedImages.length === 1 ? "image" : "images"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Metadata will be removed and canvas resampling will apply your target parameters.
                </p>
              </div>

              <Button
                onClick={handleCompress}
                disabled={isProcessing}
                size="default"
                className="w-full sm:w-auto cursor-pointer font-medium px-6 shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loading03Icon className="size-4 mr-2 animate-spin" />
                    <span>
                      {processingProgress
                        ? `Compressing image ${processingProgress.current} of ${processingProgress.total}...`
                        : "Compressing images..."}
                    </span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4 mr-2" />
                    <span>Compress & Optimize Now</span>
                  </>
                )}
              </Button>
            </div>

            {/* Results Preview */}
            <CompressorResults
              results={results}
              onDownloadSingle={handleDownloadSingle}
              onDownloadAll={handleDownloadAll}
              isZipping={isZipping}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
