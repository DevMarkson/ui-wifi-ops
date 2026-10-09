# UI Wifi OPS — Design Document
### University of Ibadan Campus WiFi Tracker
**Version 1.0 | Product Design Spec**

---

## 1. Product Overview

### What Is This?

UI Wifi OPS is a community-driven, real-time campus WiFi health tracker built for University of Ibadan students. It tells students exactly where to find a working internet connection on campus — which access points are up, how to connect, what the speed is like, and what to do when campus WiFi is completely dead.

### The Problem It Solves

Fresh students and returning students alike waste time and mobile data hunting for a working WiFi connection. There is no central place that says "Jaja Hall AP is working right now" or "Kuti AP7 has been down since yesterday." Students figure this out by word of mouth, which is slow and unreliable.

### Who It Is For

All University of Ibadan students — from 100 level to postgraduate. The primary users are:
- Students in labs and lecture halls who need internet for research and assignments
- Hall residents who rely on hostel WiFi
- Students who are running low on data and need a free alternative fast

### Design Philosophy

This is a **utility-first tool**, not a marketing page. Every design decision should answer: does this help a student find WiFi faster? Clarity wins over decoration. The interface should feel like a tool built by someone who actually attends UI — not a generic SaaS product.

---

## 2. Design Direction

### Aesthetic

**Grounded Tech Utility** — the interface feels like a campus operations dashboard crossed with a well-designed student app. It should feel serious and trustworthy, not flashy. Think of how a network monitoring tool looks, but made accessible and friendly for a student audience.

Inspiration references:
- Flightradar24 (real-time node map approach)
- Uptime monitoring dashboards (status-first UI)
- The prototype already built (card-based hotspot directory with modals)

**NOT:** a generic university website, a purple gradient SaaS landing page, or anything that looks like a template.

### Theme

**Dark mode by default.** Campus WiFi hunting often happens at night (night plan hours, late study sessions). Dark mode is easier on the eyes and also makes the status color indicators (green/amber/red) pop with maximum clarity.

A light mode toggle can be added in a later version but is not in scope for v1.

---

## 3. Color System

These are our own colors, not copied from any existing system. They are grounded in UI's institutional identity (green and gold) while serving functional clarity.

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#080F0A` | Page background, deepest layer |
| `--bg-surface` | `#0E1A12` | Cards, sidebars, panels |
| `--bg-elevated` | `#162319` | Hover states, modals |
| `--border` | `#1F3328` | All 1px borders throughout |
| `--text-primary` | `#E4EDE7` | Headings, important labels |
| `--text-secondary` | `#7A9A85` | Body copy, descriptions |
| `--text-muted` | `#3D5C49` | Timestamps, placeholders |

### Brand Colors (UI Identity)

| Token | Hex | Meaning |
|---|---|---|
| `--ui-green` | `#0D6B3E` | University of Ibadan primary green |
| `--ui-green-light` | `#1A9957` | Active states, buttons |
| `--ui-gold` | `#C9961A` | UI gold, accents, highlights |
| `--ui-gold-dim` | `#7A5A10` | Subtle gold borders and backgrounds |

### Status Colors (Functional)

These are the three states every WiFi node can be in. They must be immediately recognizable without reading any text.

| Token | Hex | State | Meaning |
|---|---|---|---|
| `--status-up` | `#22C55E` | Working | Connection confirmed by community report |
| `--status-slow` | `#F5A623` | Congested | Connected but slow, likely peak hours |
| `--status-down` | `#C0392B` | Down | Reported as not working or unresponsive |
| `--status-unknown` | `#4A5568` | Unknown | No recent report, status unverified |

### Usage Rules

- Status colors are used exclusively for node/hotspot status indicators. They are never used for general UI decoration.
- Gold (`--ui-gold`) is used for interactive highlights, links, and SSID names — things the student needs to copy or act on.
- Green (`--ui-green`) is the primary action color for buttons.
- Never put two status colors next to each other without a separator.

---

## 4. Typography

### Font Stack

**Display / Headings:** `Syne` — weight 700 and 800. Used for screen titles, hotspot names, and section headers. Syne has a strong, purposeful character that avoids the generic look of Roboto or Inter.

**Body / Labels:** `Space Mono` — weight 400. Used for all data, SSIDs, status labels, step instructions, and metadata. Monospace makes network names, codes, and technical info instantly legible and copy-friendly.

