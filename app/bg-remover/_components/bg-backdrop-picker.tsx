"use client";

import React from "react";

export const PRESET_COLORS = [
  { name: "Transparent", value: "transparent" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Studio Black", value: "#000000" },
  { name: "Light Gray", value: "#f3f4f6" },
  { name: "Sky Blue", value: "#38bdf8" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
];

interface BgBackdropPickerProps {
  activeBackdrop: string;
  customColor: string;
  onBackdropChange: (value: string) => void;
  onCustomColorChange: (color: string) => void;
}

export function BgBackdropPicker({
  activeBackdrop,
  customColor,
  onBackdropChange,
  onCustomColorChange,
}: BgBackdropPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">Backdrop:</span>
      {PRESET_COLORS.map((color) => {
        const isSelected = activeBackdrop === color.value;
        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onBackdropChange(color.value)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                : "border-border bg-card hover:bg-secondary text-foreground"
            }`}
          >
            {color.value === "transparent" ? (
              <span className="size-3 rounded-full border border-border bg-[conic-gradient(#cbd5e1_90deg,#ffffff_90deg_180deg,#cbd5e1_180deg_270deg,#ffffff_270deg)] dark:bg-[conic-gradient(#475569_90deg,#1e293b_90deg_180deg,#475569_180deg_270deg,#1e293b_270deg)]" />
            ) : (
              <span
                className="size-3 rounded-full border border-border/60"
                style={{ backgroundColor: color.value }}
              />
            )}
            <span>{color.name}</span>
          </button>
        );
      })}

      {/* Custom Color Picker */}
      <label className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${
        activeBackdrop === "custom"
          ? "border-primary bg-primary/10 text-primary font-semibold"
          : "border-border bg-card hover:bg-secondary text-foreground"
      }`}>
        <span
          className="size-3 rounded-full border border-border/60"
          style={{ backgroundColor: customColor }}
        />
        <span>Custom</span>
        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            onCustomColorChange(e.target.value);
            onBackdropChange("custom");
          }}
          className="sr-only"
        />
      </label>
    </div>
  );
}
