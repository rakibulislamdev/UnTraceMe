import type { Metadata } from "next";
import { SvgOptimizerClient } from "./_components/svg-optimizer-client";
import { AdContainer } from "@/app/_components/ad-container";
import { ImageCompositionIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "SVG Optimizer & Minifier | UnTraceMe",
  description:
    "Minify SVG vector graphics, strip Adobe/Inkscape editor bloat, clean hidden tags, and round coordinate precision 100% in your browser.",
};

export default function SvgOptimizerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <ImageCompositionIcon className="size-4" />
          <span>Module 07</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          SVG Optimizer & Minifier
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Compress SVG files up to 70% by stripping XML editor namespaces, useless metadata, and comments entirely on your device with instant download.
        </p>
      </div>

      <AdContainer format="banner" className="mb-6" />
      <SvgOptimizerClient />
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