```css
font-family: 'Syne', sans-serif;        /* headings */
font-family: 'Space Mono', monospace;   /* data, labels, body */
```

### Type Scale

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Screen Title | Syne | 28–36px | 800 | Page/section heading |
| Card Title | Syne | 16px | 700 | Hotspot location name |
| Label | Space Mono | 11px | 400 | Category tags, uppercase labels |
| Body | Space Mono | 13px | 400 | Descriptions, step instructions |
| SSID / Code | Space Mono | 14px | 700 | Network names, codes to copy |
| Timestamp | Space Mono | 10px | 400 | "Last updated 4 mins ago" |

### Rules

- All uppercase labels use `letter-spacing: 0.1em`
- SSID names always appear in the gold color (`--ui-gold`) to signal "this is something to interact with"
- Never use font sizes below 10px

---

## 5. Layout System

### Border Radius

`4px` everywhere — cards, buttons, badges, modals, inputs. No exceptions. This creates a flat, technical, tool-like feel. Avoid rounded-full pill buttons except for the live pulse indicator dots.

### Borders

Use `1px solid var(--border)` instead of drop shadows. Shadows make things feel decorative. Borders feel structural, like a dashboard panel. The only exception is neon glow effects on live status dots.

### Spacing

Base unit is `8px`. All padding and margins are multiples of 8: 8, 16, 24, 32, 48.

### Grid

- Desktop layout: max-width `1200px`, centered with `24px` side padding
- Hotspot directory cards: CSS Grid, `auto-fill`, `minmax(280px, 1fr)`
- No layout columns for mobile — single column stack

---

## 6. Component Library

### 6.1 Status Badge

Displayed on every hotspot card. Three variants only.

```
[ ● Working ]   — green text on dark green bg
[ ● Slow    ]   — amber text on dark amber bg  
[ ● Down    ]   — red text on dark red bg
```

- 1px border matching the text color at 30% opacity
- The dot on "Working" status pulses (CSS keyframe animation, 1.4s loop)
- Font: Space Mono, 10px, uppercase, letter-spacing 0.08em

### 6.2 Hotspot Card

The primary UI unit. Used in the directory view.

**Structure:**
```
┌─────────────────────────────┐
│ [Icon]  Location Name  [Status Badge] │
│         Sub-location label            │
├─────────────────────────────┤
│ Network: [ SSID_NAME ]                │
│ ⚡ Speed label   📍 Coverage area     │
│                                       │
│ [  How to Connect / Down Button  ]    │
└─────────────────────────────┘
```

- Background: `--bg-surface`
- Border: `1px solid var(--border)`
- On hover (working nodes only): border changes to `--ui-gold`, subtle `translateY(-3px)` lift
- Offline cards: 60% opacity, cursor `not-allowed`, no hover effect
- Clicking any working card opens the Connection Modal

### 6.3 Connection Modal

Opens when a student clicks "How to Connect" on a working hotspot.

**Structure:**
```
┌────────────────────────────────┐
│ [Icon]  Hotspot Name      [✕]  │
│         SSID · Location        │
├────────────────────────────────┤
│ Network Name (SSID)            │
│ [ 📶 SSID_NAME ]               │
│                                │
│ Steps to Connect               │
│ [1] Step one text...           │
│ [2] Step two text...           │
│ [3] Step three text...         │
│                                │
│ 💡 Note: additional context    │
└────────────────────────────────┘
```

- Width: 480px, centered
- Background: `--bg-elevated`, border: `1px solid --ui-gold`
- Overlay: `rgba(0,0,0,0.75)` with `backdrop-filter: blur(6px)`
- Entrance animation: scale from 0.95 + translateY(10px) → normal, 250ms ease
- Step numbers: circular, `--ui-green` background, Space Mono, 11px
- SSID row: visually distinct, gold border, dark background — "tap to copy" in v2

### 6.4 Primary Button

Used for "How to Connect" and form submissions.

- Background: `--ui-green`
- Hover: `--ui-green-light`, scale(1.01)
- Font: Syne, 13px, 700, uppercase
- Border radius: 4px
- Padding: 10px 16px
- Transition: 200ms ease

### 6.5 Report Status Button

Used in the bottom bar and the Report Modal.

- Transparent background, border: `1px solid --ui-gold`
- Text color: `--ui-gold`
- Hover: fill with `--ui-gold`, text becomes `--bg-base`
- Same sizing as primary button

