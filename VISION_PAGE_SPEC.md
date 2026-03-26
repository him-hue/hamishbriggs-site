# Vision Page Spec — hamishbriggs.com/vision

## Overview

A semi-interactive, scroll-driven narrative page that walks visitors through the Yggdrasil value proposition. The visitor picks their creative field at the start, and that choice personalizes the entire experience — they *feel* the problem before learning about the solution.

**Route:** `/vision` (vision.html)
**Style:** Match existing site — dark background (#000), gold accents (--gold: #C8A24D), Inter + Cormorant Garamond fonts, same CSS variables from styles.css.
**Navigation:** Next / Back / Return to Website buttons visible on every section. Use buttons to advance between sections; scroll within sections where content exceeds viewport. Scroll must NOT accidentally advance sections — particularly important on the carousel sections.
**Progress indicator:** Subtle gold progress bar across the top, or dot nav on the side, showing position in the overall narrative.

---

## Design System (from existing site)

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-serif: 'Cormorant Garamond', 'Georgia', serif;
  --gold: #C8A24D;
  --gold-light: #D4B060;
  --gold-dark: #A67C2E;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --duration: 1200ms;
}
background: #000;
color: #fff;
```

Additional tokens for this page:
- Surface: #1A1A1E (card backgrounds)
- Border: #2E2E35
- Muted text: #8A8880
- Body text: #E8E6E1
- Green (positive stats): #4CAF50
- Red (negative/warning): #E57373
- Accent background: #2A2518

---

## Sections

---

### SECTION 1 — INTRODUCE THE PROBLEM PREMISE

**Layout:** Full viewport. Centered content.

**Interactive element:** A vertical carousel in the center-left of the viewport, cycling through creative fields. The visitor picks one (click or tap). The carousel should feel smooth, frictionless.

**Carousel options:**

| ID | Label |
|----|-------|
| film | Film & Television |
| literature | Literature |
| marketing | Marketing |
| social | Social Media |
| sales | Sales |
| games | Games |
| music | Music |
| journalism | Journalism |

**Copy template:**

The selected option fills into the statement:

```
[CAROUSEL SELECTION] is Storytelling.
```

The carousel scrolls through options. Whichever is selected/centered completes the sentence.

**Below the carousel/statement, a tagline:**

```
In the 21st century, everything is storytelling.
```

This line is styled as an underlined/highlighted statement — prominent, anchoring.

**Notes:**
- The carousel selection persists for the entire experience.
- Vertical scroll within this section moves the carousel. Scroll does NOT advance to next section — only the Next button does.

---

### SECTION 2 — PROVE THE PROBLEM PREMISE

**Layout:** Full viewport. The persistent header bar appears for the first time at the top:

```
VISION  |  MEDIUM  |  DOWNSTREAM EXECUTION  |  STORY
```

This header bar remains visible (in some form) for the remainder of the experience. It tracks the argument structure.

**Copy:** Based on the carousel pick, a personalized proof appears. Cross-fade transition from Section 1.

| Pick | Copy |
|------|------|
| Film & Television | You are into Film & Television. You want to make something people watch. That means building a narrative that holds attention across two hours, six episodes, or an entire franchise. That's storytelling. |
| Literature | You are into Literature. You want to write something people read. That means constructing a world, a voice, a structure that carries a reader from first page to last. That's storytelling. |
| Marketing | You are into Marketing. You want to build something people remember. That means crafting a message that resonates, persists, and moves people to act. That's storytelling. |
| Social Media | You are into Social Media. You want to create something people share. That means compressing an idea into a moment so compelling it spreads on its own. That's storytelling. |
| Sales | You are into Sales. You want to sell something people need. That means framing a product inside a narrative your buyer already believes. That's storytelling. |
| Games | You are into Games. You want to build something people play. That means designing systems where the player's choices become the story. That's storytelling. |
| Music | You are into Music. You want to make something people feel. That means translating emotion into structure — rhythm, tension, release. That's storytelling. |
| Journalism | You are into Journalism. You want to tell something people trust. That means finding the narrative thread in facts, and making complexity legible. That's storytelling. |

**Animation:** Text fades in. "That's storytelling." lands with slight emphasis (gold color or weight change).

---

### SECTION 3 — INTRODUCE THE PROBLEM

**Layout:** Full viewport. Header bar still visible.

**Copy:**

```
Your job isn't just [MEDIUM].
```

Two interactive carousels appear side by side, connected by text:

```
[MEDIUM CAROUSEL]  getting  [MEDIUM ACTION CAROUSEL]
```

The medium carousel shows the visitor's pick. The action carousel shows the primary downstream action for that field.

| Pick | Primary Action |
|------|---------------|
| Film & Television | produced |
| Literature | published |
| Marketing | distributed |
| Social Media | seen |
| Sales | closed |
| Games | shipped |
| Music | released |
| Journalism | published |

**The visitor's pick from Section 1 is pre-selected** but the carousels still show other options cycling gently, reinforcing that this is universal.

---

### SECTION 4 — FEEL THE PROBLEM: IDEA SPRAWL

**Layout:** Full viewport initially, then scrollable vertically within the section.

**Animation — THE CAROUSEL BREAKS:**

The single medium-action carousel cracks open. The neat single-option view splits, and scrolling down within this section rolls out more demands. Scrolling up doesn't remove them — it adds more demands above. The UI itself becomes overwhelming.

**Label:** "IDEA SPRAWL" appears subtly — a small muted label, not a headline. The visitor is living inside it.

**Demands that roll out (placeholder — customize per pick):**

For Film & Television:
- Production planning
- Location scouting
- Casting
- Budgeting
- Scheduling
- Post-production
- Color grading
- Sound design
- Distribution
- Festival strategy
- Press & publicity
- Social media
- Merchandising
- Licensing

For Literature:
- Editing
- Cover design
- Formatting
- Beta readers
- Agent queries
- Publisher relations
- Distribution
- Audiobook production
- Social media
- Book tours
- Foreign rights
- Press outreach
- Email marketing
- Website maintenance

(Repeat pattern for all 8 picks — each gets 12-15 field-specific downstream demands.)

**Critical UX note:** Scrolling within this section does NOT advance to the next section. Only the Next button advances. This is essential — the scroll behavior IS the experience.

**Visual treatment:** Each demand appears as a row or pill. They accumulate. The effect should feel like a list that won't stop growing. Clean typography but relentless quantity.

---

### SECTION 5 — LOSE CONTROL: COHESION COLLAPSE

**Layout:** Full viewport, scrollable within.

**Copy at top:**

```
Nobody can do all these jobs alone.
```

**Visual:** The demands from Section 4 have now expanded into structured rows:

```
Your job is [Social Media] demanding [content creation]
Your job is [SEO] demanding [keyword strategy]
Your job is [Video] demanding [editing & production]
Your job is [PR] demanding [press outreach]
Your job is [Community] demanding [engagement]
Your job is [Brand] demanding [guidelines & voice]
Your job is [Analytics] demanding [performance reports]
Your job is [Paid Media] demanding [ad management]
...
```

All rows are bracketed together on the left (a curly brace or bracket connecting them). All connect to "STORY" on the right side.

As many rows as fit neatly — should feel overwhelming but not ugly. 8-12 rows.

**Label:** "COHESION COLLAPSE" — subtle, muted.

---

### SECTION 6 — CEDE CONTROL OF THE VISION

**Layout:** Full viewport, scrollable within. Header bar still visible.

**Copy at top:**

```
You can hire people.
```

**Visual:** The rows transform. Now each has a department handling it:

```
The [Social Media] dept. handles [content] — STORY
The [SEO] dept. handles [search] — STORY
The [Video] dept. handles [production] — STORY
The [PR] dept. handles [press] — STORY
The [Community] dept. handles [engagement] — STORY
...
```

But each "STORY" on the right is visually different — slightly misaligned, different font weights, maybe subtly different colors. Fragmented. They are NOT unified.

**Copy at bottom:**

```
You can hire people to do these jobs. But then you get [N] different
understandings of your story. [N] different stories.
Not to mention you have to pay them.
```

[N] = the number of rows displayed.

---

### SECTION 6.5 — DEAD END

**Layout:** Full viewport. Mostly EMPTY.

**Visual:** The page is vast and dark. In the center (or slightly off-center), small and alone:

The visitor's original creative vision — their pick from Section 1 — floating in space. Small text. Lost.

```
[Film & Television]
```

Or perhaps the original full statement, but small and faded:

```
You are into Film & Television.
You want to make something people watch.
```

**Label:** "DEAD END" — small, muted, somewhere on the page. Almost an afterthought.

**The header bar from earlier may have faded or fragmented by this point.**

**The feeling:** After all the chaos and noise, sudden emptiness. The vision is still there but it's stranded. The energy has dissipated. Silence.

---

### SECTION 7 — ALL BECAUSE

**Layout:** Full viewport. Also sparse and lonely.

**Copy — centered, simple:**

```
All because you are into [Film & Television]
and want to make something people watch.
```

**The feeling:** This shouldn't be too much to ask. The simplicity of the original impulse versus the enormity of what it spawned. Quiet. Reflective. Small type, lots of negative space.

---

### SECTION 8 — BUT THERE IS A SOLUTION

**Layout:** Full viewport. Clean break.

**Copy — centered, big type:**

```
But there is a solution.
```

Gold text or white. Statement weight. Nothing else on the page.

---

### SECTION 9 — THE FLIP

**Layout:** Full viewport.

**Copy at top (fades in first):**

```
And it's right in front of us.
We're just looking at it back-to-front.
```

**Animation:** The phrase "Everything is Storytelling" appears centered. Then the two words swap positions — animated, deliberate, smooth. "Everything" and "Storytelling" physically trade places:

```
Everything is Storytelling
        ↕ (animated swap)
