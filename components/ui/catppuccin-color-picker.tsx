"use client";

import React from "react";

/**
 * Catppuccin Mocha Color Picker
 * Provides accent colors from the Catppuccin Mocha palette for note/blog/comment backgrounds
 */

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const CATPPUCCIN_COLORS = [
  { name: "Blue", value: "#89b4fa" },
  { name: "Mauve", value: "#cba6f7" },
  { name: "Pink", value: "#f5c2e7" },
  { name: "Peach", value: "#fab387" },
  { name: "Green", value: "#a6e3a1" },
  { name: "Teal", value: "#94e2d5" },
  { name: "Lavender", value: "#b4befe" },
  { name: "Surface0", value: "#313244" }, // Dark background option
];

export default function CatppuccinColorPicker({
  value,
  onChange,
  label = "Background Color",
}: ColorPickerProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-text">
        {label}
      </label>
      <div className="flex gap-4">
        {CATPPUCCIN_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
              value === color.value
                ? "border-blue ring-2 ring-blue ring-offset-2 ring-offset-base"
                : "border-overlay0"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {value === color.value && (
              <span className="text-base font-bold">✓</span>
            )}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-subtext0">
        Selected:{" "}
        {CATPPUCCIN_COLORS.find((c) => c.value === value)?.name || "Custom"}
      </p>
    </div>
  );
}
