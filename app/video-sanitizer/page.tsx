import type { Metadata } from "next";
import { VideoSanitizerClient } from "./_components/video-sanitizer-client";
import { AdContainer } from "@/app/_components/ad-container";
import { SecurityLockIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "AI Video & Reel Sanitizer | UnTraceMe",
  description:
    "Strip EXIF, camera geolocation, and AI-generation synthetic provenance markers from MP4 and WebM videos client-side.",
  openGraph: {
    title: "AI Video & Reel Sanitizer | UnTraceMe",
    description:
      "100% private, client-side MP4 and WebM video metadata scrubber. Strip GPS, C2PA, and device tags locally.",
  },
};

export default function VideoSanitizerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <SecurityLockIcon className="size-3.5" />
          <span>MODULE 09 — VIDEO FORENSICS & SANITIZER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          AI Video & Reel Sanitizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Eliminate binary camera hardware tags, GPS geolocation atoms, and C2PA synthetic model markers from MP4 and WebM reels with zero re-encoding quality loss.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <VideoSanitizerClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}

