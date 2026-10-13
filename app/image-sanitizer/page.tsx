import React from "react";
import type { Metadata } from "next";
import { ImageSanitizerClient } from "./_components/image-sanitizer-client";
import { MAX_IMAGES_COUNT } from "./_components/dropzone-pane";
import { AdContainer } from "@/app/_components/ad-container";
import { Image01Icon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "AI Image Trace & Metadata Sanitizer | UnTraceMe",
  description:
    "Strip EXIF, C2PA Content Credentials, and embedded AI prompts completely inside your browser with micro-dithering trace disruption.",
  openGraph: {
    title: "AI Image Trace & Metadata Sanitizer | UnTraceMe",
    description:
      "100% private, client-side EXIF, C2PA, and invisible watermark sanitizer.",
  },
};

export default function ImageSanitizerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Server Rendered for SEO) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <Image01Icon className="size-4" />
          <span>Module 02</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          AI Image Trace & Metadata Sanitizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Cleanse C2PA content credentials, embedded prompts, and EXIF tracking metadata completely inside your browser. Batch processing up to {MAX_IMAGES_COUNT} images simultaneously.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <ImageSanitizerClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
