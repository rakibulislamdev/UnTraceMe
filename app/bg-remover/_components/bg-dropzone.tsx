"use client";

import React, { useRef, useState } from "react";
import { 
  Upload04Icon, 
  Image01Icon, 
  Delete02Icon,
  AlertCircleIcon,
  SparklesIcon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface BgDropzoneProps {
  onImageSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function BgDropzone({
  onImageSelected,
  selectedFile,
  onClear,
  disabled,
}: BgDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    // 1. Strict MIME format validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage(
        `Invalid file format: "${file.name}". Supported formats: PNG, JPG/JPEG, WEBP.`
      );
      return;
    }

    // 2. File size limit validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File too large: "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit for browser AI execution.`
      );
      return;
    }

    onImageSelected(file);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragOver
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border hover:border-border/80 bg-card hover:bg-muted/30"
        } ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateAndProcessFile(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />

        <div className="flex flex-col items-center text-center max-w-sm space-y-3">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
            <Upload04Icon className="size-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Drop your photo here, or{" "}
              <span className="text-primary hover:underline">browse</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Supports PNG, JPG, or WEBP up to {MAX_FILE_SIZE_MB}MB
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <Badge variant="secondary" className="text-[10px] font-mono">
              Zero Server Uploads
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/20 bg-primary/5">
              100% On-Device AI
            </Badge>
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Image Card */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-10 rounded-md bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
              <Image01Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
            >
              <Delete02Icon className="size-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

