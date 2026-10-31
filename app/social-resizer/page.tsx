import type { Metadata } from "next";
import { SocialCropperClient } from "./_components/social-cropper-client";
import { AdContainer } from "@/app/_components/ad-container";
import { ImageCompositionIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Social Media Smart Cropper & Resizer | UnTraceMe",
  description:
    "Crop and resize images for YouTube, Instagram, X (Twitter), LinkedIn, and TikTok locally in your browser with zero server uploads.",
  openGraph: {
    title: "Free Social Media Smart Cropper & Resizer | UnTraceMe",
    description:
      "Auto-adapt graphics to perfect social media aspect ratios and resolutions with instant client-side download.",
  },
};

export default function SocialCropperPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Linear Style) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-2">
          <ImageCompositionIcon className="size-3.5" />
          <span>MODULE 12 — ASPECT RATIO ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.03em]">
          Social Media Smart Cropper & Resizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed tracking-tight">
          Adapt visual creatives to YouTube thumbnails, Instagram posts, X banners, TikTok reels, and LinkedIn banners. 100% in-browser canvas execution with zero data tracking.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <SocialCropperClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}

