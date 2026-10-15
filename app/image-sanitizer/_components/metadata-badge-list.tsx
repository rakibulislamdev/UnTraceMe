import { Badge } from "@/components/ui/badge";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Shield01Icon
} from "hugeicons-react";
import { ScannedMetadataResult } from "@/lib/image-engine/metadata-scanner";

interface MetadataBadgeListProps {
  hasImage: boolean;
  isSanitized: boolean;
  scannedInfo: ScannedMetadataResult | null;
}

export function MetadataBadgeList({
  hasImage,
  isSanitized,
  scannedInfo,
}: MetadataBadgeListProps) {
  if (!hasImage) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <h4 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Shield01Icon className="size-4 text-primary" />
          Binary Header & AI Watermark Inspection
        </h4>
        <div className="flex items-center gap-2">
          <Badge
            variant={isSanitized ? "outline" : "secondary"}
            className={
              isSanitized
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 font-medium"
                : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 font-medium"
            }
          >
            {isSanitized ? "Sanitization Complete — 100% Clean" : "Detected AI Artifacts"}
          </Badge>
        </div>
      </div>

      {/* Discovered Signatures List */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {isSanitized ? "Cleaned & Neutralized Signatures:" : "Discovered Metadata Markers:"}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {scannedInfo?.detectedSignatures && scannedInfo.detectedSignatures.length > 0 ? (
            scannedInfo.detectedSignatures.map((sig, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/20 text-xs"
              >
                <span className="font-medium text-foreground">{sig}</span>
                <Badge
                  variant={isSanitized ? "outline" : "secondary"}
                  className={
                    isSanitized
                      ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 gap-1 font-medium"
                      : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 gap-1 font-medium"
                  }
                >
                  {isSanitized ? (
                    <>
                      <CheckmarkCircle02Icon className="size-3" />
                      Erased
                    </>
                  ) : (
                    <>
                      <AlertCircleIcon className="size-3" />
                      Active
                    </>
                  )}
                </Badge>
              </div>
            ))
          ) : (
            <div className="p-3 text-xs text-muted-foreground">
              Scanning buffer segments...
            </div>
          )}
        </div>
      </div>

      {isSanitized && (
        <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
          <span>
            Micro-dither filter applied. All steganographic frequencies randomized without visual degradation.
          </span>
        </div>
      )}
    </div>
  );
}
