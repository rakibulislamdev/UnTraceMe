import React from "react";
import type { Metadata } from "next";
import { TextHumanizerClient } from "./_components/text-humanizer-client";
import { AdContainer } from "@/app/_components/ad-container";
import { SparklesIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "AI Text Trace Remover & Humanizer | UnTraceMe",
  description:
    "Bypass Turnitin, GPTZero, and AI detectors by restructuring tokens, injecting syntactic burstiness, and stripping giveaway patterns.",
  openGraph: {
    title: "AI Text Trace Remover & Humanizer | UnTraceMe",
    description:
      "Transform AI generated text into authentic, natural human writing.",
  },
};

export default function TextHumanizerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <SparklesIcon className="size-3.5" />
          <span>MODULE 01 — SYNTACTIC ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          AI Text Trace Remover & Humanizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Restructure predictable AI tokens, remove dead giveaway phrases, and boost syntactic burstiness to beat Turnitin, GPTZero, and detector heuristics.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <TextHumanizerClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
