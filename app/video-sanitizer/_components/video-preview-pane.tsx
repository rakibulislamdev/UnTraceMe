"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download04Icon,
  Shield01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  SecurityLockIcon,
} from "@/lib/hugeicons-adapter";
import { VideoMetadataReport } from "@/lib/video-engine/video-sanitizer";

interface VideoPreviewPaneProps {
  videoSrc: string | null;
  sanitizedSrc: string | null;
  report: VideoMetadataReport | null;
  isProcessing: boolean;
  isSanitized: boolean;
  downloadFileName: string;
}

export function VideoPreviewPane({
  videoSrc,
  sanitizedSrc,
  report,
  isProcessing,
  isSanitized,
  downloadFileName,
}: VideoPreviewPaneProps) {
  if (!videoSrc) {
    return (
      <Card className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center min-h-[440px]">
        <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
          <SecurityLockIcon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          No Video Loaded
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
          Upload an MP4 or WebM video reel to inspect embedded metadata boxes, AI markers, and remove tracking traces.
        </p>
      </Card>
    );
  }

  const activeSrc = sanitizedSrc || videoSrc;

  return (
    <Card className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-tight">
            {isSanitized ? "SANITIZED VIDEO PREVIEW" : "ORIGINAL VIDEO PREVIEW"}
          </span>
          {isSanitized && (
            <span className="font-mono text-[11px] text-emerald-400 font-medium">
              100% Cleaned
            </span>
          )}
        </div>

        {/* Video Player Box */}
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#010102] border border-border flex items-center justify-center relative">
          <video
            src={activeSrc}
            controls
            playsInline
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      {/* Action / Download Bar */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-3">
          <span>Format: {report?.format?.toUpperCase() || "MP4"}</span>
          <span>•</span>
          <span>Zero Re-encoding Loss</span>
        </div>

        {isSanitized && sanitizedSrc ? (
          <a
            href={sanitizedSrc}
            download={downloadFileName}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-mono text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 gap-2 transition-colors shrink-0"
          >
            <Download04Icon className="size-4 shrink-0" />
            <span>Download Sanitized Video</span>
          </a>
        ) : (
          <span className="text-xs font-mono text-muted-foreground">
            Click &quot;Scrub Video&quot; above to sanitize
          </span>
        )}
      </div>
    </Card>
  );
}

