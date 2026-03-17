---
name: figma-component
description: Builds pixel-perfect React components and pages from Figma designs using the Figma MCP get_design_context tool. Use this skill when the user pastes a Figma URL, says "create this component", "implement this design", "build this from Figma", or shares a figma.com/design link. Handles atoms, molecules, and full pages following atomic design principles. Reads exact values (colors, spacing, typography, radius) directly from Figma — never from screenshots. Checks for existing components before creating, maps all values to design-system tokens, and auto-derives interaction states only when explicit token pairs exist.
---

# Figma Component Skill

## Context to load before starting

Before reading the Figma node, load these files as reference:
- `design-system.md` — all token names, hex values, Tailwind class mappings
- `tailwind.config.js` — exact token definitions wired into Tailwind
- `src/components/ui/` — existing atoms and molecules
- `src/components/layout/` — existing layout components
- `src/pages/` — existing pages

---

## Step 1 — Fetch from Figma

Extract `fileKey` and `nodeId` from the URL:
```
figma.com/design/:fileKey/:name?node-id=1234-5678
nodeId = "1234:5678" (replace - with :)
```

Call `get_design_context` with:
- `fileKey` and `nodeId` from the URL
- `clientFrameworks: "react"`
- `clientLanguages: "javascript,css"`

---

## Step 2 — Verify completeness

After receiving the response, confirm ALL of the following are present before proceeding:

- [ ] Exact pixel values for padding and gaps (not just layout hints)
- [ ] Font size, line-height, and weight (not inferred from screenshot)
- [ ] Background color with hex value or token reference
- [ ] Border radius in px
- [ ] Icon names and sizes
- [ ] All variant/state names listed (e.g. Default, Hover, Selected, Expanded)

If ANY value is missing or shows as a generic Tailwind class without a token source, DO NOT proceed. Go to Step 3.

If all values are present, skip to Step 4.

---

## Step 3 — Resolve missing atoms

If a nested element's values could not be read (common when child components are not instances of a defined component):

1. Identify which child element is missing detail
2. Tell the user: "I can't read full detail on [element name]. Please select that element in Figma and copy the link, so I can read it first."
3. Run Step 1–2 on the smaller atom
4. Build the atom first, confirm it is complete
5. Return to the original component and re-run Step 1

Always build smallest → largest. Never guess values.

---

## Step 4 — Analyze states and interactions

### Check for Figma variant states
Look for component variants named: Default, Hover, Pressed, Selected, Focused, Disabled, Expanded, Active, Empty

### Check for annotations
Look for `data-interaction-annotations` attributes in the get_design_context output. These describe expected behavior (e.g. "on click expand into date selector"). Implement exactly as described.

### Auto-derive interaction states (strict rule)
Only apply a derived state if the token has an **explicit named pair** in `tailwind.config.js`. Use this lookup table:

| Default token       | Hover token          | Press token          |
|---------------------|----------------------|----------------------|
| `surface.DEFAULT`   | `surface.hover`      | `surface.press`      |
| `surface.white`     | `surface.hover`      | `surface.press`      |
| `brand.DEFAULT`     | `brand.hover`        | `brand.press`        |
| `brand.action`      | — (ask user)         | — (ask user)         |
| `border.DEFAULT`    | `border.hover`       | `border.press`       |
| `warning.DEFAULT`   | `warning.hover`      | `warning.press`      |
| `danger.DEFAULT`    | `danger.hover`       | `danger.press`       |
| `safe.DEFAULT`      | `safe.hover`         | `safe.press`         |

If the default color does NOT appear in this table, ask the user what the hover/active state should be before implementing.

---

## Step 5 — Determine output location

Use atomic design to decide where the file lives:

| Figma layer type | Output path | Rule |
|---|---|---|
| Component / component set | `src/components/ui/ComponentName.jsx` | Reusable atom or molecule |
| Frame used as page section | `src/components/ui/SectionName.jsx` | Composed section, not a full page |
| Top-level page frame | `src/pages/PageName.jsx` | Full page, wired into router |

**Before creating a new file:**
1. Search `src/components/ui/` and `src/components/layout/` for any file with a similar name (case-insensitive, partial match)
2. If a match exists, read it and update it in place rather than creating a duplicate
3. If updating, preserve existing prop API where possible — only add new props, do not remove

