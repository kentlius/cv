---
name: Kent Liusudarso CV
description: A monochrome, spec-sheet CV rendered from one structured source.
colors:
  ink: "oklch(0.145 0 0)"
  ink-strong: "oklch(0.205 0 0)"
  ink-muted: "oklch(0.556 0 0)"
  hairline: "oklch(0.922 0 0)"
  wash: "oklch(0.97 0 0)"
  paper: "oklch(1 0 0)"
  focus-ring: "oklch(0.145 0 0)"
typography:
  display:
    fontFamily: 'Instrument Sans, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "2rem"
    letterSpacing: "normal"
  headline:
    fontFamily: 'Instrument Sans, sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.75rem"
  title:
    fontFamily: 'Instrument Sans, sans-serif'
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1rem"
  body:
    fontFamily: 'Instrument Sans, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: 'Geist Mono, monospace'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1"
  caption:
    fontFamily: 'Geist Mono, monospace'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "32px"
  gutter: "64px"
components:
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px 0"
  contact-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    size: "32px"
  skill-badge:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: Kent Liusudarso CV

## Overview

**Creative North Star: "The Annotated Spec Sheet"**

The page is one sheet of ink on paper. Instrument Sans carries every
proportional sentence; Geist Mono annotates it — dates, locations, roles,
annotations. A 672px column keeps prose at a reading measure even when the
shell is wide. There is no photography, no display face, and no chromatic
accent; a single monochrome globe in the footer marks the location. The CV
should read as a document that happens to be interactive, not as a product
surface wearing a CV.

Density is deliberate: 12px card prose under 16px entry titles under 20px
section headings, with 32px between sections. Cards are paper sheets separated
by a hairline ring rather than elevation. Interaction lives at the edges — 32px
icon buttons — and all of it disappears in print. A restrained 12px rise plus
opacity marks entry and scroll, once per element; the document is fully
readable with motion disabled.

The confirmed component direction is **soft lifted surfaces**: a layered-paper
feel. Today that lift is carried by rounded corners and a 1px ink/10 ring; any
shadow added to content must stay low-contrast and single-layer, so the page
keeps its document character.

**Key Characteristics:**
- Achromatic palette; hierarchy by size and weight, never hue.
- One proportional family (Instrument Sans) plus Geist Mono for metadata.
- 672px reading column inside a 1280px shell.
- Flat content sheets with hairline rings; the only shadow is the control-rest
  under icon buttons.
- One authored reveal language, once per element, removed under reduced motion
  and in print.
- A single monochrome footer globe marks the location; no photography.
- Print is a first-class output: chrome hides, contacts become text.

## Colors

A near-pure grayscale system: white paper, near-black ink, and three
low-contrast neutral steps. No token carries chroma.

### Primary

- **Ink** (`oklch(0.145 0 0)`): headings, body copy, icons, and the initials
  monogram. Near-black rather than pure black, which keeps long reading softer.
- **Ink Strong** (`oklch(0.205 0 0)`): text on wash-filled controls and badges.
  One step lighter than body ink.
- **Ink Muted** (`oklch(0.556 0 0)`): metadata — dates, locations, roles,
  contact hints, and empty states.

### Neutral

- **Paper** (`oklch(1 0 0)`): page and card surface.
- **Wash** (`oklch(0.97 0 0)`): hover fills, badges, and the initials avatar.
  The only "tint" in the system is this step of gray.
- **Hairline** (`oklch(0.922 0 0)`): borders, dividers, and the ring around
  cards. Never darkened for emphasis.
- **Focus Ring** (`oklch(0.145 0 0)`): keyboard focus as a 2px ink outline
  with a 2px offset. Ink rather than a mid-gray, so the indicator clears the
  non-text contrast floor.

### Named Rules

**The No-Hue Rule.** The interface carries zero chroma. The chromatic moments
in the product — fuchsia text selection, confetti on certification hover, the
emerald console signature — are easter eggs, not tokens. They never appear as
layout color, state color, or emphasis in the CV itself.

**The Weight-Not-Color Rule.** Emphasis is expressed with weight, size, and
spacing. If a change needs a color to read as important, the hierarchy is
wrong.

## Typography

**Display Font:** Instrument Sans (with `sans-serif` fallback), self-hosted
variable 400–700, Latin and Latin Extended subsets.
**Body Font:** Instrument Sans.
**Label/Mono Font:** Geist Mono (with `monospace` fallback), self-hosted
variable 400–500.

**Character:** one contemporary grotesque doing the reading, with a dedicated
mono for annotation. Instrument Sans has a slightly editorial, humanist edge
that keeps the sheet from reading as a framework demo; Geist Mono makes the
metadata identical on every platform instead of inheriting SF Mono, Menlo, or
Consolas. The pairing is one proportional voice plus its margin notes.

### Hierarchy

