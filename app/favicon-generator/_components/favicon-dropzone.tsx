"use client";

import React, { useRef, useState } from "react";
import { 
  Upload04Icon, 
  Image01Icon, 
  Delete02Icon, 
  SparklesIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const ALLOWED_FAVICON_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_FAVICON_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
];

export const MAX_FAVICON_SIZE_MB = 15;
export const MAX_FAVICON_SIZE_BYTES = MAX_FAVICON_SIZE_MB * 1024 * 1024;

interface FaviconDropzoneProps {
  sourceFile: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function FaviconDropzone({
  sourceFile,
  previewUrl,
  onFileSelect,
  onClear,
}: FaviconDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);

    // 1. Strict MIME type and Extension validation
    const hasAllowedMime = ALLOWED_FAVICON_MIME_TYPES.includes(file.type);
    const fileNameLower = file.name.toLowerCase();
    const hasAllowedExt = ALLOWED_FAVICON_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));

    if (!hasAllowedMime && !hasAllowedExt) {
      setErrorMessage(
        `Unsupported file type: "${file.name}". Please upload a valid image (PNG, JPG, WebP, or SVG). Other file formats are strictly prohibited.`
      );
      return;
    }

    // 2. File size ceiling check (15MB)
    if (file.size > MAX_FAVICON_SIZE_BYTES) {
      setErrorMessage(
        `File too large: "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is ${MAX_FAVICON_SIZE_MB}MB.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearWithFeedback = () => {
    setErrorMessage(null);
    onClear();
  };

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Error message banner with smooth animation */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg bg-destructive/10 border border-destructive/30 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-destructive"
          >
            <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Invalid File Type</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setErrorMessage(null)} 
              className="text-xs underline hover:no-underline ml-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!sourceFile ? (
          <motion.div
            key="empty-dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-border hover:border-primary/50 hover:bg-muted/40"
            }`}
          >
            <div className="mx-auto size-14 rounded-full bg-secondary flex items-center justify-center text-primary mb-4 shadow-sm border border-border">
              <Upload04Icon className="size-7" />
            </div>

            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Upload your logo or icon image
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
              Drop your high-resolution PNG, JPG, WebP, or SVG (square format 512×512+ recommended). Non-image files are rejected.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckmarkCircle02Icon className="size-3.5 text-primary" />
                PNG, JPG, WebP, SVG Only
              </span>
              <span className="flex items-center gap-1">
                <CheckmarkCircle02Icon className="size-3.5 text-primary" />
                Multi-resolution .ico
              </span>
              <span className="flex items-center gap-1">
                <CheckmarkCircle02Icon className="size-3.5 text-primary" />
                100% Client-Side
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loaded-dropzone"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border border-border rounded-xl p-4 sm:p-5 bg-card/60 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="size-16 rounded-lg border border-border overflow-hidden bg-secondary/50 flex items-center justify-center shrink-0 relative group">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Source"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Image01Icon className="size-7 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                    {sourceFile.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border">
                    {(sourceFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <SparklesIcon className="size-3 text-primary" />
                  Validated image asset • Ready to package
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs cursor-pointer"
              >
                Change Image
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearWithFeedback}
                className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
              >
                <Delete02Icon className="size-4 mr-1" />
                Remove
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