Storytelling is Everything
```

This is THE conceptual unlock. The animation should feel like a revelation, not a gimmick. Smooth, maybe 1.5-2 seconds.

---

### SECTION 10 — YGGDRASIL

**Layout:** Full viewport. Two states, cross-fade between them.

**State 1:**

```
YGGDRASIL
is your Story Operating System.
```

Below, smaller:

```
(Yggdrasil is the World Tree in Norse mythology.)
```

**State 2 (cross-fade on scroll or after a beat):**

```
YGGDRASIL
Sits upstream of medium.
It is the single source of truth
that controls the narrative through any medium.
```

---

### SECTION 11 — THE RESOLUTION

**Layout:** Full viewport.

**Header bar has evolved.** It now reads:

```
VISION  |  UPSTREAM PLAN  |  MEDIUM  |  DOWNSTREAM EXECUTION  |  STORY
```

"UPSTREAM PLAN" is new — inserted between VISION and MEDIUM. Highlighted in gold.

**Visual:**

Left side: "You" connecting to a box:

```
YGGDRASIL
World Tree
Controls
```

From the box, rows flow out to the right:

```
(Job) streamlines (Job Action)
(Job) streamlines (Job Action)
(Job) so that you (Job Action)
(Job) streamlines (Job Action)
(Job) streamlines (Job Action)
...
```

All rows converge on the right into:

```
COHESIVE STORY
```

(Unlike Section 6 where each department had its own fragmented "STORY", this is ONE unified story.)

**Above or overlaid on this resolution, the three problems appear in greyscale with their solutions in gold:**

```
Idea Sprawl (greyscale)  →  CAPTURE (gold)
    Guided intake. The idea grows tall, not wide.

