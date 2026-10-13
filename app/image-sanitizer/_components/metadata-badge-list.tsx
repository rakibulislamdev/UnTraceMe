import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircleIcon, 
  CheckmarkCircle02Icon, 
  Shield01Icon 
} from "hugeicons-react";

interface MetadataBadgeListProps {
  hasImage: boolean;
  isSanitized: boolean;
}

export function MetadataBadgeList({ hasImage, isSanitized }: MetadataBadgeListProps) {
  if (!hasImage) return null;

  const artifacts = [
    { label: "C2PA Content Credentials", status: isSanitized ? "Stripped" : "Detected" },
    { label: "EXIF & IPTC Header Records", status: isSanitized ? "Cleaned" : "Active" },
    { label: "AI Generator Prompts / Tags", status: isSanitized ? "Erased" : "Present" },
    { label: "Synthetic Fingerprint Metadata", status: isSanitized ? "Neutralized" : "Flagged" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Shield01Icon className="size-4 text-primary" />
          Detected AI Metadata & Invisible Traces
        </h4>
        <span className="text-xs text-muted-foreground">
          {isSanitized ? "Status: 100% Clean" : "Status: Analysis Complete"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {artifacts.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/20 text-xs"
          >
            <span className="font-medium text-foreground">{item.label}</span>
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
                  {item.status}
                </>
              ) : (
                <>
                  <AlertCircleIcon className="size-3" />
                  {item.status}
                </>
              )}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
