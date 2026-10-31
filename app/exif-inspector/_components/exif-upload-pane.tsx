"use client";

import React, { useRef, useState } from "react";
import { Upload01Icon } from "hugeicons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExifUploadPaneProps {
  imageSrc: string | null;
  selectedFileName?: string;
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/tiff",
  "image/heic",
  "image/heif"
];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "tiff", "tif", "heic", "heif"];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export function ExifUploadPane({
  imageSrc,
  selectedFileName,
  onFileSelect,
  isProcessing,
}: ExifUploadPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);

    // Get file extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    // 1. Strict validation: Must match allowed extension OR allowed MIME type
    const isExtensionAllowed = ALLOWED_EXTENSIONS.includes(ext);
    const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.type);

    if (!isExtensionAllowed && !isMimeAllowed) {
      setErrorMsg("Unsupported format. Only JPG, PNG, WebP, AVIF, HEIC, and TIFF are supported.");
      return;
    }

    // 2. Strict 50MB size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg("File is too large. Maximum allowed size is 50MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
    // Reset input value so re-selecting the same file triggers change
    if (e.target) e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className={`p-6 rounded-xl border border-border bg-card flex flex-col justify-center ${imageSrc ? "h-[92px]" : ""}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp,.avif,.tiff,.tif,.heic,.heif,image/jpeg,image/png,image/webp,image/avif,image/tiff,image/heic"
        className="hidden"
      />

      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-border hover:border-primary/60 hover:bg-secondary/30 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
        >
          <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
            <Upload01Icon className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground tracking-tight">
            Click or drop photo to inspect EXIF & GPS
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports camera JPG, TIFF, WebP, AVIF up to 50MB
          </p>
          {errorMsg && (
            <p className="text-xs text-rose-500 font-medium mt-2.5 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
              {errorMsg}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-tight block">
              Source File
            </span>
            <div className="text-sm font-medium text-foreground truncate mt-1">
              {selectedFileName}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="shrink-0 h-8 px-3 text-xs font-medium rounded-md border border-border bg-secondary/80 hover:bg-secondary hover:text-foreground text-foreground transition-colors cursor-pointer"
          >
            Change
          </Button>
        </div>
      )}
    </Card>
  );
}

