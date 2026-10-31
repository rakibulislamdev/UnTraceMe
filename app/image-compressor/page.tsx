import type { Metadata } from "next";
import { ImageCompressorClient } from "./_components/image-compressor-client";
import { AdContainer } from "@/app/_components/ad-container";
import { ImageCompositionIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Image Compressor & Optimizer | UnTraceMe",
  description:
    "Compress PNG, JPG, and WebP images up to 85% with client-side canvas optimization, metadata scrubbing, and zero server uploads.",
  openGraph: {
    title: "Free Client-Side Image Compressor & Optimizer | UnTraceMe",
    description:
      "Batch compress images locally in your browser. 100% private, zero server footprint, lightning fast.",
  },
};

export default function ImageCompressorPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <ImageCompositionIcon className="size-3.5" />
          <span>MODULE 05 — OPTIMIZATION ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          Image Compressor & Optimizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Reduce file size by up to 85% while keeping visual clarity crisp. Entirely in-browser processing with automated EXIF trace scrubbing and WebP conversion.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <ImageCompressorClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
