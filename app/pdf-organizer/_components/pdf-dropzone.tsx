"use client";

import React, { useRef } from "react";
import { Upload04Icon } from "hugeicons-react";
import { Badge } from "@/components/ui/badge";

interface PdfDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function PdfDropzone({ onFileSelect, isLoading }: PdfDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
          e.target.value = "";
        }}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/30 bg-card flex flex-col items-center justify-center min-h-[240px]"
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-8 ring-primary/5 animate-pulse">
              <Upload04Icon className="size-7 animate-bounce" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">
              Analyzing & reading document pages...
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-4">
              Decoupling streams and building workspace. Please wait a moment.
            </p>
          </div>
        ) : (
          <>
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-8 ring-primary/5">
              <Upload04Icon className="size-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">
              Drop a PDF document here or click to browse
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-4">
              Visual page organizer: Select pages, rotate orientations, extract specific sheets, or split into individual documents.
            </p>
            <Badge variant="outline" className="text-xs font-mono">
              PDF Documents Only
            </Badge>
          </>
        )}
      </div>
    </>
  );
}
