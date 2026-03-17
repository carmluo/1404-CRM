---
name: create-feature
description: Plans the architecture for a new feature or component based on the existing design system and visual language, then implements it in code — seamlessly integrating it into the existing website. Use this skill any time the user wants to add, build, or plan something new in the CRM, even if they phrase it casually ("I want to add...", "what if we had...", "can we build..."). Triggers explicitly on "create a new component", "plan a new feature", "help implement a new component", "help implement a new feature".
---

# Create Feature Skill

## Context to load before starting

Load these files as reference before any planning or implementation:

- `design-system.md` — all token names, hex values, Tailwind class mappings
- `tailwind.config.js` — exact token definitions wired into Tailwind
- `src/components/ui/` — existing atoms and molecules
- `src/components/layout/` — existing layout components
- `src/pages/` — existing pages
- `src/data/mockData.js` — data shape and available fields for all entities
- `src/context/AppContext.jsx` — shared state and data access patterns

---

## Step 1 — Gather requirements

Extract answers from the user's request first. Only ask about what is genuinely missing — do not ask questions the request already answers.

Resolve all of the following before proceeding:

- [ ] **Entry point & navigation** — Where does the user encounter this feature? Which existing screens link to or from it? Does it open inline (slide-out drawer, modal, expanded row) or navigate to a new page?
- [ ] **Data connections** — Which entities does this feature read from or write to? (opportunities, accounts, contacts, activities, documents, estimates)
- [ ] **Interactions & states** — How does the user interact with it? Map the user flow briefly: trigger → action → outcome. List all necessary states: default, loading, empty, error, success.
- [ ] **Success definition** — One sentence: what does "working correctly" mean for a rep using this feature?

  > Example: "A rep can log a follow-up activity from the opportunity card in under 10 seconds without leaving the pipeline view."

If any of the above are unresolved after reading the request, ask the user targeted questions. Play back your understanding of the full request before continuing.

Play a notification sound when waiting for user input:
```bash
afplay /System/Library/Sounds/Blow.aiff
```

---

## Step 2 — Verify before planning

Confirm each gate before generating the implementation plan:

- [ ] Design system loaded — every color, font size, spacing, and radius has a token in `design-system.md`; hardcoded values are not permitted
- [ ] Data available in `mockData.js` — if the feature needs data not yet in mock data, note what needs to be added and where
- [ ] Empty state defined — what does the UI show when there is no data to display?
- [ ] Error state defined — what does the UI show if an action fails or data is unavailable?
- [ ] Reachable — the user can reach this feature from at least one existing page without a dead end
- [ ] No duplicate component — `src/components/ui/` and `src/components/layout/` do not already contain a component that could serve this purpose

---

## Step 3 — Generate implementation plan

Produce a structured plan containing exactly these sections:

1. **Component breakdown** — list every new component needed (atoms → molecules → organisms) and every existing component being reused or extended
2. **Data flow** — what data is read and written, from where, and how it moves through the component tree
3. **File structure** — exact file path for every new or modified file (`src/components/...`, `src/pages/...`, `src/data/...`)
4. **State map** — every UI state with a one-line description of what triggers it (default, loading, empty, error, success, and any feature-specific variants)
5. **Design system usage** — specific token classes and existing components used throughout
6. **Integration points** — exactly where in existing pages, navigation, or `src/App.jsx` routing this feature plugs in, and what lines change

Present the plan to the user and get explicit approval before writing any code.

Play a notification sound when the plan is ready for review:
```bash
afplay /System/Library/Sounds/Blow.aiff
```

---

## Step 4 — Implement

With the plan approved, build in this order:

1. **Add mock data first** — if new data fields or records are needed, add them to `src/data/mockData.js` before building any UI
2. **Smallest to largest** — atoms first, then molecules, then page-level assembly; reuse existing components whenever possible
3. **Tokens only** — no hardcoded hex values, raw pixel sizes, or font weights that have a token equivalent in `design-system.md`
4. **All states** — implement every state from the state map; do not leave empty or error states as stubs
5. **Wire into existing pages** — import and connect per the integration points; update `src/App.jsx` if a new route is needed
6. **Clean up** — remove any unused imports from files that were modified
7. **Confirm success** — verify the one-sentence success definition from Step 1 is met

---

## Output checklist

Before marking the feature complete, verify:

- [ ] All states implemented (default, empty, error, success, and feature-specific variants)
- [ ] All colors use token classes — no raw hex values
- [ ] All typography uses `font-crm` + named size class (`text-body-2`, `text-h5`, etc.)
- [ ] No duplicate component created — existing components reused where possible
- [ ] Mock data is realistic (construction retail figures: deal values $50K–$5M+, accounts like Lowe's / Home Depot / Target)
- [ ] Feature is reachable from at least one existing page
- [ ] Router updated in `src/App.jsx` if a new route was added
- [ ] No unused imports left in any modified file
- [ ] Responsive: no fixed-width overflow at sm/md/lg breakpoints

