"use client";

import React from "react";
import { 
  Shield01Icon, 
  AlertCircleIcon, 
  CleanIcon, 
  CheckmarkCircle02Icon 
} from "hugeicons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrubFinding } from "@/lib/text-engine/prompt-scrubber";

interface ScrubAuditMetricsProps {
  score: number;
  originalRisk: number;
  removedCount: number;
  findings: ScrubFinding[];
  hasScrubbed: boolean;
}

export function ScrubAuditMetrics({
  score,
  originalRisk,
  removedCount,
  findings,
  hasScrubbed,
}: ScrubAuditMetricsProps) {
  if (!hasScrubbed) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-border gap-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckmarkCircle02Icon className="size-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">
              {removedCount > 0
                ? `${removedCount} Contaminant${removedCount > 1 ? "s" : ""} Neutralized`
                : "Prompt Sanitized"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Jailbreak triggers, platform stamps, and secret keys purged from workflow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs tabular-nums">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Status:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Clean
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Purity:</span>
            <span className="font-semibold text-foreground">
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* Findings Breakdown */}
      {findings.length > 0 ? (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground block">
            Purged Audit Log:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {findings.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <AlertCircleIcon className="size-3.5 text-amber-500 shrink-0" />
                  <span className="text-foreground truncate font-medium">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 font-medium">
                  {item.count} removed
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <CheckmarkCircle02Icon className="size-4 shrink-0" />
          <span>
            Input prompt adheres cleanly to standard formatting with zero watermarks or injection tags.
          </span>
        </div>
      )}
    </div>
  );
}
