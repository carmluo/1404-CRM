# From Figma to Pixel-Perfect Code with AI: What Actually Works

*A real-world account of building a CRM prototype using Figma MCP, Claude Code, and React — including what went wrong and how we fixed it.*

---

## The Goal

Build a fully functional CRM prototype in React that matches Figma designs closely enough to hand off to engineering. Not a rough approximation — pixel-perfect typography, exact colors, correct spacing.

Stack: React 18 + Vite + Tailwind CSS v3 + Framer Motion + Recharts.

---

## Step 1: The Naive Approach — Screenshots

The first instinct is to point an AI at your Figma screens and say "build this." The output looks plausible. Components render. But side by side with the design, things are off — font sizes slightly wrong, spacing eyeballed, colors close but not exact.

**Why:** A screenshot gives the AI pixels, not values. It has to guess that a heading is `18px` when it's actually `22px`. It can't know your color is `#CFE8E0` vs `#D0E8E0`.

---

## Step 2: The Figma MCP Connector

Figma's MCP server exposes a `get_design_context` tool that returns actual React+Tailwind code — with exact values extracted from the design: hex colors, pixel sizes, border radii, spacing.

Setup: connect Claude Code to the Figma MCP server, then pass a node URL from the design file.

```
figma.com/design/:fileKey/:name?node-id=1001-4348
```

**What it returns:** Reference React code with the exact measurements from that frame. Far more accurate than screenshot interpretation.

**The catch:** It's reference code, not production code. It doesn't know your component library, your existing patterns, or that you use `style={{}}` inline props instead of Tailwind classes in some places. The AI adapts it — and that's where drift creeps back in.

---

## Step 3: The Real Problem — No Token Mapping

The deeper issue: Tailwind's built-in scale doesn't map to custom design values.

Your design has `font-size: 18px, line-height: 27px`. Tailwind's closest class is `text-lg` (18px) + `leading-7` (28px). One pixel off, every time. Multiply that across 50 components.

Same with colors. `#2B6B52` gets hardcoded in inline styles all over the codebase because there's no Tailwind class for it. When the design updates to `#326757`, you'd need to hunt through every file.

**The fix: wire your Figma tokens directly into `tailwind.config.js`.**

---

## Step 4: Exporting Tokens from Figma

Figma has two exportable token types:

**Variables** (colors, spacing, radii):
- Variables panel → `···` menu → **Export variables** → JSON

**Text styles:**
- No native export. Use a plugin like "Export Styles to JSON" or "Tokens Studio."

The resulting JSON files have this shape:

```json
// typography.tokens.json
{
  "Font": {
    "Sizes": {
      "Body 2": { "$value": 18 },
      "Heading 5": { "$value": 28 }
    },
    "Line Heights": {
      "Body 2": { "$value": 27 },
      "Heading 5": { "$value": 36.4 }
    }
  }
}

// color.tokens.json
{
  "color": {
    "background": {
      "primary": {
        "default": { "$value": { "hex": "#CFE8E0" } }
      }
    },
    "text": {
      "neutral": {
        "default": { "$value": { "hex": "#232323" } }
      }
    }
  }
}
```

---

## Step 5: Wiring Tokens into Tailwind

Once you have the JSON, give it to Claude and ask it to map each token to a named Tailwind class. The output in `tailwind.config.js`:

```js
fontSize: {
  'h5':     ['28px', { lineHeight: '36px' }],
  'body-2': ['18px', { lineHeight: '27px' }],
  'body-3': ['14px', { lineHeight: '21px' }],
},
colors: {
  surface: {
    DEFAULT: '#F2F2F2',   // background/neutral/surface
    white:   '#FFFFFF',
  },
  brand: {
    DEFAULT: '#CFE8E0',   // background/primary/default
    action:  '#326757',   // background/primary/invert
  },
  content: {
    DEFAULT:  '#232323',  // text/neutral/default
    subtlest: '#565656',  // text/neutral/subtlest
    disabled: '#838383',  // text/neutral/disabled
  },
}
```

Now instead of `style={{ fontSize: 18, color: '#565656' }}` scattered everywhere, you write:

```jsx
<p className="text-body-2 text-content-subtlest">...</p>
```

And it's guaranteed to match Figma exactly. Every time.

---

## Step 6: Backward Compatibility

Changing color tokens mid-project is risky — every existing component uses the old class names. The solution: keep legacy aliases that point to the new Figma values.

```js
// Legacy — keeps existing code working unchanged
primary: {
  text:   '#232323',   // → content.DEFAULT
  action: '#326757',   // → brand.action
},
muted: '#838383',      // → content.disabled
page:  '#F2F2F2',      // → surface.DEFAULT
```

No global find-and-replace needed. Migrate component by component.

---

## Step 7: Document It

With tokens in place, generate a `design-system.md` that acts as the single source of truth:
- Full type scale table with Figma token names and Tailwind classes
- All color tokens grouped by category (surface, border, text, viz)
- Layout constants, radius, shadow values

Any future AI-assisted work references this file first. The AI knows what `text-content-subtlest` means and where it came from.

