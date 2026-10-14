import type { Metadata } from "next";
import { PromptScrubberClient } from "./_components/prompt-scrubber-client";
import { AdContainer } from "@/app/_components/ad-container";
import { SecurityLockIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "AI Prompt Scrubber & Security Sanitizer | UnTraceMe",
  description:
    "Strip system jailbreak traps, hidden watermarking tokens, leaked API credentials, and conversational preambles from your AI workflows.",
  openGraph: {
    title: "AI Prompt Scrubber & Security Sanitizer | UnTraceMe",
    description:
      "Prompt sanitization suite. Remove DAN injection preambles, watermark tokens, and sensitive keys.",
  },
};

export default function PromptCleanerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title (Server Rendered for SEO) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <SecurityLockIcon className="size-4" />
          <span>Module 03</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          AI Prompt Scrubber & Sanitizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Sanitize shared prompts by eliminating adversarial jailbreaks, hidden watermarks, zero-width tracking characters, and accidental API key leaks.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <PromptScrubberClient />

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
