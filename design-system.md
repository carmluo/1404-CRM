# 1404 CRM — Design System

Sourced directly from Figma variable exports (`typography.tokens.json`, `color.tokens.json`). Use these tokens when building or modifying components to stay pixel-perfect to the designs.

---

## Typography

**Font family:** `Helvetica Neue` (fallback: Helvetica → system sans-serif)
Tailwind class: `font-crm`

### Type Scale

| Figma Token              | Size  | Line Height | Tailwind class   |
|--------------------------|-------|-------------|------------------|
| `Font.Sizes.Heading 1`   | 67px  | 87px        | `text-h1`        |
| `Font.Sizes.Heading 2`   | 54px  | 70px        | `text-h2`        |
| `Font.Sizes.Heading 3`   | 43px  | 56px        | `text-h3`        |
| `Font.Sizes.Heading 4`   | 34px  | 44px        | `text-h4`        |
| `Font.Sizes.Heading 5`   | 28px  | 36px        | `text-h5`        |
| `Font.Sizes.Heading 6`   | 22px  | 29px        | `text-h6`        |
| `Font.Sizes.Body 1`      | 22px  | 33px        | `text-body-1`    |
| `Font.Sizes.Body 2`      | 18px  | 27px        | `text-body-2`    |
| `Font.Sizes.Body 3`      | 14px  | 21px        | `text-body-3`    |

### Font Weights

| Figma Token                  | Value | Note                                      |
|------------------------------|-------|-------------------------------------------|
| `Font.Weights.Regular`       | 400   | Default body weight                       |
| `Font.Weights.Semi Bold`     | 400   | Exports as 400 — verify in Figma (may be 600) |

### Usage
```jsx
<h1 className="font-crm text-h1 text-content">Page Title</h1>
<p  className="font-crm text-body-2 text-content-subtlest">Body copy</p>
<span className="font-crm text-body-3 text-content-disabled">Caption</span>
```

---

## Colors

All tokens sourced from `color.tokens.json` (Figma Variables export).

### Surface / Background — `color/background/*`

| Tailwind class            | Hex                      | Figma token                        |
|---------------------------|--------------------------|------------------------------------|
| `bg-surface`              | `#F2F2F2`                | background/neutral/surface         |
| `bg-surface-white`        | `#FFFFFF`                | background/neutral/white           |
| `bg-surface-elevated`     | `rgba(255,255,255,0.70)` | background/neutral/elevated        |
| `bg-surface-hover`        | `#E5E5E5`                | background/neutral/hovered         |
| `bg-surface-press`        | `#CBCBCB`                | background/neutral/pressed         |
| `bg-surface-disabled`     | `#B3B3B3`                | background/neutral/disabled        |
| `bg-surface-invert`       | `#2D2D2D`                | background/neutral/invert          |
| `bg-brand`                | `#CFE8E0`                | background/primary/default         |
| `bg-brand-hover`          | `#B0D8CD`                | background/primary/hovered         |
| `bg-brand-press`          | `#92C9B9`                | background/primary/pressed         |
| `bg-brand-action`         | `#326757`                | background/primary/invert          |
| `bg-brand-secondary`      | `#EAE7E4`                | background/secondary/default       |
| `bg-warning`              | `#FFF5D8`                | background/warning/default         |
| `bg-danger`               | `#FFEBEB`                | background/danger/default          |
| `bg-safe`                 | `#EBFFD2`                | background/safe/default            |

### Border — `color/border/*`

| Tailwind class            | Hex       | Figma token                        |
|---------------------------|-----------|------------------------------------|
| `border-border`           | `#E5E5E5` | border/neutral/default             |
| `border-border-hover`     | `#CBCBCB` | border/neutral/hovered             |
| `border-border-disabled`  | `#9A9A9A` | border/neutral/disabled            |
| `border-border-primary`   | `#92C9B9` | border/primary/default             |
| `border-border-primary-bold` | `#326757` | border/primary/bold             |
| `border-warning-border`   | `#FFA200` | border/warning/default             |
| `border-danger-border`    | `#FF928D` | border/danger/default              |
| `border-safe-border`      | `#A7E160` | border/safe/default                |

### Text / Content — `color/text/*`