---

## Step 8: Component-by-Component Replacement

With tokens wired in, the next phase is replacing existing components one at a time using `get_design_context` on individual Figma nodes.

**The workflow:**
1. In Figma desktop, select a single component (not a full screen)
2. Right-click → **Copy link to selection**
3. Paste the URL — `get_design_context` is called immediately
4. The tool returns exact values: border-radius, padding, font weight, color, height
5. A reusable component is written from those values and wired into every page that uses it

**Example: the Filter button**

`get_design_context` on the Filter button node returned:
- Background: `#FFFFFF` (white, no border)
- Border radius: `12px` — the existing code used `rounded-lg` (8px), 4px off
- Height: `40px` with `px-[12px] py-[8px]`
- Font: `14px/21px`, normal weight — existing code had wrong color (`#565656` vs `#414141`)
- 4 variants: label only, label + chevron, icon + label, icon only

A single `FilterButton.jsx` component was written from these values and replaced the inline `<button>` elements across Accounts, Contacts, and Opportunities pages simultaneously.

**Iteration during the session:**
The designer noticed the font weight was wrong (rendered bold, should be regular). Rather than re-reading the spec, the fix was a one-word change: `font-bold` → `font-normal`. The URL was re-sent to confirm — same node, updated values.

**Key insight:** "Copy link to selection" in Figma desktop is the correct trigger for this workflow. It captures the exact node ID of whatever is selected. Re-sending the same URL after editing the component in Figma pulls the latest values.

---

## What Still Requires Manual Attention

Even with perfect token mapping, some things need human judgment:
- **Spacing relationships** between nested components (padding, gaps)
- **Interactive states** — hover, active, focus — which are often implied in Figma but not always explicit
- **Component composition** — how atomic design tokens combine into specific UI patterns
- **Animation** — Framer Motion spring configs need to be tuned by feel, not spec

---

## Key Takeaways

1. **Screenshots are not enough.** Use `get_design_context` from the Figma MCP to get actual values.
2. **`get_design_context` is a starting point, not a finish line.** The AI still adapts code to your project patterns.
3. **The real fix is token mapping.** Export variables from Figma → wire into Tailwind config → use named classes.
4. **Maintain backward compatibility.** Add legacy aliases so you can migrate incrementally.
5. **Document your tokens.** A `design-system.md` gives AI (and humans) a shared reference that makes every subsequent component more accurate.

---

*This process is ongoing. As more of the design system is connected — spacing tokens, component-level tokens, Code Connect mappings — the gap between Figma and code continues to close.*

---

## The figma-component Skill

To make the Figma-to-code workflow repeatable and consistent, a custom Claude skill was added at `.claude/skills/figma-component/SKILL.md`. It is triggered automatically whenever a Figma URL is pasted into the conversation.

### What it does

The skill enforces a strict, step-by-step process every time a component is built:

1. **Load context first** — reads `design-system.md`, `tailwind.config.js`, and existing components before touching Figma. This prevents duplicate components and ensures token mapping is correct.

2. **Fetch from Figma** — calls `get_design_context` with the extracted `fileKey` and `nodeId`. Returns exact pixel values, not screenshot approximations.

3. **Verify completeness** — checks that all values are present (padding, font size, line-height, weight, background color, border radius, icon names, variant states). If anything is missing, it stops and asks for the smaller atom's URL before continuing. Never guesses values.

4. **Analyze states** — looks for Figma variant names (Default, Hover, Selected, etc.) and `data-interaction-annotations` in the response. Derives hover/press states only when an explicit token pair exists in `tailwind.config.js`. If no pair exists for a color, it asks the user before implementing.

5. **Determine output location** — uses atomic design to route the file: reusable UI → `src/components/ui/`, layout → `src/components/layout/`, full page → `src/pages/`. Checks for an existing file with a similar name before creating a new one.

6. **Build the component** — maps every value to the token system. Colors → Tailwind token classes. Typography → `font-crm` + named size class. Animation → Framer Motion with `{ type: 'tween', duration: 0.18, ease: 'easeOut' }` as the default. No spring physics unless explicitly requested.

7. **Responsive adaptation** — applies breakpoints only where overflow is a real risk. Full-width outer wrappers, `grid-cols-1 md:grid-cols-2` collapses, `overflow-x-auto` on tables. Does not add speculative responsive classes.

8. **Wire into consuming pages** — imports the new component into every page that renders the equivalent UI, replaces inline implementations, and removes unused imports.

### Output checklist

Every component goes through this before being marked done:

- All pixel values match Figma exactly
- All colors use token classes, not raw hex
- All interactive states implemented
- Figma annotations implemented as interactions
- No duplicate component created
- Consuming pages updated
- No unused imports left behind
- Responsive: no fixed-width overflow at sm/md/lg breakpoints

### Notifications

The skill plays a system sound (`afplay /System/Library/Sounds/Blow.aiff`) in two situations: when user input is needed (blocked on a missing atom or unknown hover state), and when the output checklist is fully passed.
