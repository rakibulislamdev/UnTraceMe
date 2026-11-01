"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield01Icon,
  Shield02Icon,
  GlobeIcon,
  CpuIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
} from "@/lib/hugeicons-adapter";
import { VideoMetadataReport } from "@/lib/video-engine/video-sanitizer";

interface VideoAuditPaneProps {
  report: VideoMetadataReport | null;
  isSanitized: boolean;
  removedCount: number;
}

export function VideoAuditPane({
  report,
  isSanitized,
  removedCount,
}: VideoAuditPaneProps) {
  if (!report) {
    return (
      <Card className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center min-h-[440px]">
        <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
          <Shield01Icon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          Awaiting Video Upload
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
          Detailed ISO-BMFF container telemetry, GPS geolocation atoms, C2PA AI watermarks, and XMP streams will be audited here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      {/* Geolocation & Protection Status Banner */}
      {isSanitized ? (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckmarkCircle02Icon className="size-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-foreground font-medium block truncate">
                All Geolocation & AI Traces Scrubbed
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">
                {removedCount} metadata payload containers eliminated
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono shrink-0">
            Protected
          </Badge>
        </Card>
      ) : report.hasGps ? (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="size-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-rose-400 font-medium block truncate">
                GPS Geolocation Coordinates Found
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">
                Camera position atom detected in video stream
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-400 bg-rose-500/10 font-mono shrink-0">
            Leaked
          </Badge>
        </Card>
      ) : (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Shield01Icon className="size-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-foreground font-medium block truncate">
                GPS Geolocation Protected
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">
                Zero geographical coordinates embedded
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-medium shrink-0">
            Protected
          </span>
        </Card>
      )}

      {/* Forensic Metadata Audit Details */}
      <Card className="p-6 rounded-xl border border-border bg-card space-y-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="border-b border-border pb-3 flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              BINARY ATOM & STREAM AUDIT
            </span>
            <span className="text-xs font-mono text-primary font-medium">
              {isSanitized ? "Clean Container" : "Active Audit"}
            </span>
          </div>

          <div className="space-y-3">
            {/* Tag 1: C2PA / AI Markers */}
            <div className="p-3 rounded-lg border border-border bg-[#010102] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <CpuIcon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    C2PA & AI Synthetic Markers
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Generative video provenance, model tokens (Sora, Runway, Pika, Stable Video)
                </p>
              </div>
              <span className="text-[10px] font-mono shrink-0">
                {isSanitized ? (
                  <span className="text-emerald-400">Scrubbed</span>
                ) : report.hasAiTraces ? (
                  <span className="text-rose-400">Detected</span>
                ) : (
                  <span className="text-muted-foreground">Not Found</span>
                )}
              </span>
            </div>

            {/* Tag 2: GPS Position Atoms */}
            <div className="p-3 rounded-lg border border-border bg-[#010102] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <GlobeIcon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    ISO-BMFF ©xyz GPS Position
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Latitude, longitude, altitude coordinate atoms recorded by phone or camera
                </p>
              </div>
              <span className="text-[10px] font-mono shrink-0">
                {isSanitized ? (
                  <span className="text-emerald-400">Scrubbed</span>
                ) : report.hasGps ? (
                  <span className="text-rose-400">Detected</span>
                ) : (
                  <span className="text-muted-foreground">Clean</span>
                )}
              </span>
            </div>

            {/* Tag 3: Hardware & Device Signatures */}
            <div className="p-3 rounded-lg border border-border bg-[#010102] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckmarkCircle02Icon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Device, Encoder & XMP Telemetry
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  QuickTime moov.udta, software encoder tags, creator profiles
                </p>
              </div>
              <span className="text-[10px] font-mono shrink-0">
                {isSanitized ? (
                  <span className="text-emerald-400">Scrubbed</span>
                ) : report.hasHardwareTraces ? (
                  <span className="text-amber-400">Detected</span>
                ) : (
                  <span className="text-muted-foreground">Clean</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Statistics */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Processing: 100% Client-side sandbox</span>
          <span>Zero Server Uploads</span>
        </div>
      </Card>
    </div>
  );
}

