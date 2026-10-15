"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload04Icon,
  Image01Icon,
  Delete02Icon,
  AlertCircleIcon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/image-engine/image-converter";

export const ALLOWED_INPUT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/svg+xml",
];

export const MAX_FILE_SIZE_MB = 35;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGES_COUNT = 10;

interface ConverterDropzoneProps {
  selectedImages: File[];
  onImagesSelected: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export function ConverterDropzone({
  selectedImages,
  onImagesSelected,
  onRemoveImage,
  onClearAll,
  disabled,
}: ConverterDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFiles = (incomingList: FileList | File[]) => {
    setErrorMessage(null);
    const filesArray = Array.from(incomingList);
    if (filesArray.length === 0) return;

    const totalCount = selectedImages.length + filesArray.length;
    if (totalCount > MAX_IMAGES_COUNT) {
      setErrorMessage(
        `Batch limit exceeded: You can select up to ${MAX_IMAGES_COUNT} images at once (attempted ${totalCount}).`
      );
      return;
    }

    const validFiles: File[] = [];

    for (const file of filesArray) {
      const isImageMime = file.type.startsWith("image/");
      const hasImageExtension = /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(file.name);
      const isAllowedType = ALLOWED_INPUT_TYPES.includes(file.type);

      if (!isImageMime && !hasImageExtension) {
        setErrorMessage(
          `"${file.name}" is not a valid image file. Only image formats (JPG, PNG, WebP, AVIF, BMP, SVG) are allowed.`
        );
        return;
      }

      if (!isAllowedType && !hasImageExtension) {
        setErrorMessage(
          `"${file.name}" has an unsupported format. Please upload JPG, PNG, WebP, AVIF, BMP, or SVG.`
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit (${formatBytes(file.size)}).`
        );
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onImagesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Animated Error Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-2.5"
          >
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="size-4 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs underline hover:no-underline cursor-pointer ml-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/bmp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) validateAndProcessFiles(e.target.files);
          e.target.value = "";
        }}
        disabled={disabled}
      />

      {/* AnimatePresence for smooth transitions between Empty Dropzone and Loaded List */}
      <AnimatePresence mode="wait">
        {selectedImages.length === 0 ? (
          /* Empty State Dropzone with Entrance / Exit Motion */
          <motion.div
            key="empty-dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!disabled) fileInputRef.current?.click();
            }}
            className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[260px] ${
              isDragOver
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-border hover:border-primary/50 hover:bg-muted/30 bg-card"
            } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-8 ring-primary/5 transition-transform hover:scale-105">
              <Upload04Icon className="size-7" />
            </div>

            <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">
              Drop images here or click to browse
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
              Batch convert up to {MAX_IMAGES_COUNT} images locally in high fidelity. Formats supported: PNG, JPG, WebP, AVIF, BMP.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">PNG</span>
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">JPG / JPEG</span>
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">WebP</span>
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">AVIF</span>
              <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">BMP</span>
              <span>• Max {MAX_FILE_SIZE_MB}MB each</span>
            </div>
          </motion.div>
        ) : (
          /* Active Selected Images Workspace with Animated Container & Items */
          <motion.div
            key="selected-images-panel"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Image01Icon className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Selected Images ({selectedImages.length} of {MAX_IMAGES_COUNT})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled || selectedImages.length >= MAX_IMAGES_COUNT}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs font-medium cursor-pointer"
                >
                  + Add More
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={onClearAll}
                  className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Files thumbnails grid with AnimatePresence for individual item remove transitions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[340px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {selectedImages.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);
                  const ext = file.name.split(".").pop()?.toUpperCase() || "IMG";
                  const fileKey = `${file.name}-${file.size}-${index}`;

                  return (
                    <motion.div
                      key={fileKey}
                      layout
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-xl border border-border/80 bg-card p-2.5 overflow-hidden flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                    >
                      {/* Clean Image Preview Canvas Box */}
                      <div className="aspect-square w-full rounded-lg overflow-hidden relative mb-2 flex items-center justify-center border border-border/50 bg-muted/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="w-full h-full object-contain p-1.5 relative z-10 transition-transform duration-200 group-hover:scale-105"
                          onLoad={() => URL.revokeObjectURL(previewUrl)}
                        />

                        {/* Format Tag Badge */}
                        <span className="absolute top-1.5 left-1.5 z-20 text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold uppercase bg-background/90 text-foreground border border-border/80 shadow-xs backdrop-blur-xs">
                          {ext}
                        </span>

                        {/* Quick Delete Button */}
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(index);
                          }}
                          className="absolute top-1.5 right-1.5 z-20 size-6 rounded-md bg-background/90 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs active:scale-90"
                          title="Remove image"
                        >
                          <Delete02Icon className="size-3.5" />
                        </button>
                      </div>

                      {/* File Details */}
                      <div className="min-w-0 px-0.5 space-y-0.5">
                        <p className="text-[11px] font-semibold text-foreground truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span>{formatBytes(file.size)}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
