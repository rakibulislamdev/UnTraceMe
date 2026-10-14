import React from "react";
import type { Metadata } from "next";
import { AudioDenoiserClient } from "./_components/audio-denoiser-client";
import { AdContainer } from "@/app/_components/ad-container";
import { AiVoiceIcon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Voice AI Artifact & Metallic Filter | UnTraceMe",
  description:
    "Filter robotic frequency anomalies, metallic phase sheen, and ultrasonic watermarks from AI-generated voice speech.",
  openGraph: {
    title: "Voice AI Artifact & Metallic Filter | UnTraceMe",
    description:
      "Acoustic DSP engine to soften robotic voiceover artifacts and restore natural harmonic balance.",
  },
};

export default function AudioDenoiserPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Eyebrow & Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <AiVoiceIcon className="size-4" />
          <span>Module 04</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Voice AI Artifact Filter & Harmonizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Soften synthetic metallic voiceover sheen, eliminate inaudible ultrasonic watermarks, and restore natural acoustic warmth to AI speech.
        </p>
      </div>

      {/* Top Banner Ad Container */}
      <AdContainer format="banner" className="mb-6" />

      {/* Interactive Client Workspace */}
      <AudioDenoiserClient />

      {/* Server-Rendered Information & SEO Section (Static Server Component) */}
      <section className="mt-14 pt-10 border-t border-border space-y-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            How Voice AI Harmonization Works
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Neural voice synthesis architectures (such as VITS, HiFi-GAN, and Diffusion vocoders) introduce distinct frequency fingerprints. UnTraceMe applies targeted digital signal processing (DSP) to restore natural acoustic balance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
            <h3 className="font-semibold text-foreground">Phase Resonance Suppression</h3>
            <p className="text-muted-foreground leading-relaxed">
              Robotic speech engines frequently peak in the 2.8kHz to 3.8kHz range. Our parametric notch attenuation smooths these metallic harmonics without muffling vocal intelligibility.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
            <h3 className="font-semibold text-foreground">Watermark Truncation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Synthetic speech models often embed inaudible high-frequency pulses above 16kHz for model fingerprinting. A 16.5kHz brickwall lowpass eliminates these tracking payloads completely.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
            <h3 className="font-semibold text-foreground">Harmonic Analog Warmth</h3>
            <p className="text-muted-foreground leading-relaxed">
              Human vocal cords produce natural micro-variations. Gentle soft-clip waveshaping simulates classic studio tube saturation to eliminate artificial digital sterility.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Ad Container */}
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
