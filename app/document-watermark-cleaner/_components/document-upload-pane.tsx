"use client";

import React, { useRef, useState } from "react";
import { Upload01Icon, SecurityLockIcon } from "@/lib/hugeicons-adapter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentUploadPaneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onSanitize: () => void;
  isProcessing: boolean;
  isSanitized: boolean;
  onReset: () => void;
}

const ALLOWED_EXTENSIONS = ["docx", "pdf"];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB limit

export function DocumentUploadPane({
  selectedFile,
  onFileSelect,
  onSanitize,
  isProcessing,
  isSanitized,
  onReset,
}: DocumentUploadPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateAndProcess = (file: File) => {
    setErrorMsg(null);
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMsg("Unsupported file format. Only DOCX and PDF documents are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg("Document is too large. Maximum allowed size is 50MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
    if (e.target) e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndProcess(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className={`p-6 rounded-xl border border-border bg-card flex flex-col justify-center ${selectedFile ? "h-[92px]" : ""}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
      />

      {!selectedFile ? (
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
            Click or drop DOCX or PDF document to audit & scrub
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Detects zero-width AI tokens, invisible watermarks & author metadata (up to 50MB)
          </p>
          {errorMsg && (
            <p className="text-xs text-rose-500 font-medium mt-2.5 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
              {errorMsg}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-tight block">
              SOURCE DOCUMENT
            </span>
            <p className="text-sm font-semibold text-foreground truncate mt-0.5">
              {selectedFile.name}
            </p>
            <span className="text-[11px] font-mono text-muted-foreground block">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.name.split(".").pop()?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs font-mono"
            >
              Change
            </Button>
            {!isSanitized && (
              <Button
                size="sm"
                onClick={onSanitize}
                disabled={isProcessing}
                className="h-8 text-xs font-mono bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <SecurityLockIcon className="size-3.5" />
                {isProcessing ? "Scrubbing..." : "Scrub Document"}
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