---

## Step 6 — Build the component

Map every value from Step 2 to the project's token system:

**Colors** — always use Tailwind token classes from `design-system.md`. Never use raw hex unless the token does not exist, in which case add it to `tailwind.config.js` first.

**Typography** — use `font-crm` + named size class (`text-body-2`, `text-h5` etc.). Never use arbitrary font-size values that match an existing token.

**Spacing** — use Tailwind spacing scale. For values that don't map cleanly, use bracket notation `px-[Xpx]` and add a note.

**Radius** — use `rounded-[12px]`, `rounded-[100px]` etc. matching Figma exactly. Map to `rounded-card` or `rounded-badge` where they match.

**Animation** — use Framer Motion for any transition between states. Default config:
```js
{ type: 'tween', duration: 0.18, ease: 'easeOut' }
```
No spring physics unless the user explicitly requests bounce. Do not add arbitrary delays.

**Icons** — use `lucide-react`. Match icon name from Figma layer name (e.g. `lucide/chevron-down` → `ChevronDown`).

---

## Step 7 — Responsive adaptation

Figma designs are fixed-width. Before writing the final code, assess each element for responsive behavior and apply the following rules using your own judgement:

**Layout containers**
- Full-width sections: use `w-full` — never fixed pixel widths on outer wrappers
- Multi-column grids (`grid-cols-2`, `grid-cols-3`): add a breakpoint to collapse — e.g. `grid-cols-1 md:grid-cols-2`
- Side-by-side flex rows that would overflow narrow screens: add `flex-wrap` or a breakpoint variant

**Text**
- Long labels (`whitespace-nowrap`) inside constrained containers: consider `truncate` or allowing wrap at small sizes
- Fixed font sizes from Figma are correct — do not scale them, but ensure their containers can reflow

**Fixed pixel widths**
- Column widths (e.g. `w-[191px]`): keep fixed only on columns that need it; use `min-w-0` + `truncate` on sibling cells to prevent overflow
- Icon pill sizes, badge sizes, avatar sizes: keep fixed — these are intentional
- Card/panel widths: replace with `w-full` or `max-w-[Xpx] w-full`

**Tables**
- Wrap tables in `overflow-x-auto` so they scroll horizontally rather than breaking layout on narrow viewports

**Navigation**
- Sidebar: already handles collapse/expand — no additional breakpoint needed
- TopNav: if nav links overflow at narrow widths, they should be hidden or collapsed (use judgement based on available space)

**Breakpoints to use** (Tailwind defaults):
- `sm`: 640px — mobile landscape
- `md`: 768px — tablet
- `lg`: 1024px — small desktop (most Figma designs target this width)
- `xl`: 1280px — standard desktop

Apply only the breakpoints that are actually needed. Do not add responsive classes speculatively — only where overflow or layout collapse is a real risk.

Add `- [ ] Responsive: no fixed-width overflow at sm/md/lg breakpoints` to the output checklist before marking done.

---

## Step 8 — Wire into consuming pages

After writing the component file:

1. Search for all pages/components that render the equivalent UI (by feature name or inline element)
2. Import the new component and replace the inline implementation
3. Verify props match — pass required data from the page's existing state/context
4. Remove any now-unused imports from those files

---

## Step 8 — Page assembly (atoms → pages)

When building a **full page** (top-level Figma frame):

1. List all distinct component regions on the page
2. Check which ones already exist as components in `src/components/ui/`
3. For missing components, build them first (Steps 1–7) before assembling the page
4. Assemble the page using existing + new components
5. Wire to React Router in `src/App.jsx` if it's a new route
6. Update `process.md` with a new section documenting the page assembly — this is a significant milestone that warrants a process note

Do not start page assembly until all required component atoms are confirmed built and correct.

---

## Output checklist

Before considering a component done, verify:

- [ ] All pixel values match Figma exactly (no rounded approximations)
- [ ] All colors use token classes, not raw hex
- [ ] All interactive states implemented (hover, active, disabled if present)
- [ ] Annotations from Figma implemented as interactions
- [ ] No duplicate component created — updated existing if one existed
- [ ] Consuming pages updated to use the new component
- [ ] No unused imports left behind
- [ ] Responsive: no fixed-width overflow at sm/md/lg breakpoints

