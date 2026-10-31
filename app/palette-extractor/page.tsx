import type { Metadata } from "next";
import { PaletteExtractorClient } from "./_components/palette-extractor-client";
import { AdContainer } from "@/app/_components/ad-container";
import { ColorsIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Color Palette & Token Extractor | UnTraceMe",
  description:
    "Extract dominant color harmonies, WCAG contrast ratios, and copy-paste Tailwind CSS tokens directly from uploaded artwork.",
  openGraph: {
    title: "Free Color Palette & Design Token Extractor | UnTraceMe",
    description:
      "100% private, client-side palette extractor. Export CSS variables, Tailwind configuration, and JSON design tokens with zero server uploads.",
  },
};

export default function PaletteExtractorPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <ColorsIcon className="size-3.5" />
          <span>MODULE 13 — DESIGN TOKEN STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          Color Palette & Design Token Extractor
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Extract color harmonies, calculate WCAG accessibility contrast ratios, and export ready-to-use CSS Variables, Tailwind color tokens, and JSON schemas in real time.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <PaletteExtractorClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}

