"use client";

import React, { useRef, useState } from "react";
import { 
  Upload04Icon, 
  Image01Icon, 
  Delete02Icon,
  AlertCircleIcon,
  InformationCircleIcon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/image-engine/image-compressor";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];
export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGES_COUNT = 10;

interface CompressorDropzoneProps {
  selectedImages: File[];
  onImagesSelected: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export function CompressorDropzone({
  selectedImages,
  onImagesSelected,
  onRemoveImage,
  onClearAll,
  disabled,
}: CompressorDropzoneProps) {
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
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrorMessage(`"${file.name}" has an unsupported format. Please upload JPG, PNG, or WebP.`);
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
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {selectedImages.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-border/80 hover:bg-muted/30"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndProcessFiles(e.target.files);
              e.target.value = "";
            }}
            disabled={disabled}
          />

          <div className="size-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-xs">
            <Upload04Icon className="size-7 text-primary" />
          </div>

          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Drop images here or click to browse
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Supports PNG, JPG, and WebP up to {MAX_FILE_SIZE_MB}MB each. Batch compress up to {MAX_IMAGES_COUNT} images locally.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
              PNG / JPG / WebP
            </Badge>
            <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
              Max {MAX_FILE_SIZE_MB}MB
            </Badge>
            <Badge variant="outline" className="text-[11px] font-normal border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
              100% In-Browser Private
            </Badge>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Image01Icon className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Selected Images ({selectedImages.length}/{MAX_IMAGES_COUNT})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => !disabled && fileInputRef.current?.click()}
                disabled={disabled || selectedImages.length >= MAX_IMAGES_COUNT}
                className="cursor-pointer text-xs h-8"
              >
                <Upload04Icon className="size-3.5 mr-1.5" />
                Add More
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                disabled={disabled}
                className="cursor-pointer text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Clear All
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndProcessFiles(e.target.files);
              e.target.value = "";
            }}
            disabled={disabled}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedImages.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="size-8 rounded bg-background border border-border flex items-center justify-center shrink-0">
                    <Image01Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  disabled={disabled}
                  className="size-7 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  aria-label="Remove image"
                >
                  <Delete02Icon className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <InformationCircleIcon className="size-3.5 shrink-0 text-primary" />
            <span>Files are processed directly in your RAM. Zero bytes are uploaded to remote servers.</span>
          </div>
        </div>
      )}
    </div>
  );
}
