"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ExifParsedData } from "@/lib/image-engine/exif-parser";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield01Icon, Image01Icon } from "hugeicons-react";

// Dynamically import Leaflet map with SSR disabled
const ExifMap = dynamic(
  () => import("./exif-map").then((mod) => mod.ExifMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 rounded-lg border border-border bg-[#010102] flex items-center justify-center text-xs text-muted-foreground font-mono">
        Loading private map viewport...
      </div>
    ),
  }
);

interface ExifDetailsPaneProps {
  data: ExifParsedData | null;
  imageSrc: string | null;
}

export function ExifDetailsPane({ data, imageSrc }: ExifDetailsPaneProps) {
  if (!imageSrc) {
    return (
      <Card className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="size-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-3">
          <Image01Icon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          No Metadata Extracted
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
          Upload an original photo to reveal binary camera records, lens settings, and GPS coordinates.
        </p>
      </Card>
    );
  }

  if (!data?.hasExif) {
    return (
      <Card className="p-8 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="size-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 border border-emerald-500/20">
          <Shield01Icon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          Zero EXIF Metadata Detected
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
          This image appears completely clean or scrubbed. No embedded camera, lens, software, or geolocation tags were found in its binary header.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      {/* Geolocation Section */}
      {data.gps ? (
        <Card className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                LEAKED GPS GEOLOCATION DETECTED
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-500 bg-rose-500/5 font-mono">
              High Sensitivity
            </Badge>
          </div>

          <ExifMap
            latitude={data.gps.latitude}
            longitude={data.gps.longitude}
            googleMapsUrl={data.gps.googleMapsUrl}
            openStreetMapUrl={data.gps.openStreetMapUrl}
          />
        </Card>
      ) : (
        <Card className="p-6 rounded-xl border border-border bg-card h-[92px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Shield01Icon className="size-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-foreground font-medium block truncate">GPS Geolocation Protected</span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-0.5 truncate">Zero location coordinates detected</span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-medium shrink-0">
            Protected
          </span>
        </Card>
      )}

      {/* Camera & Shooting Parameters */}
      <Card className="p-6 rounded-xl border border-border bg-card space-y-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="border-b border-border pb-3 flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              CAMERA & SHUTTER METADATA
            </span>
            <span className="text-xs font-mono text-primary font-medium">
              {data.camera?.make || "Hardware Tagged"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">Camera Make</span>
              <span className="font-semibold text-foreground mt-0.5 block truncate">
                {data.camera?.make || "—"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">Camera Model</span>
              <span className="font-semibold text-foreground mt-0.5 block truncate">
                {data.camera?.model || "—"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">Lens Type</span>
              <span className="font-semibold text-foreground mt-0.5 block truncate">
                {data.camera?.lensModel || "—"}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">Aperture</span>
              <span className="font-mono text-foreground font-medium mt-0.5 block">
                {data.shot?.fNumber || "—"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">Shutter Speed</span>
              <span className="font-mono text-foreground font-medium mt-0.5 block">
                {data.shot?.exposureTime || "—"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">ISO Speed</span>
              <span className="font-mono text-foreground font-medium mt-0.5 block">
                {data.shot?.iso ? `ISO ${data.shot.iso}` : "—"}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-mono">Focal Length</span>
              <span className="font-mono text-foreground font-medium mt-0.5 block">
                {data.shot?.focalLength || "—"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[11px] text-muted-foreground block font-mono">Date Taken</span>
              <span className="font-mono text-foreground font-medium mt-0.5 block">
                {data.shot?.dateTimeOriginal || data.shot?.createDate || "—"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

