# 1404 CRM — Frontend

React frontend for a B2B sales CRM. Manages accounts, opportunities, contacts, estimates, notes, and documents. Currently ships with 100% mock data — designed to be swapped with a real backend API.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 |
| Bundler | Vite |
| Styling | Tailwind CSS (custom design token system) |
| Routing | React Router v6 (HashRouter) |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build locally
npm run deploy     # publish to GitHub Pages
```

---

## Project Structure

```
src/
├── App.jsx                      # Route definitions
├── main.jsx                     # Entry point (HashRouter wrapper)
├── index.css                    # Global styles
│
├── data/
│   └── mockData.js              # ← REPLACE with API calls (see Backend Integration)
│
├── context/
│   └── AppContext.jsx           # Global state + all data mutations (the integration surface)
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Opportunities.jsx
│   ├── OpportunityDetail.jsx
│   ├── Accounts.jsx
│   ├── AccountDetail.jsx
│   ├── Contacts.jsx
│   └── ContactDetail.jsx
│
├── components/
│   ├── layout/
│   │   ├── Layout.jsx           # Main shell (sidebar + topnav + outlet)
│   │   ├── Sidebar.jsx
│   │   └── TopNav.jsx
│   └── ui/                      # 50+ presentational components
│
└── utils/
    └── nlSearch.js              # Natural language search helper
```

**Key config files:**

- `tailwind.config.js` — full design token system (colors, typography, spacing, radius)
- `design-system.md` — human-readable reference for all Figma design tokens
- `vite.config.js` — base path set to `/1404-CRM` for GitHub Pages; change as needed

---

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/opportunities` | Opportunity list |
| `/opportunities/:id` | Opportunity detail |
| `/accounts` | Account list |
| `/accounts/:id` | Account detail |
| `/contacts` | Contact list |
| `/contacts/:id` | Contact detail |

---

## Backend Integration Guide

### 1. Where the mock data lives

All seed data is in `src/data/mockData.js`. It exports:
- `accounts` — array of Account objects
- `opportunities` — array of Opportunity objects (each embeds notes, estimates, documents, activities)
- `contacts` — array of Contact objects (also embedded inside accounts)

`AppContext.jsx` imports these as initial state. **Replace these imports with `fetch`/`axios` calls** to hydrate state from your API on mount.

### 2. Data models

#### Account
```js
{
  id: 'acc-1',                  // string
  name: "Lowe's",               // string
  annualRevenue: 105000000000,  // number (dollars)
  status: 'Active',             // 'Active' | 'Inactive'
  type: 'Customer',             // 'Customer' | 'Prospect'
  industry: 'Home Improvement / Retail', // string
  address: '...',               // string
  overview: '...',              // string (paragraph)
  accountOwner: 'Marcus Reynolds', // string (user name)
  lastActivity: '2026-02-10',   // ISO date string YYYY-MM-DD
  pipelineValue: 2450000,       // number (dollars, sum of active opps)
  activeOpportunities: 4,       // number
  contacts: [Contact],          // embedded contact stubs (see Contact shape)
  suggestedContacts: [          // AI/CRM suggestions — can be empty []
    { name, title, location, reason }
  ],
  website: '...',               // string (optional)
  linkedin: '...',              // string (optional)
  facebook: '...',              // string (optional)
}
```

#### Opportunity
```js
{
  id: 'opp-1',                  // string
  title: 'Store Refresh — Q1',  // string
  accountId: 'acc-1',           // string → Account.id
  account: "Lowe's",            // string (denormalized account name)
  contactId: 'cnt-1',           // string → Contact.id
  contact: 'John Doe',          // string (denormalized contact name)
  amount: 450000,               // number (dollars)
  stage: 'Needs Analysis',      // see Stage values below
  dealProbability: 40,          // number 0–100
  status: 'active',             // 'active' | 'won' | 'lost'
  closeDate: '2026-06-30',      // ISO date string YYYY-MM-DD (optional)
  projectStart: '2026-07-15',   // ISO date string YYYY-MM-DD (optional)
  stageEntryDate: '2026-01-10', // ISO date string (when stage was last changed)
  notes: [Note],                // array (see Note shape)
  estimates: [Estimate],        // array (see Estimate shape)
  documents: [Document],        // array (see Document shape)
  bids: [Bid],                  // array (see Bid shape)
  biddingHistory: [...],        // array of historical bids
  activities: {
    upcoming: [Task],           // upcoming tasks
    log: [ActivityLogEntry],    // completed activity log
  },
}

// Stage values:
// 'Qualifying' | 'Needs Analysis' | 'Estimate Prep' |
// 'Estimate Submitted' | 'Negotiation' | 'Verbal Commit'
```

