import type { Metadata } from "next";
import { BgRemoverClient } from "./_components/bg-remover-client";
import { AdContainer } from "@/app/_components/ad-container";
import { SparklesIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "In-Browser AI Background Remover | UnTraceMe",
  description:
    "Cut out subject backgrounds instantly with client-side AI neural networks. 100% private, zero uploads, transparent PNG or custom color backgrounds.",
  openGraph: {
    title: "In-Browser AI Background Remover | UnTraceMe",
    description:
      "On-device neural network background removal. Zero server uploads, unlimited private image cutout.",
  },
};

export default function BgRemoverPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <SparklesIcon className="size-4" />
          <span>Module 07</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Image Background Remover
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Remove backgrounds from photos instantly with on-device processing. 100% private with custom backdrop colors or transparent PNG export.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <BgRemoverClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}

