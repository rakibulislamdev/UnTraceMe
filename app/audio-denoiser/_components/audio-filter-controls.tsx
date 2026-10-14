"use client";

import React from "react";
import { 
  AiVoiceIcon, 
  WaveIcon, 
  VolumeHighIcon, 
  SparklesIcon 
} from "hugeicons-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { AudioFilterOptions } from "@/lib/audio-engine/audio-filter";

interface AudioFilterControlsProps {
  options: AudioFilterOptions;
  setOptions: React.Dispatch<React.SetStateAction<AudioFilterOptions>>;
  disabled?: boolean;
}

export function AudioFilterControls({
  options,
  setOptions,
  disabled = false,
}: AudioFilterControlsProps) {
  const toggleOption = (key: keyof Omit<AudioFilterOptions, "intensity">) => {
    if (disabled) return;
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filters = [
    {
      id: "metallicNotch" as const,
      label: "Metallic Sheen Notch Filter",
      description: "Suppresses ~3.4kHz metallic resonance common in ElevenLabs and speech synthesis",
      icon: WaveIcon,
      active: options.metallicNotch,
    },
    {
      id: "ultrasonicCutoff" as const,
      label: "Ultrasonic Watermark Truncation",
      description: "Lowpass brickwall at 16.5kHz to eradicate inaudible synthetic tracking pulses",
      icon: AiVoiceIcon,
      active: options.ultrasonicCutoff,
    },
    {
      id: "subBassRumble" as const,
      label: "Sub-Harmonic Rumble Guard",
      description: "80Hz highpass cut to clear unnatural DC offset and synthetic sub-frequencies",
      icon: VolumeHighIcon,
      active: options.subBassRumble,
    },
    {
      id: "analogWarmth" as const,
      label: "Harmonic Analog Warmth",
      description: "Injects gentle human vocal tube saturation to soften robotic harshness",
      icon: SparklesIcon,
      active: options.analogWarmth,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-5">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          DSP Filter Modules
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select frequency treatment algorithms applied to the voice track
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filters.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => toggleOption(item.id)}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all duration-150 select-none cursor-pointer",
                item.active
                  ? "border-primary/40 bg-primary/5 text-foreground shadow-2xs"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold tracking-tight flex items-center justify-between">
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full shrink-0 ml-1.5",
                      item.active ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Intensity Slider */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-medium text-foreground">Harmonization Intensity</span>
          <span className="font-semibold text-primary tabular-nums">
            {options.intensity}%
          </span>
        </div>
        <Slider
          value={[options.intensity]}
          onValueChange={(val) => {
            const num = Array.isArray(val) ? val[0] : val;
            setOptions((prev) => ({ ...prev, intensity: num }));
          }}
          min={10}
          max={100}
          step={5}
          disabled={disabled}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