Cohesion Collapse (greyscale)  →  CLARIFY (gold)
    One canonical understanding. One project brain.

Dead Ends (greyscale)  →  MOBILIZE (gold)
    Domain action. Nothing gets lost, everything moves forward.
```

These can appear as a top row above the resolution visual, or as an overlay that fades in, connecting the three problems from the START to their solutions.

---

### SECTION 12 — THE MODULES

**Layout:** Scrollable within the section. Multiple pages/states as you scroll down.

**This section walks through each module in sequence, building toward the Venn diagram.**

**State 12a — INDEX: THE FOUNDATION**

```
INDEX
The quiet intelligence that enables everything else to operate efficiently.
```

A structured metadata layer for your projects. Point it at a folder and everything within is understood — by you, by your team, and by any AI agent you bring to the work.

Key stats (animate as counters on scroll-in):
- +64% accuracy in controlled tests
- -55% processing time
- -46% cost per answer
- 36 controlled tests conducted

```
Currently in closed beta.
```

Index appears visually as a foundation layer — a horizontal bar or platform beneath the other modules.

**State 12b — STORYMAP**

```
STORYMAP
Structural story development.
```

Stories don't fail because they're bad ideas. They fail because they grow so complex that the creator can no longer hold the whole picture at once. StoryMap is the layer beneath the draft: story logic, character relationships, and narrative coherence.

```
Currently in closed beta with 30 design partners shaping development.
```

StoryMap appears as the first oval of the Venn diagram.

**State 12c — BRANDMAP**

```
BRANDMAP
Market positioning rooted in the story.
```

Defines audience, positioning, and communication strategy grounded in the creative work itself — not bolted on after the fact. Like StoryMap, but for branding.

BrandMap appears as the second oval, overlapping with StoryMap.

**State 12d — PRODUCTIONMAP**

```
PRODUCTIONMAP
Execution planning grounded in the story.
```

A structured environment for production strategy — budget, timelines, logistics, and resource needs. Like StoryMap and BrandMap, but for physical execution.

ProductionMap appears as the third oval, completing the Venn diagram. The three Maps now form a three-circle Venn with natural overlaps.

**State 12e — DOMAINDATAMINE**

```
DOMAINDATAMINE
Industry intelligence.
```

Specialized domain-specific guidance by applying expert reasoning to structured project data across industries — film, marketing, legal, psychology, and more.

DomainDataMine appears as a ring surrounding the entire Venn diagram. It feeds intelligence into all modules.

**State 12f — YGGDRASIL (PLACEHOLDER)**

The Venn diagram + surrounding ring collapses into a single Yggdrasil element.

**NOTE FOR SUBAGENT:** Build states 12a-12e to a solid, finalized state. For 12f, create an empty placeholder screen with a centered label: "[Yggdrasil combined animation — placeholder]". The collapse animation will be custom-built later once the Venn diagram visual is finalized.

---

### SECTION 13 — THE MARKET

**Layout:** Full viewport. Animated.

**Animation:** The Yggdrasil element (or placeholder) expands back outward — a reversal of the 12f collapse. But this time, the module ovals/ring fade away, leaving only the array of ROLES (the downstream demands from earlier sections, now recontextualized as market segments).

Each role is displayed as a circle/oval. The circles are arranged in a grid of vertical columns (this column layout is important — it will be reused in Section 14).

**Inside each role circle:** a small expanding fill that represents adoption/usage. These fill at different rates — unevenly, based on expected likelihood of adoption. Some roles fill faster (e.g., content creation, social media management) than others (e.g., licensing, foreign rights). The impression: broad adoption, some faster than others.

**Counter at bottom of viewport:**

```
SAM Aggregate: $[counter ticking up]
```

The SAM counter ticks upward as the circles fill, showing the aggregate serviceable market growing.

**Placeholder roles for the grid (to be refined later):**

- Content Strategy
- Social Media Management
- Brand Development
- Production Planning
- Distribution
- PR & Communications
- Market Research
- SEO & Analytics
- Sales Enablement
- Creative Development
- Community Management
- Licensing & Rights
- Event Planning
- Audience Development
- Campaign Management
- Editorial & Publishing

(16 roles arranged in a 4x4 grid, each in its own vertical column.)

**Above the grid:**

```
300M+ creators across every industry that communicates through narrative.
```

---

### SECTION 14 — THE VALUE ESCALATOR: VERTICAL GROWTH

**Layout:** Full viewport. Animated transition from Section 13.

**Animation:** The role circles from Section 13 drop to the bottom of their respective vertical columns. Each circle compresses into a bar base. Then the bars grow upward — taller = more value.

Within each bar, three subtle color bands stack:
- Consumer tier (bottom, lighter)
- Professional tier (middle, medium gold)
- Enterprise tier (top, bright gold/white)

The bars grow at different rates — some roles have more enterprise value, others are consumer-heavy.

**Counter at bottom updates:**

```
Consumer: [count]  |  Professional: [count]  |  Enterprise: [count]
Aggregate value: $[ticking up]
```

**Copy (appears above or beside the visualization):**

```
As projects develop within the ecosystem,
users naturally rise through the tiers.
```

**After the bars finish growing, a summary line:**

```
The whole is greater than the sum of its parts.
Vertical and horizontal growth reinforce each other.
```

---

### SECTION 15 — TRACTION & PROGRESS

**Layout:** Full viewport. Clean, static. Deliberately modest after the animated sections.

**Copy:**

```
WHERE WE ARE
```

Three cards or columns:

**Card 1: Index**
```
Closed beta.
+64% accuracy, -55% processing time in controlled tests.
Promising as standalone infrastructure and as the foundation of the Yggdrasil ecosystem.
```

**Card 2: StoryMap**
```
Closed beta.
30 design partners actively shaping development.
Positive early feedback on structural story development workflows.
```

**Card 3: Platform**
```
BrandMap, ProductionMap, and DomainDataMine in development.
Building in public with real users.
What we're learning is accelerating the platform.
```

**Tone:** Restrained. After the grand vision, this reads as credibility. We are not over-promising.

---

### SECTION 16 — THE TEAM

**Layout:** Full viewport.

**Copy at top:**

```
Designed by a creator, for creators.
```

**Founder card (prominent):**

```
HAMISH BRIGGS
Founder

