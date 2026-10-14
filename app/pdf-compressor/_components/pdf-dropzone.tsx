"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Upload04Icon, 
  Pdf01Icon, 
  Delete02Icon, 
  SparklesIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Drag01Icon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { formatBytes } from "@/lib/pdf-engine/pdf-sanitizer";
import { renderPdfFirstPageThumbnail } from "@/lib/pdf-engine/pdf-thumbnail";

export const MAX_PDF_COUNT = 15;
export const MAX_SINGLE_PDF_SIZE_MB = 50;
export const MAX_SINGLE_PDF_SIZE_BYTES = MAX_SINGLE_PDF_SIZE_MB * 1024 * 1024;

interface PdfDropzoneProps {
  selectedPdfs: File[];
  onPdfsSelected: (files: File[]) => void;
  onRemovePdf: (index: number) => void;
  onReorderPdfs: (newOrder: File[]) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export function PdfDropzone({
  selectedPdfs,
  onPdfsSelected,
  onRemovePdf,
  onReorderPdfs,
  onClearAll,
  disabled,
}: PdfDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    selectedPdfs.forEach(async (file) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      if (!thumbnails[fileKey]) {
        try {
          const thumbUrl = await renderPdfFirstPageThumbnail(file);
          if (thumbUrl) {
            setThumbnails((prev) => ({ ...prev, [fileKey]: thumbUrl }));
          }
        } catch {
          // fallback icon
        }
      }
    });
  }, [selectedPdfs, thumbnails]);

  const validateAndAddPdfs = (incoming: FileList | File[]) => {
    setErrorMessage(null);
    const filesArray = Array.from(incoming);
    if (filesArray.length === 0) return;

    const totalCount = selectedPdfs.length + filesArray.length;
    if (totalCount > MAX_PDF_COUNT) {
      setErrorMessage(
        `Batch limit exceeded: You can select up to ${MAX_PDF_COUNT} PDF files at once (attempted ${totalCount}).`
      );
      return;
    }

    const validPdfs: File[] = [];

    for (const file of filesArray) {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setErrorMessage(
          `Unsupported file: "${file.name}". Only PDF documents are allowed. Other file types are strictly rejected.`
        );
        return;
      }

      if (file.size > MAX_SINGLE_PDF_SIZE_BYTES) {
        setErrorMessage(
          `File too large: "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed per file is ${MAX_SINGLE_PDF_SIZE_MB}MB.`
        );
        return;
      }

      const isAlreadyAdded = selectedPdfs.some(
        (existing) => existing.name === file.name && existing.size === file.size
      );
      if (!isAlreadyAdded) {
        validPdfs.push(file);
      }
    }

    if (validPdfs.length > 0) {
      onPdfsSelected(validPdfs);
    }
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
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddPdfs(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddPdfs(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleItemDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...selectedPdfs];
    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);

    onReorderPdfs(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      {/* Error message banner */}
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
              <span className="font-semibold block mb-0.5">Invalid File Type or Limit</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setErrorMessage(null)} 
              className="text-xs underline hover:no-underline ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* If no files selected yet, show full hero dropzone */}
      {selectedPdfs.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="mx-auto size-14 rounded-full bg-secondary flex items-center justify-center text-primary mb-3.5 shadow-sm border border-border">
            <Upload04Icon className="size-7" />
          </div>

          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Upload PDF documents (Max 15 files)
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">
            Drop up to 15 PDFs. Real page previews let you visually drag & rearrange merge sequence with ease.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckmarkCircle02Icon className="size-3.5 text-primary" />
              PDFs Only (.pdf)
            </span>
            <span className="flex items-center gap-1">
              <CheckmarkCircle02Icon className="size-3.5 text-primary" />
              Visual Page 1 Previews
            </span>
            <span className="flex items-center gap-1">
              <CheckmarkCircle02Icon className="size-3.5 text-primary" />
              Drag & Drop Reordering
            </span>
          </div>
        </div>
      ) : (
        /* Compact Header Drop Banner when files are loaded */
        <div className="border border-border rounded-xl p-4 bg-card/60 backdrop-blur-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                Document Sequence & Previews ({selectedPdfs.length}/{MAX_PDF_COUNT})
              </span>
              <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border">
                Total: {formatBytes(selectedPdfs.reduce((sum, f) => sum + f.size, 0))}
              </span>
              {selectedPdfs.length > 1 && (
                <span className="text-[11px] text-muted-foreground hidden lg:inline-flex items-center gap-1">
                  • <Drag01Icon className="size-3 text-primary" /> Drag thumbnails to reorder merge sequence
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedPdfs.length >= MAX_PDF_COUNT || disabled}
                className="h-7 text-xs px-2.5 cursor-pointer"
              >
                + Add More
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                disabled={disabled}
                className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
              >
                <Delete02Icon className="size-3.5 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Horizontal Scrollable Carousel-Style Visual Thumbnails Strip */}
          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin] select-none">
            {selectedPdfs.map((pdf, idx) => {
              const fileKey = `${pdf.name}-${pdf.size}-${pdf.lastModified}`;
              const thumbUrl = thumbnails[fileKey];
              const isBeingDragged = draggedIndex === idx;
              const isOver = dragOverIndex === idx;

              return (
                <div
                  key={fileKey}
                  draggable={!disabled}
                  onDragStart={(e) => handleItemDragStart(e, idx)}
                  onDragOver={(e) => handleItemDragOver(e, idx)}
                  onDragLeave={handleItemDragLeave}
                  onDrop={(e) => handleItemDrop(e, idx)}
                  onDragEnd={handleItemDragEnd}
                  className={`relative w-36 sm:w-40 shrink-0 flex flex-col rounded-xl border p-2 bg-secondary/30 transition-all cursor-grab active:cursor-grabbing group ${
                    isBeingDragged
                      ? "opacity-40 border-primary dashed scale-[0.96]"
                      : isOver
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40 scale-[1.02]"
                      : "border-border hover:bg-secondary/60 hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  {/* Sequence Position Badge */}
                  <div className="absolute top-3 left-3 z-10 size-5 rounded-md bg-primary text-primary-foreground font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {idx + 1}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePdf(idx);
                    }}
                    disabled={disabled}
                    className="absolute top-2.5 right-2.5 z-10 size-6 rounded-md bg-background/80 backdrop-blur-xs opacity-70 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 cursor-pointer shadow-xs"
                  >
                    <Delete02Icon className="size-3.5" />
                  </Button>

                  {/* PDF Document First Page Thumbnail Container */}
                  <div className="w-full aspect-[3/4] rounded-lg bg-background/80 border border-border overflow-hidden flex items-center justify-center relative shadow-inner group-hover:border-primary/20 transition-colors">
                    {thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbUrl}
                        alt={`Page 1 of ${pdf.name}`}
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground gap-1.5">
                        <Pdf01Icon className="size-7 text-primary/70 animate-pulse" />
                        <span className="text-[9px] font-mono leading-tight">Rendering...</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center pointer-events-none">
                      <Drag01Icon className="size-5 text-primary opacity-0 group-hover:opacity-70 transition-opacity drop-shadow-xs" />
                    </div>
                  </div>

                  {/* File Metadata Info */}
                  <div className="mt-2 px-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate" title={pdf.name}>
                      {pdf.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>{formatBytes(pdf.size)}</span>
                      <span className="text-[9px] uppercase px-1 rounded bg-secondary text-muted-foreground">PDF</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
