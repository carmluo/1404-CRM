# Figma Prototype Interaction Instructions for Construction CRM

## Project Overview
You are adding interactions to a construction sales CRM designed for retail rollout projects. The static screens are complete with an established design system. Your goal is to create a high-fidelity, clickable prototype that preserves the exact visual design while adding realistic interactions for user testing.

## Core Principles
1. **Preserve visual design 100%** - Do not modify any existing layouts, colors, typography, spacing, or component designs
2. **Use existing design system components** - All interactive elements already exist in the design; link them, don't recreate them
3. **Create realistic interactions** - Prototype should feel like a real application, not a clickthrough mockup
4. **Maintain data consistency** - When a user acts on "Lowe's Kitchen Remodel", that same opportunity should appear across all related screens
5. **Support primary user flows** - Focus on sales rep daily workflows (not exhaustive edge cases)

---

## Primary User Flows to Prototype

### Flow 1: Dashboard → Kanban → Opportunity Detail (Most Critical)
**Trigger:** User clicks the 'Qualifying' data bar in the Pipeline Breakdown module on the dashboard

**Interactions:**
1. Dashboard loads with all modules visible
2. Click the 'Qualifying' bar in the Pipeline Breakdown module → Navigates to the Kanban board with the Qualifying stage in view
3. Click any opportunity card on the Kanban board → Opens opportunity side panel (slide-in from right, 40% width)
4. In side panel: Click "View details" → Navigates to full opportunity detail page
5. On detail page: Click back arrow or "X" → Returns to Kanban board
6. On detail page: Switch between tabs (Activities, Documents, Estimates, Emails) → Content area updates, right sidebar (Bidding panel) persists

**Key States:**
- Dashboard: Default view
- Kanban board: Default view (arrived via Pipeline Breakdown click)
- Side panel: Open state (overlay on Kanban board)
- Detail page: Activities tab (default)
- Detail page: Documents tab
- Detail page: Estimates tab
- Detail page: Emails tab

---

### Flow 2: Kanban Pipeline Navigation
**Trigger:** User clicks "Opportunities" in main navigation

**Interactions:**
1. Kanban board displays with 6 stages (Qualifying → Verbal Commit)
2. Hover over stage column → Show count tooltip: "X deals, $X total value"
3. Click opportunity card → Opens side panel
4. In side panel: 
   - Click checkboxes on tasks → Task moves to "Completed" section
   - Click "Schedule follow-up" button → Shows date picker overlay
   - Click email icon next to contact name → Opens email composer (new overlay)
5. Drag card between stages → Card moves to new stage, counts update, system shows toast notification "Stage updated to [New Stage]"
6. Click "+ Create Opportunity" →  Opens create opportunity modal

**Key States:**
- Kanban: Default view (all stages visible)
- Kanban: Card hover state
- Kanban: Card being dragged
- Kanban: Side panel open
- Kanban: Create modal open

---

### Flow 3: Search & Filter
**Trigger:** User types in search bar or applies filters

**Interactions:**
1. Click search bar → Cursor appears, placeholder text dims
2. Type "at risk deals" → Dropdown shows:
   - Suggested searches (with icons)
   - Recent searches
