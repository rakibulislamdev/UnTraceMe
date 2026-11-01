"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Download04Icon, FileEditIcon } from "@/lib/hugeicons-adapter";
import { DocWatermarkAudit } from "@/lib/document-engine/document-watermark-cleaner";

interface DocumentPreviewPaneProps {
  audit: DocWatermarkAudit | null;
  sanitizedBlob: Blob | null;
  isProcessing: boolean;
  isSanitized: boolean;
  downloadFileName: string;
}

export function DocumentPreviewPane({
  audit,
  sanitizedBlob,
  isProcessing,
  isSanitized,
  downloadFileName,
}: DocumentPreviewPaneProps) {
  if (!audit) {
    return (
      <Card className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center min-h-[440px]">
        <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
          <FileEditIcon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          No Document Selected
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
          Upload a DOCX or PDF file to review detected watermarks, invisible characters, and download the cleaned document.
        </p>
      </Card>
    );
  }

  const downloadUrl = sanitizedBlob ? URL.createObjectURL(sanitizedBlob) : null;

  return (
    <Card className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-tight">
            DOCUMENT DETAILS &amp; WATERMARK AUDIT
          </span>
          {isSanitized && (
            <span className="font-mono text-[11px] text-emerald-400 font-medium">
              100% Cleaned
            </span>
          )}
        </div>

        {/* Document Metadata & Invisible Token Inspection Box */}
        <div className="rounded-lg border border-border bg-[#010102] p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[11px] text-muted-foreground block">Format</span>
              <span className="text-foreground font-semibold mt-0.5 block">
                {audit.fileType.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">File Size</span>
              <span className="text-foreground font-semibold mt-0.5 block">
                {(audit.fileSizeBytes / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <span className="text-[11px] font-mono text-muted-foreground block mb-2">
              Invisible Zero-Width Character Codes:
            </span>
            {audit.invisibleCharMatches.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {audit.invisibleCharMatches.map((code) => (
                  <span
                    key={code}
                    className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-mono font-medium"
                  >
                    {code}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-emerald-400">
                None detected in text stream
              </span>
            )}
          </div>

          {audit.embeddedMetadataTags.length > 0 && (
            <div className="pt-3 border-t border-border/50">
              <span className="text-[11px] font-mono text-muted-foreground block mb-2">
                Embedded Document Tags:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto" data-lenis-prevent>
                {audit.embeddedMetadataTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-secondary/30"
                  >
                    <span className="text-muted-foreground">{tag.name}:</span>
                    <span className="text-foreground truncate max-w-[200px]">{tag.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action / Download Bar */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-3">
          <span>Target: {audit.fileType.toUpperCase()}</span>
          <span>•</span>
          <span>Preserves Document Formatting</span>
        </div>

        {isSanitized && downloadUrl ? (
          <a
            href={downloadUrl}
            download={downloadFileName}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-mono text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 gap-2 transition-colors shrink-0"
          >
            <Download04Icon className="size-4 shrink-0" />
            <span>Download Cleaned Document</span>
          </a>
        ) : (
          <span className="text-xs font-mono text-muted-foreground">
            Click &quot;Scrub Document&quot; above to sanitize
          </span>
        )}
      </div>
    </Card>
  );
}

