# Catppuccin Mocha Color Reference

## Quick Reference Guide for Developers

### Common Usage Patterns

#### Backgrounds

```tsx
// Main page background
className = "bg-base";

// Card/panel backgrounds
className = "bg-surface0";

// Hover state
className = "hover:bg-surface1";

// Active/pressed state
className = "active:bg-surface2";
```

#### Text

```tsx
// Primary text (body, headings)
className = "text-text";

// Secondary text (descriptions, metadata)
className = "text-subtext1";

// Tertiary text (helper text, timestamps)
className = "text-subtext0";

// Timestamps specifically
className = "font-mono text-subtext0";
```

#### Borders

```tsx
// Default borders
className = "border border-overlay0";

// Dividers
className = "border-t border-overlay0";
```

#### Buttons

```tsx
// Primary action
className = "bg-blue hover:bg-blue/90";

// Secondary action
className = "bg-surface0 hover:bg-surface1";

// Danger action
className = "bg-red hover:bg-red/90";
```

#### Alerts

```tsx
// Error/warning
className = "bg-red/10 text-red border border-red";

// Success
className = "bg-green/10 text-green border border-green";

// Info
className = "bg-blue/10 text-blue border border-blue";
```

#### Form Elements

```tsx
// Input/textarea
className = "bg-surface0 border-overlay0 text-text placeholder:text-subtext0";

// Checkbox
className = "accent-blue";

// Label
className = "text-sm font-medium text-text";
```

#### Badges

```tsx
// Primary badge
className = "bg-mauve/20 text-mauve";

// With different colors
className = "bg-blue/20 text-blue";
className = "bg-pink/20 text-pink";
className = "bg-green/20 text-green";
```

### Accent Colors by Use Case

#### 🔹 Blue (#89b4fa)

- Primary buttons
- Links
- Active states
- Default note/blog/comment color

#### 💜 Mauve (#cba6f7)

- Primary badges
- Special highlights

#### 🌸 Pink (#f5c2e7)

- Alternative accents
- Decorative elements

#### 🔴 Red (#f38ba8)

- Danger buttons
- Error messages
- Heart reactions
- Delete actions

#### 🍑 Peach (#fab387)

- Warning states
- Alternative accents

#### ⭐ Yellow (#f9e2af)

- Star reactions
- Highlights

#### 💚 Green (#a6e3a1)

- Success messages
- Positive actions

#### 🌊 Teal (#94e2d5)

- Alternative accents
- Info states

#### 💙 Lavender (#b4befe)

- Subtle highlights
- Alternative accents

### Color Opacity Patterns

#### 10% Opacity (Subtle backgrounds)

```tsx
bg - blue / 10; // Very subtle blue tint
bg - red / 10; // Subtle red for errors
bg - green / 10; // Subtle green for success
```

#### 20% Opacity (Badges, pills)

```tsx
bg - mauve / 20; // Badge backgrounds
bg - blue / 20; // Active state backgrounds
```

#### 90% Opacity (Hover states)

```tsx
bg - blue / 90; // Slightly dimmed on hover
hover: bg - red / 90;
```

### Font Usage

#### Inter (Default)

```tsx
// Automatic - no class needed
<h1>Heading</h1>
<p>Body text</p>
```

#### JetBrains Mono (Monospace)

```tsx
// Use font-mono class
<span className="font-mono">2024-01-15</span>
<code className="font-mono">const code = true;</code>
<time className="font-mono text-subtext0">3 hours ago</time>
```

### Semantic Color Mappings

| Tailwind Class    | Maps To  | Hex Value | Usage            |
| ----------------- | -------- | --------- | ---------------- |
| `bg-background`   | base     | #1e1e2e   | Page backgrounds |
| `text-foreground` | text     | #cdd6f4   | Primary text     |
| `bg-card`         | surface0 | #313244   | Cards, panels    |
| `bg-primary`      | blue     | #89b4fa   | Primary actions  |
| `bg-destructive`  | red      | #f38ba8   | Danger actions   |
| `text-muted`      | subtext0 | #a6adc8   | Muted text       |
| `border-border`   | overlay0 | #6c7086   | Borders          |

### Component-Specific Patterns

#### Note/Blog Cards

```tsx
<div className="bg-surface0 border border-overlay0 rounded-lg">
  <h3 className="text-text font-semibold">Title</h3>
  <p className="text-subtext1">Description</p>
  <time className="font-mono text-subtext0">2024-01-15</time>
</div>
```

#### Filter Buttons

```tsx
<button
  className={
    isActive
      ? "bg-blue text-base"
      : "bg-surface1 text-subtext1 hover:bg-surface2"
  }
>
  Filter
</button>
```

#### Empty States

```tsx
<div className="text-center py-12">
  <p className="text-subtext0 text-lg">No items yet...</p>
</div>
```

### Dark Theme Best Practices

1. **Text Contrast**: Always use text-text for primary content
2. **Hierarchy**: Use subtext1 → subtext0 for decreasing importance
3. **Subtle Backgrounds**: Use 10% opacity for alert backgrounds
4. **Borders**: overlay0 provides subtle separation without harsh lines
5. **Timestamps**: Always use font-mono with text-subtext0
6. **Hover States**: Use surface1 for subtle hovers, surface2 for pressed
7. **Focus Rings**: Use ring-blue for focus indicators

### Color Contrast Ratios

All color combinations meet WCAG AA standards for accessibility:

- text (#cdd6f4) on base (#1e1e2e): 11.6:1 ✅
- subtext1 (#bac2de) on base: 9.4:1 ✅
- subtext0 (#a6adc8) on base: 7.3:1 ✅
- blue (#89b4fa) on base: 8.2:1 ✅

---

**Pro Tip**: When in doubt, check existing components for patterns! The theme is now consistent across the entire app.