3. Press Enter or click suggestion → Kanban filters to show only at-risk deals, filter chips appear below search
4. Click filter chip "X" → Removes filter, kanban returns to all deals
5. Click "More filters" dropdown → Reveals filter panel with multiple options
6. Select filters (Account: Lowe's, Close date: Next 30 days) → Apply filters → Kanban updates, shows "Showing X of Y deals"

**Key States:**
- Search: Empty state
- Search: Active/focused state  
- Search: Dropdown open with suggestions
- Search: Results filtered (with active filter chips)
- Filters: Panel expanded
- Filters: Applied state

---

### Flow 4: Account Detail Navigation
**Trigger:** User clicks "Accounts" in navigation

**Interactions:**
1. Accounts list view displays
2. Click "Target" account → Navigates to Target account detail page
3. On account page, "Opportunities" tab is active by default
4. Click opportunity in "Active" section → Opens opportunity side panel (same behavior as dashboard)
5. Click "Estimates" tab → Shows estimates table
6. Click "Contacts" section on right sidebar → Shows contact list
7. Click contact name (e.g., "Mike Johnson") → Opens contact detail modal/panel

**Key States:**
- Accounts list view
- Account detail: Opportunities tab (default)
- Account detail: Estimates tab
- Account detail: Activities tab
- Account detail: Notes tab
- Contact detail modal: Open

---

### Flow 5: Task Management (Activities Tab)
**Trigger:** User is on opportunity detail page, Activities tab

**Interactions:**
1. Type in "Add new task" field → Input becomes active
2. Click "Add" button → Task appears in "Upcoming" section
3. Click checkbox next to task → Task moves to "Completed (3)" section with timestamp
4. Click ✓ button next to overdue task → Checkmark fills in, task completes
5. Click ✕ button next to task → Shows delete confirmation: "Delete this task?" with [Cancel] [Delete]
6. Click 🔔 bell icon → Shows reminder dropdown: "Remind me: In 1 hour, Tomorrow, In 3 days..."
7. Click task text → Expands to show full details (if collapsed)

**Key States:**
- Task input: Empty
- Task input: Active/typing
- Task: Default
- Task: Completed (with strikethrough)
- Task: Delete confirmation showing
- Task: Reminder dropdown open

---

### Flow 6: Multi-GC Bidding Workflow
**Trigger:** User views opportunity with 3 GC bidders

**Interactions:**
1. On opportunity detail, Bidding section shows 3 GCs with different statuses:
   - DPR Construction: Accepted (green)
   - ABC Construction: Lost (red)
   - BER Construction: Pending (yellow/orange)
2. Click on GC row → Expands to show estimate details
3. Click "View estimate" → Navigates to Estimates tab with that specific estimate highlighted
4. On Estimates tab: Click estimate row action menu (⋮) → Shows dropdown: "Download, Edit, Mark as Accepted, Delete"
5. Select "Mark as Accepted" → Status badge updates to green "Accepted", Bidding table in sidebar also updates

**Key States:**
- Bidding table: Default (collapsed rows)
- Bidding table: Row expanded
- Estimates tab: Default
- Estimates tab: Estimate action menu open
- Estimates tab: Status updated (with success toast)

---

### Flow 7: AI Contact Suggestions
**Trigger:** User is on Account detail page (Target)

**Interactions:**
1. "Contacts" section shows "3 contacts" with "🤖 5 suggested contacts" link
2. Click "5 suggested contacts" → Opens AI suggestions panel (slide-in from right or modal)
3. Panel shows list of suggested contacts with reasons ("Seniority", "New hire", etc.)
4. Hover over reason badge → Tooltip shows brief explanation
5. Click "Learn more" on a suggested contact → Expands card to show full context, data sources, suggested approach
6. Click ✓ checkmark → Contact added, shows success toast "Janet Rodriguez added to contacts", count updates to "4 contacts"
7. Click ✕ dismiss → Contact removed from suggestions, count updates to "🤖 4 suggested contacts"

**Key States:**
- Contacts section: Default (showing count with suggestions badge)
- AI suggestions panel: Closed
- AI suggestions panel: Open
- Suggested contact card: Collapsed
- Suggested contact card: Expanded
- Contact added: Success state

---

## Navigation & Global Interactions

### Top Navigation Bar
**Interactions:**
1. Click logo (top left) → Returns to Dashboard
2. Click "Dashboard" → Navigates to Dashboard
3. Click "Opportunities" → Navigates to Kanban view
4. Click "Accounts" → Navigates to Accounts list
5. Click "Contacts" → Navigates to Contacts list
6. Click date range picker → Opens calendar dropdown
7. Click user avatar (top right) → Opens user menu: Profile, Settings, Logout

### Left Sidebar Navigation (if present)
**Interactions:**
1. Hover over nav item → Background color change
2. Click nav item → Navigates to respective page, nav item becomes "active" state
3. Active state persists (highlighted/different color)

### Common Interactive Elements
**Buttons:**
- Hover: Background color change, cursor pointer
- Click: Scale down slightly (0.98), then execute action

**Form Inputs:**
- Click: Border color change, cursor appears
- Focus: Border remains highlighted color
- Type: Text appears character by character

**Dropdowns:**
- Click trigger → Dropdown panel appears below/above
- Click option → Dropdown closes, selected value appears in trigger
- Click outside dropdown → Dropdown closes

**Modals/Overlays:**
- Open: Fade in (200ms), background dimmed with overlay
- Close via X button: Fade out (200ms)
- Close via outside click: Fade out (200ms)
- Close via Esc key: Fade out (200ms)

**Toasts/Notifications:**
- Appear: Slide in from top-right (300ms)
- Auto-dismiss: After 4 seconds, slide out
- Manual dismiss: Click X, slide out immediately

---

## Interaction Details & Animations

### Timing
- **Fast interactions** (100-200ms): Hover states, button clicks, checkboxes
- **Medium interactions** (200-300ms): Dropdowns opening, modals appearing, panel slides
- **Slow interactions** (300-500ms): Page transitions, large content loads

### Easing
- **Default:** Ease-in-out (smooth, natural)
- **Panels sliding in:** Ease-out (decelerates at end)
- **Panels sliding out:** Ease-in (accelerates at start)
- **Buttons:** Ease-in-out (bouncy feel)

### Specific Animation Types

**Side Panel (Opportunity Detail)**
- Open: Slide from right, 300ms, ease-out
- Background overlay: Fade in, 200ms
- Close: Slide to right, 300ms, ease-in
- Background overlay: Fade out, 200ms

**Kanban Card Drag**
- On drag start: Card lifts (shadow increases), opacity 0.9
- While dragging: Card follows cursor
- On drop: Card settles into new position with slight bounce
- Invalid drop: Card returns to original position with ease-in-out

**Filter Application**
- Filter selected: Immediate visual check/highlight
- Content update: Fade out old content (100ms) → Fade in filtered content (200ms)
- Filter chip appears: Slide in from left (150ms)

**Task Completion**
- Checkbox click: Checkmark appears instantly
- Task text: Strikethrough animates left-to-right (300ms)
- Task moves: Slide down to "Completed" section (400ms, ease-in-out)

**Dropdown Menus**
- Open: Expand from trigger point, 200ms, ease-out
- Close: Collapse to trigger point, 150ms, ease-in

---

## Data Consistency Rules

### Opportunity "Lowe's Rural Kitchens — Store #1842"
This opportunity should appear consistently across:
- Dashboard: "Overdue follow-ups" module ($49,000 amount)
- Dashboard: "Recent Opportunities" list
- Dashboard: "At-risk" widget
- Opportunities Kanban: In multiple stage columns (depending on which screen variant)
- Account Detail (Lowe's): Active opportunities section
- Search results: When searching "Lowe's" or "Store #1842"

**Fields that must match:**
- Contact: John Davis (or John D.)
- Amount: $390,000 (not $49,000 - there's an inconsistency in the designs, use $390,000)
- Close date: March 5, 2026
- Account: Lowe's
- Project name: Rural Kitchens — Store #1842

### Contact "Mike Johnson"
Appears in:
- Target account contacts
- Multiple Target opportunities (Store #8912, #9032)
- ABC Renovation opportunity (as ABC Construction GC contact)

**Fields that must match:**
- Title: Head of Marketing (at Target) or listed with company name when GC contact
- Location: Sunnyvale, CA (for Target), varies for GC roles

### Account "Target"
- Annual revenue: $106.6B
- Industry: Consumer staples, Retail
- Status: Active
- Type: Prospect
- Address: 1000 Nicollet Mall, Minneapolis, MN

---

## States & Variants to Include

### Dashboard
- **Default state:** All modules visible, no filters applied
- **Filtered state:** After clicking alert or applying filter (show filter chips, updated counts)
- **Loading state:** Skeleton screens for slow connections (optional but nice)

### Opportunities Kanban
- **Default state:** All cards visible across stages
- **Filtered state:** Subset of cards visible, filter chips showing
- **Empty stage:** At least one stage should show empty state: "No deals in this stage"
- **Card hover:** Subtle shadow/elevation increase
- **Dragging state:** Card being moved, drop zones highlighted

### Opportunity Detail (Side Panel & Full Page)
- **Side panel:** Compact view, limited information
- **Full page:** Complete view with tabs
- **Tab variants:** Show content for each tab (Activities, Documents, Estimates, Emails)
- **Task states:** Upcoming, overdue, completed
- **Bidding states:** Show different GC statuses (Accepted, Lost, Pending)

### Account Detail
- **Opportunities tab:** Active section expanded, History section collapsed
- **Estimates tab:** Table view of estimates
- **Activities tab:** Activity timeline
- **Notes tab:** Notes text area
- **Empty states:** Show at least one tab with no content (e.g., "No estimates yet")

### Modals & Overlays
- **Create Opportunity modal:** Form with required fields
- **Contact detail modal:** Contact information display
- **AI Suggestions panel:** List of suggested contacts with expand/collapse
- **Delete confirmation:** "Are you sure?" dialog
- **Date picker:** Calendar overlay

### Interactive Components
- **Checkboxes:** Unchecked, checked, indeterminate (for "select all")
- **Buttons:** Default, hover, active/pressed, disabled, loading (spinner)
- **Inputs:** Empty, focused, filled, error state
- **Dropdowns:** Closed, open, option selected
- **Status badges:** Won, Lost, Pending, Accepted, Drafted (color-coded)
- **Tags/chips:** Default, removable (with X icon), active/selected

---

## Edge Cases to Handle (Optional but Recommended)

### Empty States
- **Dashboard - No overdue tasks:** Show "Great work! No overdue follow-ups" message
- **Kanban - Empty stage:** "No deals in [Stage Name]" with visual
- **Account - No opportunities:** "No opportunities yet. [+ Create Opportunity]"
- **Search - No results:** "No results for '[query]'. Try different keywords or filters."

### Error States
- **Form validation:** Show error message under field: "This field is required"
- **Network error:** "Unable to load. [Retry]" message in place of content
- **Delete confirmation:** Prevent accidental deletions

### Loading States
- **Page load:** Skeleton screens for tables/lists (gray animated blocks)
- **Button loading:** Button shows spinner, text says "Loading..." or "Saving..."
- **Inline loading:** Small spinner next to content being updated

---

## Smart Component Overrides

**Use variants effectively:**
- Buttons: Default, Hover, Active, Disabled, Loading variants
- Form inputs: Empty, Focused, Filled, Error variants
- Cards: Default, Hover, Selected variants
- Status badges: Won, Lost, Pending, etc. (color variants)

**Component swapping:**
- When task is completed, swap unchecked checkbox component with checked variant
- When filter is applied, swap default kanban frame with filtered variant
- When status changes, swap status badge component with appropriate variant

---

## Prototype Settings in Figma

### Starting Frame
- Set "Dashboard" as prototype starting point
- Device: Desktop (1440x900 or actual design width)
- Background: None or light gray (match your design)

### Prototype Flows
Create named flows for user testing:
1. **Flow: "Daily check-in"** → Dashboard → Overdue tasks → Complete task
2. **Flow: "Review opportunity"** → Dashboard → Opportunity card → Detail page → Review estimates
3. **Flow: "Update deal stage"** → Kanban → Drag card → New stage
4. **Flow: "Add contact"** → Account page → AI suggestions → Add contact
5. **Flow: "Search for deals"** → Search bar → Filter → View results

### Interaction Triggers
- **On Click:** Most common (buttons, links, cards)
- **On Drag:** For kanban card movement
- **On Hover:** For tooltips, card elevations, button states
- **After Delay:** For auto-dismiss toasts (4000ms delay)
- **Key/Gamepad:** (Optional) For keyboard shortcuts like Esc to close modals

### Interaction Types
- **Navigate to:** For page transitions (Dashboard → Opportunities)
- **Open Overlay:** For modals, side panels, dropdowns
- **Close Overlay:** For X buttons, outside clicks, Esc key
- **Swap Component:** For state changes (checkbox unchecked → checked)
- **Change to:** For tab switching (Activities → Documents)
- **Scroll to:** For jumping to sections
- **Back:** For return navigation

### Overflow Behavior
- **Vertical scrolling:** Enable for long content (activity timelines, opportunity lists)
- **Horizontal scrolling:** Generally disable (ensure all content fits)
- **Fixed elements:** Top navigation, sidebar should remain fixed on scroll

---

## Testing Checklist

Before sharing prototype, verify:

✅ **Navigation works:**
- Logo returns to Dashboard
- Main nav items go to correct pages
- Back buttons return to previous screen
- Tab switching works on detail pages

✅ **Interactions feel natural:**
- Hover states appear on interactive elements
- Buttons depress on click
- Animations are smooth (not too fast/slow)
- Overlays dim background appropriately

✅ **Data is consistent:**
- Same opportunity shows same details everywhere
- Contact names match across screens
- Dollar amounts are consistent
- Dates are realistic and match

✅ **States are complete:**
- All buttons have hover states
- All forms have focused states
- All tabs show content when clicked
- Empty states display when appropriate

✅ **Core flows work end-to-end:**
- Can complete a task from dashboard
- Can view opportunity details from multiple entry points
- Can navigate through tabs and return to kanban
- Can apply filters and clear them

✅ **Mobile considerations** (if applicable):
- Responsive breakpoints trigger correctly
- Touch targets are appropriate size
- Scrolling works on mobile frames

---

## Common Figma Prototype Mistakes to Avoid

❌ **Don't:** Create separate frames for every tiny state change
✅ **Do:** Use component variants and swapping

❌ **Don't:** Make every text field editable/typeable (complex, breaks easily)
✅ **Do:** Show filled vs. empty states as frame variants, advance on click

❌ **Don't:** Create "fake" components that look different from design system
✅ **Do:** Use actual design system components with variant switching

❌ **Don't:** Link every frame to every other frame (prototype spaghetti)
✅ **Do:** Create clear, linear flows for testing specific scenarios

❌ **Don't:** Use "Smart Animate" excessively (can feel glitchy)
✅ **Do:** Use Smart Animate selectively for smooth transitions (panels, tabs)

❌ **Don't:** Forget about return/back navigation
✅ **Do:** Ensure users can navigate backwards logically

❌ **Don't:** Prototype edge cases that distract from primary flows
✅ **Do:** Focus on 5-7 core user flows, perfect those first

---

## Deliverable Expectations

**What you should produce:**
1. **Clickable prototype** starting from Dashboard
2. **5-7 named flows** for user testing scenarios
3. **Consistent interactions** that feel like a real application
4. **Realistic content** that matches across all screens
5. **Complete states** for buttons, forms, and interactive elements

**What to share with user testing team:**
- Figma prototype link (view-only, comment access)
- List of testable flows with brief descriptions
- Any known limitations (e.g., "Search is simulated, doesn't actually filter")
- Instructions for starting point and main navigation

**Testing-ready means:**
- Users can click through primary workflows without dead ends
- Interactions feel intuitive and responsive
- Visual design remains pixel-perfect
- No broken links or missing screens in primary flows

---

## Example Interaction Specifications

### Dashboard → Kanban → Opportunity Side Panel

**Step 1 — Dashboard to Kanban**
**Trigger:** Click the 'Qualifying' bar in the Pipeline Breakdown module

**Interaction Details:**
```
Source: 'Qualifying' bar in Pipeline Breakdown module on Dashboard
Destination: Kanban board frame (Qualifying stage in view)
Interaction: On Click
Animation: Navigate To
Transition: Instant or dissolve (100ms)
```

**Step 2 — Kanban card to Side Panel**
**Trigger:** Click any opportunity card on the Kanban board

**Interaction Details:**
```
Source: Any opportunity card on the Kanban board
Destination: Opportunity side panel frame
Interaction: On Click
Animation: Move In (from Right)
Duration: 300ms
Easing: Ease Out
Overlay: Dim background (Black 40% opacity)
Close triggers:
  - Click X button
  - Click outside panel (on dimmed background)
  - Press Esc key
```

### Kanban Card Drag

**Trigger:** Drag opportunity card

**Interaction Details:**
```
Source: Opportunity card in "Estimate Prep" column
Destination: "Estimate Submitted" column
Interaction: On Drag
Animation: Move (follow cursor)
While Dragging: 
  - Card shadow increases
  - Card opacity 90%
  - Drop zones highlight (subtle border or bg color)
On Drop:
  - Card settles into new position
  - Column counts update (+1 destination, -1 source)
  - Toast appears: "Stage updated to Estimate Submitted"
Invalid Drop:
  - Card returns to origin with bounce
```

### Task Completion

**Trigger:** Click checkbox next to task

**Interaction Details:**
```
Source: Checkbox component (unchecked variant)
Destination: Checkbox component (checked variant)
Interaction: On Click
Animation: Swap Component (instant or 100ms)
Additional changes:
  - Task text gets strikethrough (Change to variant)
  - Task slides to "Completed" section (Move, 400ms, ease-in-out)
  - Completed count updates: "Completed (3)" → "Completed (4)"
```

### Filter Application

**Trigger:** Select filter option from dropdown

**Interaction Details:**
```
Source: Filter dropdown option "Account: Lowe's"
Step 1: Close dropdown
  - Animation: Collapse, 150ms, ease-in
Step 2: Apply filter
  - Kanban content fades out (100ms)
  - Swap to filtered kanban frame variant
  - Kanban content fades in (200ms)
Step 3: Show filter chip
  - Chip slides in from left (150ms)
  - Shows "Lowe's ✕"
Step 4: Update counts
  - Change text: "38 deals" → "8 deals matching filters"
```

---

## Final Notes

**Prioritize realism over completeness:**
- It's better to have 5 polished, realistic flows than 20 half-working interactions
- Users should feel like they're testing a real application
- Broken links and dead ends destroy testing credibility

**Preserve the design:**
- Your design system is complete and beautiful
- Do not modify layouts, colors, spacing, or typography
- All visual changes should happen via existing component variants

**Test before sharing:**
- Click through every flow yourself
- Have a colleague try it without explanation
- Fix obvious issues before user testing begins

**Document limitations:**
- Be clear about what's simulated vs. real
- Note any workarounds testers need to know
- Provide context for prototype-specific constraints

Good luck! This CRM design is excellent and deserves a high-quality prototype that does it justice.
