"use client";

import React, { useRef, useState } from "react";
import { Upload04Icon, AlertCircleIcon } from "hugeicons-react";
import { Badge } from "@/components/ui/badge";

interface SvgDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function SvgDropzone({ onFileSelected, disabled }: SvgDropzoneProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = async (file: File) => {
    setErrorMessage(null);

    // 1. Strict Extension & MIME validation
    const hasSvgExtension = /\.svg$/i.test(file.name);
    const isSvgMime = file.type === "image/svg+xml" || file.type === "";

    if (!hasSvgExtension && !isSvgMime) {
      setErrorMessage(`Invalid file: "${file.name}". Only vector SVG files (.svg) are allowed.`);
      return;
    }

    // 2. Strict Content validation
    try {
      const sliceText = await file.slice(0, 1024).text();
      const hasSvgTag = /<svg[\s>]/i.test(sliceText);
      if (!hasSvgTag) {
        setErrorMessage(`Invalid SVG document: "${file.name}" does not contain a valid <svg> root element.`);
        return;
      }
    } catch {
      setErrorMessage(`Failed to read file: "${file.name}".`);
      return;
    }

    onFileSelected(file);
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) validateAndProcess(e.target.files[0]);
          e.target.value = "";
        }}
        disabled={disabled}
      />

      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (disabled) return;
          if (e.dataTransfer.files?.[0]) validateAndProcess(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[240px] ${
          isDragOver
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border hover:border-primary/50 hover:bg-muted/30 bg-card"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-8 ring-primary/5 transition-transform hover:scale-105">
          <Upload04Icon className="size-7" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">
          Drop an SVG file here or click to browse
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
          Strip Adobe Illustrator, Inkscape & Sketch bloat, remove hidden tags, and minify path precision.
        </p>
        <Badge variant="outline" className="text-xs font-mono">
          SVG Vector Files Only
        </Badge>
      </div>
    </div>
  );
}
