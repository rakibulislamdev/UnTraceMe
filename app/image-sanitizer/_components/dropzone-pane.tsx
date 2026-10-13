"use client";

import React, { useRef, useState } from "react";
import { 
  Upload04Icon, 
  Image01Icon, 
  Delete02Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
export const MAX_FILE_SIZE_MB = 15;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGES_COUNT = 5; // User can upload up to 5 images at once

interface DropzonePaneProps {
  onImagesSelected: (files: File[]) => void;
  selectedImages: File[];
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export function DropzonePane({
  onImagesSelected,
  selectedImages,
  onRemoveImage,
  onClearAll,
  disabled,
}: DropzonePaneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFiles = (incomingList: FileList | File[]) => {
    setErrorMessage(null);
    const filesArray = Array.from(incomingList);

    if (filesArray.length === 0) return;

    // Check count limit
    const totalCount = selectedImages.length + filesArray.length;
    if (totalCount > MAX_IMAGES_COUNT) {
      setErrorMessage(
        `Batch limit exceeded: You can upload maximum ${MAX_IMAGES_COUNT} images at once (attempted ${totalCount}).`
      );
      return;
    }

    const validFiles: File[] = [];

    for (const file of filesArray) {
      // 1. Strict MIME format validation
      if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
        setErrorMessage(
          `Invalid file format: "${file.name}". Only standard raster images (PNG, JPEG, WEBP, AVIF) are accepted.`
        );
        return;
      }

      // 2. File size limit validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `File too large: "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndProcessFiles(e.target.files);
      // Reset input value to allow re-uploading the same file if needed
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Image01Icon className="size-4 text-primary" />
            Upload AI Image Batch (Max {MAX_IMAGES_COUNT} files)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strict raster validation (PNG, JPEG, WEBP, AVIF) • Max {MAX_FILE_SIZE_MB}MB per image.
          </p>
        </div>

        {selectedImages.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium tabular-nums">
              {selectedImages.length} / {MAX_IMAGES_COUNT} Images
            </Badge>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-destructive gap-1"
            >
              <Delete02Icon className="size-3.5" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
      />

      {/* Validation Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drop area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (selectedImages.length < MAX_IMAGES_COUNT) {
            fileInputRef.current?.click();
          }
        }}
        className={`flex flex-col items-center justify-center py-8 px-6 border-2 border-dashed rounded-lg transition-all ${
          selectedImages.length >= MAX_IMAGES_COUNT
            ? "opacity-50 cursor-not-allowed border-border"
            : isDragOver
            ? "border-primary bg-primary/5 scale-[0.99] cursor-pointer"
            : "border-border hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
        }`}
      >
        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
          <Upload04Icon className="size-5" />
        </div>
        <p className="text-sm font-medium text-foreground text-center">
          {selectedImages.length >= MAX_IMAGES_COUNT
            ? `Maximum batch limit reached (${MAX_IMAGES_COUNT} images)`
            : "Click to browse or drop images here"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports PNG, JPG, WEBP, and AVIF up to 15MB
        </p>
      </div>

      {/* Selected Images List */}
      {selectedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {selectedImages.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-md border border-border bg-muted/20 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <Image01Icon className="size-4 text-primary shrink-0" />
                <span className="truncate font-medium text-foreground">{file.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(idx);
                  }}
                  className="hover:text-destructive"
                  aria-label={`Remove ${file.name}`}
                >
                  <Delete02Icon className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
