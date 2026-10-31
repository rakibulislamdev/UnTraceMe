import type { Metadata } from "next";
import { ExifInspectorClient } from "./_components/exif-inspector-client";
import { AdContainer } from "@/app/_components/ad-container";
import { GlobeIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "EXIF & Geolocation Map Inspector | UnTraceMe",
  description:
    "Inspect binary camera metadata, lens parameters, shutter settings, and exact GPS geolocation map coordinates client-side with zero data leaks.",
  openGraph: {
    title: "Free Client-Side EXIF & Geolocation Map Inspector | UnTraceMe",
    description:
      "Deep-inspect EXIF and pinpoint camera GPS coordinates on an interactive dark map. 100% private, runs entirely on your device.",
  },
};

export default function ExifInspectorPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <GlobeIcon className="size-3.5" />
          <span>MODULE 14 — METADATA FORENSICS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          EXIF & Geolocation Map Inspector
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Audit embedded camera headers, shutter parameters, hardware serials, and pinpoint precise photo geolocation coordinates on a private interactive map.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <ExifInspectorClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}