### 6.6 Filter Tabs

Horizontal row of category filters above the directory.

- Default: transparent bg, muted text, `--border` border
- Active: `--ui-green` background, white text
- Font: Syne, 13px, 600
- Never use underlines for active state — always fill

### 6.7 Toast Notification

Appears after a successful status report submission.

- Slides in from bottom right
- Dark background (`--bg-elevated`), gold left border
- Text: "Report submitted. Map updated." in Space Mono, 13px
- Auto-dismisses after 3 seconds
- Does not stack — only one toast at a time

---

## 7. Application Screens

### Screen 1: Hotspot Directory (Main Screen)

This is the home screen. Students land here first.

**Layout:**
- Sticky header with UI logo + app name + live indicator
- Hero section: headline, subtitle, 2–3 stat counters (total spots, working spots)
- Filter tabs row + search input
- CSS Grid of hotspot cards
- Sticky bottom bar: "Know a spot that's wrong? Report it"

**Key interactions:**
- Filter tabs filter cards instantly, no page reload
- Search filters by location name, SSID, or hall name
- Clicking a working card opens the Connection Modal
- Live indicator in the header pulses green continuously

**Stat counters to show:**
- Total hotspots listed (e.g. 12)
- Currently working (e.g. 8)

### Screen 2: Auth Guide

A dedicated page that explains how to log into campus WiFi. This removes confusion for fresh students who don't know what credentials to use.

**Layout:**
- Two column on desktop: left column has step-by-step timeline, right column has a stylised terminal/browser mockup showing what the login screen looks like
- On mobile: collapses to single column, timeline only

**Content — Connection Steps:**
1. Go to WiFi settings, look for the network name listed on the directory
2. Connect — a browser login page will open automatically (captive portal)
3. If no page opens, navigate to `http://1.1.1.1` or `http://192.168.1.1`
4. Enter your **matric number** as the username (e.g. `200101234`)
5. Enter your **student portal password**
6. If prompted to accept a security certificate, tap Accept — this is normal for campus networks

**Warning Callout Box:**
- Red/maroon left border
- Text: "Never enter your password if the login page looks different from what you've seen before. Report any suspicious pages to ICT Support."

**Step Timeline Style:**
- Vertical line connecting numbered circles
- Each circle: `--ui-green` background, white number, Space Mono
- Step text: Space Mono, 13px, `--text-secondary`
- Action items (things to type) highlighted in gold

### Screen 3: Submit WiFi Form & Success

A dedicated tab for crowdsourcing new WiFi spots, backed by an `emailjs` form. 

**Layout (Form):**
- Screen header with "Submit a School WiFi"
- Input fields with icons: Location, WiFi Name (SSID), Exact Spot Description, Current Status (Working/Slow/Unsure), Notes.
- Primary submit button with loading state ("SENDING...").

**Layout (Success Screen):**
- Replaces form upon successful submission.
- Hero illustration with radar badge.
- Message: "Submission Received".
- Bento Metadata: Status (Pending Review) and Queue ID.
- Actions: "BACK TO HOME" or "SUBMIT ANOTHER".

### Screen 4: Report Status Modal

A quick-action overlay for crowdsourcing WiFi health. 

**Trigger:** "REPORT STATUS" button in the banner at the bottom of the Directory.

**Layout:**
- 400px centered modal, heavy dark overlay.
- Header: "Update Hotspot Status".
- Dropdown to select which hotspot is being reported.
- Two large vote buttons:
  - Green button: "✓ It's Working"
  - Red button: "✗ Not Working"
- Optional: dropdown for issue type — "Captive portal broken", "No IP assigned", "Very slow", "No signal".
- Submit closes the modal and fires a toast: "Report submitted. Map updated."

**Design note:** The two vote buttons should be large — minimum 44px height, full width in the modal. The action needs to feel easy and immediate, like a thumbs up/down. Students should be able to report in under 5 seconds.

---

## 8. Navigation

**Navigation approach:** Bottom navigation bar (`bottom-nav`), persistent at the bottom of the screen.

Tabs:
1. **Directory** (home, WiFi hotspot cards)
2. **Submit WiFi** (Form to add new hotspots)
3. **Connect** (Auth Guide)

No sidebar navigation. No hamburger menu. The app has three screens and the navigation should reflect that simplicity.

