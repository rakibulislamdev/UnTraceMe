"use client";

import React from "react";
import { CheckmarkCircle02Icon, Download04Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/image-engine/image-converter";
import { SplitPdfResult } from "@/lib/pdf-engine/pdf-organizer";

interface PdfResultCardProps {
  result: SplitPdfResult;
  onDownload: () => void;
}

export function PdfResultCard({ result, onDownload }: PdfResultCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 items-center justify-center">
              <CheckmarkCircle02Icon className="size-3.5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              Organized Document Ready ({result.pageCount} Pages)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Output File Size: {formatBytes(result.sizeBytes)} • Saved directly to your device
          </p>
        </div>

        <Button
          onClick={onDownload}
          size="sm"
          className="cursor-pointer font-medium"
        >
          <Download04Icon className="size-4 mr-1.5" />
          Download {result.filename}
        </Button>
      </div>
    </div>
  );
}