| Tailwind class              | Hex       | Figma token                      |
|-----------------------------|-----------|----------------------------------|
| `text-content`              | `#232323` | text/neutral/default             |
| `text-content-subtle`       | `#414141` | text/neutral/subtle              |
| `text-content-subtlest`     | `#565656` | text/neutral/subtlest            |
| `text-content-disabled`     | `#838383` | text/neutral/disabled            |
| `text-content-invert`       | `#F2F2F2` | text/neutral/invert              |
| `text-content-primary`      | `#326757` | text/primary/default             |
| `text-content-primary-bold` | `#11221D` | text/primary/bold                |
| `text-content-secondary`    | `#8C6740` | text/secondary/default           |
| `text-warning-text`         | `#F16300` | text/warning/default             |
| `text-danger-text`          | `#BE1C17` | text/danger/default              |
| `text-safe-text`            | `#528002` | text/safe/default                |

### Data Visualization — `color/data-visualization/*`

| Tailwind class      | Hex       | Figma token                               |
|---------------------|-----------|-------------------------------------------|
| `bg-viz`            | `#54AB91` | monochromatic-primary/default             |
| `bg-viz-dark`       | `#438974` | monochromatic-primary/dark                |
| `bg-viz-subtle`     | `#92C9B9` | monochromatic-primary/subtle              |
| `bg-viz-subtlest`   | `#B0D8CD` | monochromatic-primary/subtlest            |
| `bg-viz-seq-1`      | `#54AB91` | sequential/1                              |
| `bg-viz-seq-2`      | `#BF63F3` | sequential/2                              |
| `bg-viz-seq-3`      | `#367DE8` | sequential/3                              |
| `bg-viz-seq-4`      | `#EF8E1E` | sequential/4                              |
| `bg-viz-seq-5`      | `#82B535` | sequential/5                              |
| `bg-viz-seq-6`      | `#964AC0` | sequential/6                              |
| `bg-viz-seq-7`      | `#AF8150` | sequential/7                              |

### Legacy Aliases (backward compatible)

These map to the Figma tokens above. Existing code using these classes continues to work.

| Legacy class          | Resolves to (Figma)           |
|-----------------------|-------------------------------|
| `text-primary-text`   | `content.DEFAULT` → `#232323` |
| `text-primary-action` | `brand.action` → `#326757`    |
| `bg-page`             | `surface.DEFAULT` → `#F2F2F2` |
| `bg-card`             | `surface.white` → `#FFFFFF`   |
| `text-muted`          | `content.disabled` → `#838383`|
| `bg-secondary-bg`     | `brand.secondary` → `#EAE7E4` |

---

## Spacing & Radius

| Tailwind class    | Value  | Usage                              |
|-------------------|--------|------------------------------------|
| `rounded-card`    | `8px`  | Cards, panels                      |
| `rounded-badge`   | `4px`  | Badges, small chips                |
| `rounded-full`    | `9999px` | Pill buttons, avatar circles     |
| `rounded-xl`      | `12px` | Nav tabs, sidebar labels           |
| `rounded-2xl`     | `16px` | Modals, drawers                    |

---

## Shadows

| Tailwind class | Value                                                         | Usage         |
|----------------|---------------------------------------------------------------|---------------|
| `shadow-card`  | `0 1px 3px rgba(0,0,0,0.06), -1px 2px 2px rgba(0,0,0,0.03)` | Card surfaces |

---

## Layout Constants

Defined in [src/components/layout/Layout.jsx](src/components/layout/Layout.jsx):

```js
NAV_HEIGHT        = 64   // Top nav height (px)
SIDEBAR_COLLAPSED = 64   // Sidebar icon-only width (px)
SIDEBAR_EXPANDED  = 280  // Sidebar expanded width (px)
```

---

## App-Specific Tokens

Not part of the Figma color system — used for CRM-specific UI states:

### Opportunity Stages
| Class                        | Hex        |
|------------------------------|------------|
| `bg-stage-qualifying`        | `#5BBFA0`  |
| `bg-stage-needsAnalysis`     | `#9C59C5`  |
| `bg-stage-estPrep`           | `#4A8FE0`  |
| `bg-stage-estSubmitted`      | `#F5A623`  |
| `bg-stage-negotiation`       | `#8A9D35`  |
| `bg-stage-verbalCommit`      | `#7B5EA7`  |

### Status & Risk
| Class                  | Hex        |
|------------------------|------------|
| `text-status-won`      | `#16A34A`  |
| `text-status-lost`     | `#DC2626`  |
| `text-status-pending`  | `#D97706`  |
| `text-risk-overdue`    | `#EF4444`  |
| `text-risk-noActivity` | `#9CA3AF`  |