Actor, writer, director, and comic book creator. Twenty years navigating the gap
between creative ambition and the workflows that can't keep up. Now building the
tools he wished he'd had all along.
```

**Advisor cards (below, smaller, three columns):**

```
CARL GUSTIN          DAVID FAITH          GREGORY DANE
Advisor              Advisor              Advisor
```

(Advisor bios/descriptions to be added when available.)

---

### SECTION 17 — CLOSE

**Layout:** Full viewport. Sparse. Powerful.

**Copy — large, centered:**

```
Storytelling is human.
Let's keep it that way.
```

(This echoes the flip from Section 9 — full circle.)

**Below, contact info:**

```
Hamish Briggs
him@hamishbriggs.com
+1 (917) 346-4517
```

**CTAs (two buttons):**

```
[Request the Full Investor Deck]    [Apply for Design Partner Access]
```

**Footer:**

```
YGGDRASIL  ·  World Tree AI  ·  2026
```

---

## Navigation Behavior

### Section Advancement
- **Next / Back buttons** visible on every section (bottom-right or bottom-center).
- **Return to Website** button visible on every section (top-left, near header, or bottom).
- Sections advance via button click only — NOT via scroll.
- Transitions between sections: cross-fade (var(--duration): 1200ms, var(--ease)).

### Scroll Within Sections
- Sections 4, 5, 6, 12, 13, 14 have scrollable content within.
- Scroll within these sections must be clearly indicated (scroll indicator arrow, or visible overflow).
- Critical: scroll within a section must NEVER accidentally trigger section advancement.

### Progress Indicator
- Thin gold bar across the top of the viewport, filling left-to-right as the visitor advances.
- Or: dot navigation on the right side, showing all sections as dots, current section highlighted gold.

---

## Placeholder Notes

### Roles Array
The specific downstream roles/demands used in Sections 4, 5, 6, 13, and 14 are PLACEHOLDERS. They will be refined with field-specific roles for each of the 8 carousel options. The architecture supports any number of roles (target: 12-16 per field). For now, use the Film & Television set as the default and build the data structure so roles can be swapped via a config object.

### Yggdrasil Collapse Animation (Section 12f)
Build states 12a-12e to completion. Section 12f is a PLACEHOLDER screen. The collapse animation from Venn diagram → Yggdrasil pulse will be custom-built after the Venn visual is finalized.

### Advisor Bios
Carl Gustin, David Faith, and Gregory Dane are confirmed as advisors. Bios and role descriptions to be added later. Build the cards with name + "Advisor" as placeholder.

---

## Technical Notes

- Single HTML file (vision.html) with embedded CSS and JS, consistent with existing site architecture.
- No framework dependency — vanilla JS, CSS transitions/animations.
- The carousel in Section 1 should store the user's selection in a JS variable that populates all subsequent template strings.
- All per-pick content (proof statements, demands, actions) stored in a config object at the top of the script for easy editing.
- Responsive: must work on desktop and tablet. Mobile is secondary but should not break.
- The page should use the same page-blackout transition pattern as other pages on the site (see styles.css .page-blackout classes).
