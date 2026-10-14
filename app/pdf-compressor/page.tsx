import type { Metadata } from "next";
import { PdfCompressorClient } from "./_components/pdf-compressor-client";
import { AdContainer } from "@/app/_components/ad-container";
import { Pdf01Icon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "PDF Compressor & Sanitizer | UnTraceMe",
  description:
    "Compress PDF documents with object stream packing and strip hidden author, software, and revision history metadata securely in your browser.",
  openGraph: {
    title: "Free Client-Side PDF Compressor & Metadata Sanitizer | UnTraceMe",
    description:
      "Compress PDFs and wipe tracking metadata (Author, Producer, XMP, C2PA) entirely in your browser with zero server footprint.",
  },
};

export default function PdfCompressorPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Server Rendered for SEO) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <Pdf01Icon className="size-4" />
          <span>Module 07</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          PDF Compressor & Metadata Sanitizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Compress PDF file size using cross-reference object stream compaction while permanently scrubbing document author traces, software fingerprints, and Adobe XMP metadata.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <PdfCompressorClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