- **Display** (700, 24px/32px): the name in the page header, and nothing else.
- **Headline** (700, 20px/28px): section titles — Work Experience, Education,
  Certifications, Honors & Awards, Skills.
- **Title** (600, 16px/16px): entry names — company, institution, award,
  certification. Dates sit opposite from 640px up in 14px muted, tabular
  numerals; below that they stack under the entry title.
- **Body** (400, 14px/20px): card framing text. Card bullets drop to 12px/16px
  with 4px between items; this is the densest reading size in the system.
- **Label** (mono 400, 14px/1): role lines under entry titles, dates,
  locations, and contact rows.
- **Caption** (mono 400, 12px/16px): skill group labels, field labels, and
  small metadata; tooltip text drops to 10px.

### Named Rules

**The Mono Is Metadata Rule.** Monospace marks data about the document —
dates, locations, roles, handles, annotations. It never sets a paragraph, a
highlight, or a section title.

**The Pair Rule.** Instrument Sans carries every proportional glyph; Geist
Mono carries annotations. Do not add a third family, a serif display face, or a
second mono; hierarchy comes from scale and weight inside the pair.

## Layout

A single centered column. The outer `<main>` is capped at 1280px (`max-w-7xl`)
with 16px padding on small screens and 64px at `md` (768px); print uses 48px.
The CV column is capped at 672px (`max-w-2xl`) and centered within that shell,
leaving the page deliberately narrow on desktop.

Vertical rhythm is 32px between major sections (24px in print), 12px between
the heading and entries in a section (8px in print), and 12px between cards.
Inside a card: 16px top/bottom padding, 12px gap between header and body, 4px
between header rows, and 16px horizontal padding. Bullets indent 16px with 4px
between items. The 12px bullet block is the document's measure exception: it
is annotation read as part of the sheet, not prose.

The header is a two-column arrangement: name, optional mono headline, location,
and contact buttons on the left; a 112px initials avatar on the right. Contact
buttons wrap in a 4px-gapped row with 4px top padding. Entry headers stack the
date under the title below 640px; from 640px up they are a two-column grid and
the date sits opposite, while a long title wraps inside its own column.

Breakpoints: Tailwind defaults are in use, with one meaningful threshold —
`md` (768px) switches outer padding from 16px to 64px. No layout depends on
fixed chrome.

## Elevation & Depth

Flat at rest. Content cards are separated by a 1px ring of ink at 10% opacity,
not by shadow; this is the system's primary depth cue. The only shadow is the
`shadow-xs` under the 32px contact buttons — a hint of physical key, not
elevation. There are no overlays.

The confirmed component direction is soft lifted surfaces. When that lift is
applied to content, it must be a single low-contrast shadow paired with the
existing hairline, never a stack of heavy shadows. Print removes all of it.

### Shadow Vocabulary

- **Control Rest** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): icon buttons only; a hint
  of physical key, not elevation.

### Named Rules

**The Hairline-First Rule.** A surface is separated by a 1px ink/10 ring before
any shadow is considered. Two competing separation devices on one surface is a
bug.

**The Control-Only Rule.** The only shadow on the page is the control-rest under
an icon button. Content, cards, and page chrome stay flat.

## Shapes

Rounded, engineered, never playful. The radius scale starts at a 10px base:
4px for tooltips, 6px, 8px for icon buttons, 10px, 14px for cards, 18px above
that. Pills (`9999px`) are reserved for the avatar and skill badges — two round
objects in an otherwise rectangular page.

Borders are always 1px. Cards use a ring (a 1px box-shadow) so layout width is
not affected; form controls use a real border. There is no clipping, no
ornamental geometry, no drawn decoration beyond the 16px stroke icons and the
initials avatar.

## Components

### Avatar

A 112px circle, 1px hairline border, wash fill, initials centered at 14px in
muted ink. It carries `role="img"` and an accessible name. It is the only
identity image; there is no photograph, logo, or pattern.

### Cards

White paper with a 14px radius, 16px vertical padding, and a 1px ink/10 ring.
The header is a two-column grid from 640px up: the title and its metadata sit in
the first column, the date is right-aligned in the second. A long institution
wraps inside its own column instead of pushing the date onto a new line. The
title is 16px/600 alone; the role or credential line below is mono 14px muted
and carries the location after a middot. Below 640px the date stacks under the
metadata. The header has 4px gaps and 16px side padding; the body is 12px text
with 16px side padding, separated from the header by the card's 12px gap. The
role line is mono 14px muted; highlights are disc bullets at 12px/16px.
Feature names and highlights break long words only when necessary.

### Icon Buttons

32px square, 8px radius, 1px input-hairline border, paper fill, `shadow-xs`,
16px stroke icon. Hover fills with wash; press darkens with ink/10. Focus is a
2px ink outline with a 2px offset. A tooltip — ink pill, paper text, 10px, 4px
radius — appears below on hover and focus. Used for email, phone, LinkedIn, and
GitHub.