Active tab: highlight with `--ui-green` background or text color shift.

---

## 9. Data Model (Per Hotspot)

Each hotspot entry contains the following information. This is what drives every card and modal.

```
id          — unique identifier
name        — human-readable location name (e.g. "Jaja Hall")
ssid        — exact network name to connect to (e.g. "Jaja_Accgr1")
icon        — emoji representing location type
category    — halls | faculty | library | public
location    — descriptive address on campus
status      — online | slow | offline | unknown
speed       — Fast | Moderate | Slow | N/A
coverage    — where on the location the signal reaches
note        — one-sentence context tip
steps[]     — array of connection step objects
  .text     — instruction string (HTML allowed for bold emphasis)
lastUpdated — timestamp of most recent community report
```

---

## 10. Features Removed from Original Ideation

The following features from the Stitch design were deliberately removed from this version. They are good ideas but require infrastructure that is out of scope for a student-built v1.

| Feature | Reason Removed |
|---|---|
| Full interactive map / geospatial view | Requires campus GIS data, map tile integration (Mapbox/Leaflet), and significant engineering effort. Not worth it before validating that students will use the tool at all. |
| Real-time ping/uptime data | Requires a backend server pinging access points continuously. Not feasible without ICT department cooperation. |
| 24-hour uptime charts per node | Same reason — needs persistent backend data collection. |
| Per-node community report history log | Needs a database. Can be added in v2 with Supabase or Firebase. |
| Automatic node status update from votes | For v1, status is manually curated by the maintainer based on student reports. |
| Night Plan Directory | Originally planned as a fallback screen but removed to keep the focus strictly on campus WiFi discovery and reporting. |

These features are documented here so they can be prioritized properly in v2 once the tool has users and community traction.

---

## 11. Features Unique to This Build

These were not in the Stitch ideation but make sense for the UI context specifically.

| Feature | Rationale |
|---|---|
| Student email login instructions per hotspot | Different access points have different login methods at UI. This removes confusion. |
| "Night plan friendly" filter tag | A direct response to the freshers event feedback — students asked specifically about this. |
| UI logo and institutional branding | Builds trust and makes the tool feel officially connected to campus, even if student-built. |
| Working / Slow / Down / Unknown — four states | "Unknown" is important — if nobody has reported recently, the data is stale and students should know that. |
| Matric number as username callout | This is a common point of confusion for 100-level students. Calling it out explicitly in the auth guide saves real time. |

---

## 12. Accessibility

- All interactive elements have visible focus states (gold outline, 2px, offset 2px)
- Status is never conveyed by color alone — always paired with a text label
- Minimum touch target size: 44px height
- All buttons have descriptive accessible labels
- Contrast ratio: all text meets WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- Monospace fonts are used throughout data display — screen readers handle these well

---

## 13. Build Stack

**Current Implementation Stack:**
- **Framework:** React with TypeScript and Vite.
- **Styling:** Custom CSS (vanilla).
- **Submissions:** EmailJS integration for handling form submissions without a backend.
- **Hosting / Analytics:** Vercel (with `@vercel/analytics`).

**Recommended v2 additions:**
- Database: Supabase (free tier, Postgres, real-time subscriptions)
- Auth for reports: Student email verification via Supabase Auth (blocks non-UI emails)

---

## 14. Voice and Tone

The copy in this tool should sound like it was written by a UI student for UI students — not a corporate product team.

**Examples:**

| Avoid | Use Instead |
|---|---|
| "No connectivity detected at this node" | "This one is down right now" |
| "Authentication credentials required" | "You'll need your matric number and portal password" |
| "Submit your report for community review" | "Tell others what's happening here" |
| "Access point operational" | "Working ✓" |

Keep all labels short. If it needs a tooltip to explain, rewrite it.

---

## 15. What to Build First (Suggested Order)

1. **Hotspot Directory page** — this is the core value. Get the cards, search, and filter working with real data.
2. **Connection Modal** — step-by-step guide per hotspot. This alone will save fresh students significant confusion.
3. **Submit Form & Success Screen** — allow users to submit new hotspots via `emailjs`.
4. **Report Modal + toast notification** — crowdsourcing is what keeps the data fresh.
5. **Auth Guide page** — fills a gap no other resource covers for UI students.

---

*Document maintained by the UI Wifi OPS student team. Update this document whenever a design decision changes — treat it as the single source of truth.*
