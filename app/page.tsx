import React from "react";
import Link from "next/link";
import { TOOLS_REGISTRY } from "@/config/tools-registry";
import { ToolsSuiteSection } from "./_components/tools-suite-section";
import { AdContainer } from "./_components/ad-container";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  SparklesIcon, 
  Shield01Icon, 
  CpuIcon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon
} from "hugeicons-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section — Linear craft aesthetic */}
      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20 border-b border-border bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(94,106,210,0.15),transparent)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground border border-border mb-8 shadow-xs">
            <SparklesIcon className="size-3.5 -mt-px text-primary" />
            <span>Anti-AI Detection & Metadata Scrubbing Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-[-0.04em] leading-[1.08]">
            Make Artificial Intelligence Content <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-[#828fff] bg-clip-text text-transparent">
              Truly Human & Untraceable
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed tracking-tight">
            The private, client-first workspace for academics, designers, and developers. 
            Restructure robotic cadence to pass detection algorithms and scrub C2PA synthetic signatures completely free.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/text-humanizer"
              className={cn(buttonVariants({ size: "lg" }), "rounded-md shadow-xs bg-primary hover:bg-[#828fff] text-white font-medium")}
            >
              <SparklesIcon className="size-4 mr-2" />
              Launch Text Humanizer
            </Link>
            <Link
              href="/image-sanitizer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md border-border bg-card hover:bg-secondary text-foreground font-medium")}
            >
              Sanitize Image Traces
              <ArrowRight01Icon className="size-4 ml-2" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield01Icon className="size-4 text-[#27a644]" />
              <span>100% Free Tiers</span>
            </div>
            <div className="flex items-center gap-2">
              <CpuIcon className="size-4 text-primary" />
              <span>Zero Client Data Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckmarkCircle02Icon className="size-4 text-[#27a644]" />
              <span>Turnitin & GPTZero Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Ad Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <AdContainer format="banner" />
      </div>

      {/* Tools Suite Workspace with Category Filter and Compact Grid */}
      <ToolsSuiteSection tools={TOOLS_REGISTRY} />

      {/* Linear Design Specs Architecture Callout / Feature Showcase */}
      <section className="border-t border-border bg-card/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(94,106,210,0.12),transparent_70%)] pointer-events-none" />
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-wider text-primary font-medium">
                SECURITY & INTEGRITY PROTOCOL
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground mt-3">
                Engineered for strict privacy and uncompromised stealth.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Every transformation runs via native WebAssembly and client-side web workers. 
                Your files never touch external storage or model-training pipelines.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div>
                  <div className="font-mono text-lg font-semibold text-foreground">0ms</div>
                  <div className="text-xs text-muted-foreground mt-1">Data retention time</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-semibold text-foreground">100%</div>
                  <div className="text-xs text-muted-foreground mt-1">Client sandbox execution</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-semibold text-foreground">C2PA</div>
                  <div className="text-xs text-muted-foreground mt-1">Full signature scrubbing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <AdContainer format="horizontal" />
      </div>
    </div>
  );
}
