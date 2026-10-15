"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  Loading03Icon,
  AlertCircleIcon,
  Exchange01Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { ConverterDropzone } from "./converter-dropzone";
import { ConverterControls } from "./converter-controls";
import { ConverterResults } from "./converter-results";
import {
  convertImage,
  ConversionOptions,
  ConvertedImageResult,
  SUPPORTED_TARGET_FORMATS,
} from "@/lib/image-engine/image-converter";

export function ImageConverterClient() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [results, setResults] = useState<ConvertedImageResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [options, setOptions] = useState<ConversionOptions>({
    targetFormat: "image/webp",
    quality: 0.88,
    maxWidth: undefined,
    maxHeight: undefined,
    maintainAspectRatio: true,
    backgroundColor: "#ffffff",
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

  const handleConvert = async () => {
    if (selectedImages.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setResults([]);

    try {
      const outputList: ConvertedImageResult[] = [];
      const total = selectedImages.length;

      for (let i = 0; i < total; i++) {
        setProcessingProgress({ current: i + 1, total });
        // Smooth micro-delay for realistic interactive feedback
        await new Promise((r) => setTimeout(r, 180));
        const res = await convertImage(selectedImages[i], options);
        outputList.push(res);
      }

      setResults(outputList);
    } catch (err: unknown) {
      console.error("Image conversion error:", err);
      const msg = err instanceof Error ? err.message : "An error occurred during format conversion.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  const handleDownloadSingle = (item: ConvertedImageResult) => {
    const a = document.createElement("a");
    a.href = item.previewUrl;
    // Download filename with website name prefixed: untraceme-<filename>.<ext>
    const cleanFileName = item.convertedFileName.startsWith("untraceme-")
      ? item.convertedFileName
      : `untraceme-${item.convertedFileName}`;
    a.download = cleanFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    if (results.length === 0) return;

    // If only 1 image was converted, download directly as single image with site name
    if (results.length === 1) {
      handleDownloadSingle(results[0]);
      return;
    }

    // If more than 1 image (> 1), package into ZIP file with website name
    try {
      setIsZipping(true);
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add each converted file to the zip bundle with untraceme- prefix
      results.forEach((item, index) => {
        const cleanName = item.convertedFileName.startsWith("untraceme-")
          ? item.convertedFileName
          : `untraceme-${item.convertedFileName}`;
        zip.file(cleanName, item.convertedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      const fmtDef = SUPPORTED_TARGET_FORMATS.find((f) => f.id === options.targetFormat);
      const ext = fmtDef?.extension || "converted";
      a.download = `untraceme-converted-${ext}-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      setErrorMessage("Failed to bundle files into a ZIP archive.");
    } finally {
      setIsZipping(false);
    }
  };

  const activeFormatDef = SUPPORTED_TARGET_FORMATS.find(
    (f) => f.id === options.targetFormat
  );

  return (
    <div className="space-y-6">
      {/* 1. Drag & Drop File Selector */}
      <ConverterDropzone
        selectedImages={selectedImages}
        onImagesSelected={handleImagesSelected}
        onRemoveImage={handleRemoveImage}
        onClearAll={handleClearAll}
        disabled={isProcessing}
      />

      {/* 2. Conversion Format Controls & Settings & Action Trigger Banner */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <motion.div
            key="converter-active-workspace"
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6"
          >
            <ConverterControls
              options={options}
              setOptions={setOptions}
              disabled={isProcessing}
            />

            {/* Action Trigger Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Exchange01Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Ready to convert {selectedImages.length}{" "}
                    {selectedImages.length === 1 ? "image" : "images"} to{" "}
                    <span className="text-primary">{activeFormatDef?.label}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Processed locally with zero upload latency and full privacy protection.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleConvert}
                disabled={isProcessing}
                size="lg"
                className="w-full sm:w-auto font-semibold px-6 cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loading03Icon className="size-4 mr-2 animate-spin" />
                    <span>
                      Converting {processingProgress?.current || 1} of{" "}
                      {processingProgress?.total || selectedImages.length}...
                    </span>
                  </>
                ) : (
                  <>
                    <Exchange01Icon className="size-4 mr-2" />
                    <span>Convert to {activeFormatDef?.label}</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircleIcon className="size-5 shrink-0" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* 4. Converted Results & Download Options */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <ConverterResults
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
