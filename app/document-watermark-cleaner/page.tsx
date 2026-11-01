import type { Metadata } from "next";
import { DocumentWatermarkCleanerClient } from "./_components/document-watermark-cleaner-client";
import { AdContainer } from "@/app/_components/ad-container";
import { FileEditIcon } from "@/lib/hugeicons-adapter";

export const metadata: Metadata = {
  title: "AI Document Watermark Remover | UnTraceMe",
  description:
    "Detect and erase zero-width Unicode steganography tokens, visual watermark shapes, and AI generation metadata from DOCX and PDF documents.",
  openGraph: {
    title: "AI Document Watermark Remover | UnTraceMe",
    description:
      "100% private, client-side DOCX & PDF watermark and zero-width AI space scrubber. Erase invisible tracking tokens in-browser.",
  },
};

export default function DocumentWatermarkCleanerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <FileEditIcon className="size-3.5" />
          <span>MODULE 10 — DOCUMENT FORENSICS & WATERMARK REMOVER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          AI Document Watermark Remover
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Detect and sanitize invisible zero-width Unicode spaces (U+200B, U+FEFF), Word visual watermark shapes, and producer telemetry from DOCX and PDF files with zero formatting loss.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <DocumentWatermarkCleanerClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}

