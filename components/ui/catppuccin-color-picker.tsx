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
  { name: "Lavender", value: "#b4befe" },
  { name: "Pink", value: "#f5c2e7" },
  { name: "Mauve", value: "#cba6f7" },
  { name: "Peach", value: "#fab387" },
  { name: "Yellow", value: "#f9e2af" },
  { name: "Green", value: "#a6e3a1" },
  { name: "Teal", value: "#94e2d5" },
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
      <div className="flex flex-wrap gap-2">
        {CATPPUCCIN_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all hover:scale-110 ${
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
