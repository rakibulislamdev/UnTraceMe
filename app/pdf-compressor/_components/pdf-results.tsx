"use client";

import React from "react";
import { 
  Download04Icon, 
  CheckmarkCircle02Icon, 
  ArrowRight01Icon, 
  Shield01Icon, 
  SparklesIcon,
  RefreshIcon,
  Layers01Icon,
  Folder01Icon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { PdfProcessResult, formatBytes } from "@/lib/pdf-engine/pdf-sanitizer";

interface PdfResultsProps {
  results: PdfProcessResult[];
  isProcessing: boolean;
  onProcessBatch: () => void;
  onMergePdfs: () => void;
  isMerging: boolean;
  fileCount: number;
  onDownloadAllZip: () => void;
  isZipping: boolean;
}

export function PdfResults({
  results,
  isProcessing,
  onProcessBatch,
  onMergePdfs,
  isMerging,
  fileCount,
  onDownloadAllZip,
  isZipping,
}: PdfResultsProps) {
  const handleDownloadSingle = (res: PdfProcessResult) => {
    const url = URL.createObjectURL(res.blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = res.filename.toLowerCase().endsWith(".pdf")
      ? res.filename
      : `${res.filename}.pdf`;
    link.download = `untraceme-sanitized-${safeName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalOriginalBytes = results.reduce((acc, r) => acc + r.originalSizeBytes, 0);
  const totalNewBytes = results.reduce((acc, r) => acc + r.newSizeBytes, 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalNewBytes);
  const totalPercentageSaved = totalOriginalBytes > 0
    ? Math.round((totalSavedBytes / totalOriginalBytes) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Primary Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Shield01Icon className="size-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            {results.length > 0
              ? `Completed processing ${results.length} document(s)`
              : `Ready to process ${fileCount} PDF document(s)`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Combine / Merge Button (Available when 2 or more PDFs uploaded) */}
          {fileCount >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMergePdfs}
              disabled={isProcessing || isMerging}
              className="h-9 text-xs px-4 cursor-pointer border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-medium"
            >
              {isMerging ? (
                <>
                  <RefreshIcon className="size-3.5 mr-1.5 animate-spin" />
                  Merging {fileCount} PDFs...
                </>
              ) : (
                <>
                  <Layers01Icon className="size-3.5 mr-1.5 text-primary" />
                  Merge All ({fileCount} into 1 PDF)
                </>
              )}
            </Button>
          )}

          {/* Compress & Sanitize Batch Button */}
          <Button
            onClick={onProcessBatch}
            disabled={isProcessing || isMerging || fileCount === 0}
            className="h-9 text-xs px-5 shadow-sm cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshIcon className="size-3.5 mr-1.5 animate-spin" />
                Sanitizing & Compressing...
              </>
            ) : (
              <>
                <SparklesIcon className="size-3.5 mr-1.5" />
                Sanitize & Compress ({fileCount} Files)
              </>
            )}
          </Button>

          {/* ZIP Batch Downloader if more than 1 file processed */}
          {results.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownloadAllZip}
              disabled={isZipping}
              className="h-9 text-xs px-4 cursor-pointer"
            >
              <Folder01Icon className="size-3.5 mr-1.5" />
              {isZipping ? "Creating ZIP..." : "Download ZIP Bundle"}
            </Button>
          )}
        </div>
      </div>

      {/* Aggregate Metrics Card when results exist */}
      {results.length > 0 && (
        <div className="border border-border rounded-xl p-5 bg-card/60 backdrop-blur-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <span className="text-[11px] text-muted-foreground block mb-0.5">Total Input Size</span>
              <span className="text-sm font-semibold font-mono text-foreground">
                {formatBytes(totalOriginalBytes)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-[11px] text-primary block mb-0.5 font-medium">New Output Size</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-mono text-primary">
                  {formatBytes(totalNewBytes)}
                </span>
                {totalPercentageSaved > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold">
                    -{totalPercentageSaved}%
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <span className="text-[11px] text-muted-foreground block mb-0.5">Documents Processed</span>
              <span className="text-sm font-semibold font-mono text-foreground flex items-center gap-1.5">
                <CheckmarkCircle02Icon className="size-4 text-emerald-500" />
                {results.length} File(s) Verified
              </span>
            </div>
          </div>

          {/* Individual Processed File Cards */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground block">
              Processed Output Documents
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((res, idx) => {
                const diff = res.originalSizeBytes - res.newSizeBytes;
                const pct = res.originalSizeBytes > 0
                  ? Math.max(0, Math.round((diff / res.originalSizeBytes) * 100))
                  : 0;

                return (
                  <div
                    key={`${res.filename}-${idx}`}
                    className="p-3.5 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {res.filename}
                        </span>
                        {pct > 0 && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                            -{pct}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 font-mono">
                        <span>{formatBytes(res.originalSizeBytes)} → {formatBytes(res.newSizeBytes)}</span>
                        <span>•</span>
                        <span>{res.pageCount} Pages</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDownloadSingle(res)}
                      title={`Download ${res.filename}`}
                      className="opacity-80 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary cursor-pointer"
                    >
                      <Download04Icon className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
