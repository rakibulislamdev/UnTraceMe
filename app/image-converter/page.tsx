import type { Metadata } from "next";
import { ImageConverterClient } from "./_components/image-converter-client";
import { AdContainer } from "@/app/_components/ad-container";
import { Exchange01Icon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Batch Image Converter | UnTraceMe",
  description:
    "Convert images seamlessly between PNG, JPG, WebP, AVIF, and BMP formats entirely in your browser without data uploads.",
  openGraph: {
    title: "Batch Image Converter — 100% Client-Side | UnTraceMe",
    description:
      "Convert multiple images simultaneously to WebP, PNG, JPG, AVIF, or BMP with custom compression, transparency preservation, and zero server logging.",
  },
};

export default function ImageConverterPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Server Rendered for SEO) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <Exchange01Icon className="size-4" />
          <span>Module 06</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Batch Image Converter
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Convert high-resolution images in batches up to 10 images between WebP, PNG, JPEG, AVIF, and BMP entirely on your device with instant processing and single-click ZIP archive packaging.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <ImageConverterClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
