import React from "react";
import Link from "next/link";
import { TOOLS_REGISTRY } from "@/config/tools-registry";
import { ToolCard } from "./_components/tool-card";
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
      {/* Hero Section — Asymmetric, Linear/Raycast style craft */}
      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20 border-b border-border bg-gradient-to-b from-background via-background to-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground border border-border mb-8 shadow-sm">
            <SparklesIcon className="size-3.5 -mt-px text-primary" />
            <span>Anti-AI Detection & Metadata Scrubbing Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.12]">
            Make Artificial Intelligence Content <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
              Truly Human & Untraceable
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The private, client-first workspace for academics, designers, and developers. 
            Restructure robotic cadence to pass detection algorithms and scrub C2PA synthetic signatures completely free.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/text-humanizer"
              className={cn(buttonVariants({ size: "lg" }), "rounded-md shadow-sm")}
            >
              <SparklesIcon className="size-4 mr-2" />
              Launch Text Humanizer
            </Link>
            <Link
              href="/image-sanitizer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md")}
            >
              Sanitize Image Traces
              <ArrowRight01Icon className="size-4 ml-2" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-border/60 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield01Icon className="size-4 text-emerald-500" />
              <span>100% Free Tiers</span>
            </div>
            <div className="flex items-center gap-2">
              <CpuIcon className="size-4 text-primary" />
              <span>Zero Client Data Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckmarkCircle02Icon className="size-4 text-emerald-500" />
              <span>Turnitin & GPTZero Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Ad Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AdContainer format="banner" />
      </div>

      {/* Tools Suite Workspace Grid (Section 11) */}
      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border">
          <div>
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Available Modules
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-1">
              Select an Anti-Detection Engine
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
            No signup or credit card required
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS_REGISTRY.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Bottom Ad Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
        <AdContainer format="horizontal" />
      </div>
    </div>
  );
}
