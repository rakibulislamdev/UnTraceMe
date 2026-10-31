"use client";

import React, { useRef } from "react";
import { Upload01Icon } from "hugeicons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaletteUploadPaneProps {
  imageSrc: string | null;
  selectedFileName?: string;
  onFileSelect: (file: File) => void;
  colorCount: number;
  onColorCountChange: (count: number) => void;
}

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function PaletteUploadPane({
  imageSrc,
  selectedFileName,
  onFileSelect,
  colorCount,
  onColorCountChange,
}: PaletteUploadPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);

    // 1. Check exact mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMsg("Unsupported format. Only PNG, JPG, WebP, and AVIF are allowed.");
      return;
    }

    // 2. Check 25MB size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg("File is too large. Maximum allowed size is 25MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
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
    <Card className="p-6 rounded-xl border border-border bg-card space-y-5">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/avif"
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
            Click or drop an image to extract palette
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PNG, JPG, WebP, AVIF up to 25MB
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-tight">
                Source File
              </span>
            </div>
            <div className="text-sm font-medium text-foreground truncate mt-1">
              {selectedFileName}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 h-8 px-3 text-xs font-medium rounded-md border border-border bg-secondary/80 hover:bg-secondary hover:text-foreground text-foreground transition-colors cursor-pointer"
          >
            Change
          </Button>
        </div>
      )}

      {/* Palette Density Controls */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div>
          <label className="text-xs font-medium text-foreground block">
            Palette Depth
          </label>
          <span className="text-[11px] text-muted-foreground">
            Number of chromatic tokens
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/60 p-1 rounded-md border border-border">
          {[5, 6, 8, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onColorCountChange(num)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                colorCount === num
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