#### Contact
```js
{
  id: 'cnt-1',                  // string
  name: 'John Doe',             // string
  title: 'Head of Marketing',   // string
  accountId: 'acc-1',           // string → Account.id
  account: "Lowe's",            // string (denormalized)
  email: 'john.doe@lowes.com',  // string
  phone: '555-0101',            // string
  location: 'Sunnyvale, CA',    // string
  lastContacted: '2026-02-10',  // ISO date string YYYY-MM-DD
  lastActivity: '...',          // string (plain text summary, optional)
  engagement: 'Responsive',     // 'Responsive' | 'Moderate' | 'Weak'
  accountOwner: 'Marcus Reynolds', // string
  preferredCommunication: 'Email', // 'Email' | 'Phone' | 'In-person' (optional)
}
```

#### Note
```js
{
  id: 'note-1',                 // string
  type: 'internal',             // 'internal' | 'call_meeting'
  body: '...',                  // string
  pinned: false,                // boolean
  createdAt: '2026-02-10',      // ISO date string YYYY-MM-DD
  entityType: 'opportunity',    // 'opportunity' | 'account' | 'contact'
  entityId: 'opp-1',            // string → entity id
  linkedOppId: null,            // string | null
  linkedAccountId: null,        // string | null
}
```

#### Estimate
```js
{
  id: 'est-1',                  // string
  name: 'Kitchen_Remodel_v1.pdf', // string
  amount: 125000,               // number (dollars)
  date: '2026-01-15',           // ISO date string YYYY-MM-DD
  status: 'Drafted',            // 'Drafted' | 'Sent' | 'Accepted' | 'Rejected'
  notes: '...',                 // string (optional)
}
```

#### Document
```js
{
  name: 'Scope_of_Work.pdf',    // string
  source: 'Uploaded',           // string
  date: '2026-02-01',           // ISO date string YYYY-MM-DD
}
```

#### Bid
```js
{
  company: 'ABC Fixtures',      // string
  amount: 98000,                // number (dollars)
  status: 'pending',            // 'pending' | 'accepted' | 'rejected'
  submittedDate: '2026-01-20',  // ISO date string YYYY-MM-DD
}
```

### 3. Mutations → API endpoints

All data mutations live in `src/context/AppContext.jsx`. Each function maps directly to a backend operation:

| Context function | HTTP method | Suggested endpoint |
|---|---|---|
| `addOpportunity(opp)` | `POST` | `/opportunities` |
| `addEstimate(oppId, estimate)` | `POST` | `/opportunities/:id/estimates` |
| `addNote(entityType, entityId, noteData)` | `POST` | `/notes` |
| `togglePinNote(noteId)` | `PATCH` | `/notes/:id` |
| `deleteNote(noteId)` | `DELETE` | `/notes/:id` |
| `addDocument(oppId, doc)` | `POST` | `/opportunities/:id/documents` |
| `deleteDocument(oppId, docName)` | `DELETE` | `/opportunities/:id/documents/:name` |
| `sendEstimateEmail(oppId, estimateKey, emailData)` | `POST` | `/estimates/:id/send` |
| `completeTask(taskId)` | `PATCH` | `/tasks/:id` |
| `saveTaskForLater(task)` | `POST` | `/tasks` |

### 4. Loading & error states

The current implementation has no loading or error UI — all state updates are synchronous. When wiring to a real API, add `isLoading` and `error` fields to `AppContext` state and handle them in the consuming components.

### 5. Router note

The app uses `HashRouter` (`/#/opportunities`) for compatibility with static hosting (GitHub Pages). If deploying to a server that can handle client-side routing, switch to `BrowserRouter` in `src/main.jsx` and configure a catch-all redirect to `index.html`.

### 6. Auth

No authentication layer exists yet. Add it as a wrapper around the `<Routes>` tree in `src/App.jsx`.

---

## Design System

The full token system lives in `tailwind.config.js`:
- **Colors** — `brand`, `surface`, `content`, `border`, `warning`, `danger`, `safe`, `viz`
- **Typography** — `text-h1` through `text-h6`, `text-body-1` through `text-body-3` — all using `font-crm` (Helvetica Neue)
- **Radius** — `rounded-card` (8px), `rounded-badge` (4px)
- **Shadows** — `shadow-card`

See `design-system.md` for a human-readable mapping of Figma token names → hex values → Tailwind classes.
