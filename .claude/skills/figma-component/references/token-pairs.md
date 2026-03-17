# Explicit Token Interaction Pairs

Only derive hover/press states when the default token has an explicit named counterpart below.
Do NOT infer states for tokens not in this list — ask the user instead.

## Background / Surface

| State    | Default              | Hover                | Press                | Disabled             |
|----------|----------------------|----------------------|----------------------|----------------------|
| Neutral  | `bg-surface`         | `bg-surface-hover`   | `bg-surface-press`   | `bg-surface-disabled`|
| White    | `bg-surface-white`   | `bg-surface-hover`   | `bg-surface-press`   | —                    |
| Invert   | `bg-surface-invert`  | — (ask)              | — (ask)              | —                    |
| Brand    | `bg-brand`           | `bg-brand-hover`     | `bg-brand-press`     | —                    |
| Secondary| `bg-brand-secondary` | `bg-brand-secondary-hover` | `bg-brand-secondary-press` | — |
| Warning  | `bg-warning`         | `bg-warning-hover`   | `bg-warning-press`   | —                    |
| Danger   | `bg-danger`          | `bg-danger-hover`    | `bg-danger-press`    | —                    |
| Safe     | `bg-safe`            | `bg-safe-hover`      | `bg-safe-press`      | —                    |

## Border

| State    | Default                  | Hover                     | Press                     |
|----------|--------------------------|---------------------------|---------------------------|
| Neutral  | `border-border`          | `border-border-hover`     | `border-border-press`     |
| Primary  | `border-border-primary`  | `border-border-primary-hover` | `border-border-primary-press` |
| Secondary| `border-border-secondary`| `border-border-secondary-hover`| `border-border-secondary-press`|
| Warning  | `border-warning-border`  | — (ask)                   | — (ask)                   |
| Danger   | `border-danger-border`   | — (ask)                   | — (ask)                   |

## Text

| Usage       | Class                    | Notes                          |
|-------------|--------------------------|--------------------------------|
| Default     | `text-content`           | `#232323`                      |
| Subtle      | `text-content-subtle`    | `#414141` — most UI labels     |
| Subtlest    | `text-content-subtlest`  | `#565656`                      |
| Disabled    | `text-content-disabled`  | `#838383`                      |
| Inverted    | `text-content-invert`    | `#F2F2F2` — on dark bg         |
| Brand       | `text-content-primary`   | `#326757`                      |

## Active/Selected state pattern

When a component has an active/selected state not covered by tokens above, use:
- Background: `bg-surface-invert` (`#2D2D2D`)
- Text: `text-content-invert` (`#F2F2F2`)
- This matches the nav tab and filter button active pattern already in the codebase.

## No explicit pair — always ask

These tokens have no named hover counterpart and require user input:
- `brand.action` (`#326757`)
- `content.primary` (`#326757`)
- Any `*-bold` text token
- Any `data-visualization` token