### Skill Chips

20px tall pills, wash fill, ink-strong text at 12px/500, 8px horizontal
padding. They wrap in a 4px-gapped flex row under a mono 12px muted group
label. Chips are labels, not filters: no selected state exists.

### Footer Globe

A 112–128px circle at the end of the sheet, hairline border, holding a Cobe
canvas over a static SVG wireframe. The globe is ink-on-paper: a light gray
sphere with a dotted map, a dark marker at Shizuoka, and the wireframe's
meridians always visible on top. Cobe is imported only when the footer comes
within 200px of the viewport; the SVG alone renders without JavaScript, WebGL,
or `prefers-reduced-motion`. The canvas is print-hidden. Rotation is
0.0015 radians per frame, and stops under reduced motion.

### Motion

One reveal language, used twice: on entry and on scroll. Elements begin at
opacity 0 and `translateY(12px)`, then settle to opacity 1 and translate 0 over
450ms with `cubic-bezier(0.23, 1, 0.32, 1)`. Grouped items use a 60ms delay.

The header is the initial beat: name 0ms, role 60ms, location 120ms, avatar
120ms, contacts 180ms. Scroll targets are section headings (no delay) and cards
or the skills group (60ms), revealed once when 8% of the target enters the
viewport.

The `.motion` class is set by an inline head script only when
`prefers-reduced-motion` is not `reduce` and `IntersectionObserver` exists.
Without JavaScript or under reduced motion, no hiding class is applied and the
content is fully visible. Print forces every target visible. Keyboard focus
reveals the containing card immediately, without a fade. The footer globe adds
one slow rotation after its lazy load; reduced motion keeps the static
wireframe. There is no parallax, scroll-jacking, or layout animation. The
confetti easter egg is separate and hover-only.

### Social Preview

`/og.png` is generated at build time from the same CV view model: 1200×630,
paper and ink, the name in Instrument Sans 700 at 96px, role and company in
Geist Mono, a hairline globe motif on the right, and a mono footer with the
site and location. Satori produces the SVG and Resvg rasterizes it. There is no
hand-made or animated social image; Open Graph and Twitter both point at the
generated PNG.

### Print Output

Print collapses to a document: 48px page padding, 24px between sections, no
fixed chrome, contact buttons replaced by visible email and phone text at 12px,
and every reveal forced visible. Cards avoid breaking across pages, and section
headings stay with their first entry. The column, type scale, cards, and
hairline rings remain.

## Do's and Don'ts

### Do:
- **Do** keep the CV column at 672px and the content measure inside it; wider
  prose breaks the spec-sheet character.
- **Do** carry hierarchy with weight and size before touching color.
- **Do** set metadata — dates, locations, roles, annotations — in the system
  mono stack at 12–14px.
- **Do** separate cards with the 1px ink/10 ring; when applying the confirmed
  soft lift, pair it with that hairline instead of replacing it.
- **Do** reserve the control-rest shadow for icon buttons; content stays flat.
- **Do** keep the reveal to one 12px rise plus opacity, 450ms ease-out, once per
  element; grouped items wait 60ms.
- **Do** ship content visible without JavaScript and under reduced motion;
  print forces every reveal visible.
- **Do** reveal a card immediately on keyboard focus, without waiting for the
  transition.
- **Do** keep the footer globe monochrome and marked at the CV location; keep
  its static SVG wireframe visible so it works without WebGL or JavaScript.
- **Do** generate `/og.png` from the CV view model with Satori and Resvg; never
  hand-maintain the social image.
- **Do** hide contact icons in print and expose email and phone as text.
- **Do** keep the avatar as initials; it is the only identity mark.
- **Do** use the 2px ink focus outline with its 2px offset; a low-contrast halo
  is not a focus indicator.

### Don't:
- **Don't** introduce a chromatic accent into the UI. Selection fuchsia,
  confetti, and the console signature stay outside the system.
- **Don't** add a second typeface or a serif/display face; Instrument Sans and
  Geist Mono are the whole voice.
- **Don't** use pure black, hue-tinted grays, or darkened borders for emphasis.
- **Don't** stack multiple shadows on content surfaces or add glow effects.
- **Don't** add parallax, scroll-jacking, looping motion, layout animation, or
  reveals that re-run on every scroll direction.
- **Don't** hide content behind a reveal without the reduced-motion and no-JS
  fallback.
- **Don't** load Cobe above the fold or on reduced motion, and don't add
  photography, a headshot, or a logo wall around the globe.
- **Don't** widen cards or the reading column beyond 672px.
- **Don't** add dark mode without an explicit theme decision; the stylesheet
  declares `color-scheme: light` and carries no dark tokens.
- **Don't** add a headshot, logo wall, decorative illustration, or background
  texture.
