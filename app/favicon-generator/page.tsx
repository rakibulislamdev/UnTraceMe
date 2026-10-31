import type { Metadata } from "next";
import { FaviconGeneratorClient } from "./_components/favicon-generator-client";
import { AdContainer } from "@/app/_components/ad-container";
import { Layers01Icon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Favicon & App Icon Pack Generator | UnTraceMe",
  description:
    "Generate multi-resolution favicon.ico, Apple touch icons, Android PWA manifests, and HTML head tags instantly in your browser with zero server uploads.",
  openGraph: {
    title: "Free Favicon & App Icon Pack Generator | UnTraceMe",
    description:
      "Transform any logo into a complete, modern favicon package (.ico, 16x16, 32x32, 180x180, PWA manifest) with zero server uploads.",
  },
};

export default function FaviconGeneratorPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <Layers01Icon className="size-3.5" />
          <span>MODULE 11 — ICON SUITE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          Favicon & App Icon Pack Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Convert any logo or artwork into a production-ready web icon suite. Generates binary <code className="text-foreground font-mono">favicon.ico</code> (16, 32, 48), Apple Touch icons, Android PWA assets, and copy-paste HTML tags.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <FaviconGeneratorClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
