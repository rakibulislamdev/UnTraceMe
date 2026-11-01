"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield01Icon,
  CheckmarkCircle02Icon,
  FileEditIcon,
  CpuIcon,
  Tag01Icon,
} from "@/lib/hugeicons-adapter";
import { DocWatermarkAudit } from "@/lib/document-engine/document-watermark-cleaner";

interface DocumentAuditPaneProps {
  audit: DocWatermarkAudit | null;
  isSanitized: boolean;
  cleanStats: {
    zeroWidthRemoved: number;
    watermarksScrubbed: number;
    metadataFieldsCleared: number;
  } | null;
}

export function DocumentAuditPane({
  audit,
  isSanitized,
  cleanStats,
}: DocumentAuditPaneProps) {
  if (!audit) {
    return (
      <Card className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center min-h-[440px]">
        <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
          <Shield01Icon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          Awaiting Document File
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
          Upload a DOCX or PDF file to inspect embedded zero-width Unicode steganography tokens, visual watermark shapes, and author metadata.
        </p>
      </Card>
    );
  }

  const hasWatermarks = audit.hiddenWatermarkFound || audit.zeroWidthCount > 0;

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      {/* Top Status Card: equalized to h-[92px] */}
      {isSanitized ? (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckmarkCircle02Icon className="size-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-foreground font-medium block truncate">
                Document Sanitized & Cleared
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">
                {cleanStats?.zeroWidthRemoved || 0} tokens &amp; {cleanStats?.metadataFieldsCleared || 0} fields scrubbed
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-medium shrink-0">
            Protected
          </span>
        </Card>
      ) : hasWatermarks ? (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="size-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-rose-400 font-medium block truncate">
                Hidden Watermark Tokens Detected
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">
                {audit.zeroWidthCount > 0
                  ? `${audit.zeroWidthCount} zero-width character(s) detected`
                  : "Watermark shapes found in document body"}
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-rose-400 font-medium shrink-0">
            Watermarked
          </span>
        </Card>
      ) : (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Shield01Icon className="size-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-foreground font-medium block truncate">
                Zero Hidden Watermarks Found
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">
                No zero-width characters detected in text streams
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-medium shrink-0">
            Protected
          </span>
        </Card>
      )}

      {/* Forensic Audit Details */}
      <Card className="p-6 rounded-xl border border-border bg-card space-y-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="border-b border-border pb-3 flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              STEGANOGRAPHY & METADATA AUDIT
            </span>
            <span className="text-xs font-mono text-primary font-medium">
              {isSanitized ? "Clean State" : "Active Audit"}
            </span>
          </div>

          <div className="space-y-3">
            {/* Tag 1: Zero-Width Unicode Steganography */}
            <div className="p-3 rounded-lg border border-border bg-[#010102] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <CpuIcon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Zero-Width Unicode Characters
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Invisible AI fingerprints (U+200B, U+200C, U+200D, U+FEFF, U+2060)
                </p>
              </div>
              <span className="text-[10px] font-mono shrink-0">
                {isSanitized ? (
                  <span className="text-emerald-400">0 Tokens</span>
                ) : audit.zeroWidthCount > 0 ? (
                  <span className="text-rose-400">{audit.zeroWidthCount} Tokens</span>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </span>
            </div>

            {/* Tag 2: Visual Watermark Shapes */}
            <div className="p-3 rounded-lg border border-border bg-[#010102] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <FileEditIcon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Document Watermark Shapes
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  VML WordPictureWatermark, header text stamps, draft labels
                </p>
              </div>
              <span className="text-[10px] font-mono shrink-0">
                {isSanitized ? (
                  <span className="text-emerald-400">Scrubbed</span>
                ) : audit.hiddenWatermarkFound ? (
                  <span className="text-amber-400">Detected</span>
                ) : (
                  <span className="text-muted-foreground">Clean</span>
                )}
              </span>
            </div>

            {/* Tag 3: Author & Application Metadata */}
            <div className="p-3 rounded-lg border border-border bg-[#010102] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Tag01Icon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Creator & Telemetry Profiles
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Producer software, creator accounts, revision telemetry
                </p>
              </div>
              <span className="text-[10px] font-mono shrink-0">
                {isSanitized ? (
                  <span className="text-emerald-400">Scrubbed</span>
                ) : audit.embeddedMetadataTags.length > 0 ? (
                  <span className="text-amber-400">{audit.embeddedMetadataTags.length} Tags</span>
                ) : (
                  <span className="text-muted-foreground">Clean</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Statistics */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Processing: 100% In-browser memory</span>
          <span>Zero Server Uploads</span>
        </div>
      </Card>
    </div>
  );
}

