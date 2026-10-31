"use client";

import React, { useRef } from "react";
import { Upload01Icon } from "hugeicons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CropperUploadPaneProps {
  imageSrc: string | null;
  selectedFileName?: string;
  dimensions: { width: number; height: number } | null;
  onFileSelect: (file: File) => void;
}

export function CropperUploadPane({
  imageSrc,
  selectedFileName,
  dimensions,
  onFileSelect,
}: CropperUploadPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  return (
    <Card className="p-6 rounded-xl border border-border bg-card">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary/60 hover:bg-secondary/30 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
        >
          <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
            <Upload01Icon className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground tracking-tight">
            Click or drop an image to resize & crop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PNG, JPG, WebP, AVIF up to 25MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-tight">
                Source
              </span>
              <span className="text-[11px] text-muted-foreground">•</span>
              {dimensions && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  {dimensions.width} × {dimensions.height} px
                </span>
              )}
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
    </Card>
  );
}

