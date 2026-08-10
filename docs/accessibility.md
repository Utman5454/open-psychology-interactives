# Accessibility

The standard every page in this project is held to, how it is checked, and what
to do if you meet a barrier.

---

## The commitment

**Target: WCAG 2.2 Level AA**, applied to the site pages and to every tool.

This is a teaching resource for university students, which means some
proportion of the people using it have a disability, and a proportion of those
have not disclosed it to anyone. A tool that only works with a mouse and good
colour vision is not a resource for a cohort — it is a resource for part of
one. Accessibility here is a requirement for merging a tool, not a later
improvement.

We do not claim a formal audit has been carried out. What follows is what is
implemented and what is checked.

## What is implemented in the scaffold

**Structure and semantics**

- One `<h1>` per page; heading levels are never skipped.
- `<header>`, `<nav>`, `<main>`, `<footer>` landmarks on every page, and
  `aria-label` on each `<nav>` so the main and breadcrumb navigations are
  distinguishable.
- A skip link as the first focusable element on every page.
- `aria-current="page"` on the navigation link for the current page and on the
  final breadcrumb.
- Lists marked up as lists, so counts are announced.
- Navigation labels are shortened visually where a full module name will not
  fit on one header row, with a visually hidden span completing the accessible
  name — so the link is announced as "Personality and Individual Differences"
  even though it reads "Personality" on screen.

**Keyboard**

- Every control — every link, button, form field and other focusable widget —
  can be reached and operated using the keyboard alone, in a tab order that
  follows the visual layout. ("Control" is meant literally here; elsewhere in
  this project "tool" names a whole teaching interactive.)
- A single visible focus style across the site: a 3px outline in a hue
  deliberately different from the link colour, with a 2px offset so it is never
  lost against the element's own border. It is defined once, in `main.css`, and
  repeated locally in `interactive-shell.css` so it survives if the shell is
  used without the site stylesheet.
- No keyboard traps. The collapsed menu closes on <kbd>Escape</kbd> and returns
  focus to the button that opened it.
- Card links use one stretched link per card, so a keyboard user gets one tab
  stop where a mouse user gets one large click target — not three tab stops.

**Colour and contrast**

- Body text meets or exceeds 4.5:1 against its background in the dark palette
  the site ships; the ratios are recorded in comments next to the tokens in
  `assets/css/main.css`.
- Colour is never the only carrier of meaning. The five module accent colours
  are always accompanied by a text label, and status is stated in words ("In
  preparation") rather than shown as a coloured dot alone.
- The dark palette is the site's single, permanent theme. It is applied
  unconditionally rather than from `prefers-color-scheme`, so the appearance
  does not change with the browser or operating system colour preference. It is
  contrast-checked throughout.
- `forced-colors` blocks in both `main.css` (site chrome: header, footer,
  navigation, menu toggle, buttons, cards, badges, panels, focus rings, skip
  link) and `interactive-shell.css` (the tool shell) keep boundaries, control
  states and focus indicators visible in Windows High Contrast mode. The two
  blocks are kept separate so either stylesheet can be used without the other.

**Motion**

- `prefers-reduced-motion: reduce` is honoured site-wide, and the shell exposes
  `InteractiveShell.prefersReducedMotion()` so a tool can draw a result in one
  step instead of animating it.

**Zoom and reflow**

- All sizes are in `rem`, so browser font-size settings are respected.
- Layouts reflow to a single column and remain usable at 320px wide and at 400%
  zoom, with no horizontal scrolling of the page.
- Tap targets are at least 44 × 44px, comfortably above the 24 × 24px that
  WCAG 2.2 requires at AA.

**Independence from JavaScript**

- Every page is fully readable and navigable with JavaScript disabled. The
  script adds a collapsible menu and a catalogue-driven listing; without it the
  menu stays open and the statically written content is shown.

## What WCAG 2.2 adds

Version 2.2 added six success criteria to 2.1 and removed one. These are the
ones that bear on this project, and what each means here in practice.

| Criterion | Level | What it requires of us |
| --- | --- | --- |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | A focused element must not be entirely hidden behind other content. The site header is `position: sticky`, so this is a live risk, and it is handled in two places. `html { scroll-padding-top: 5rem; }` in `main.css` keeps a keyboard-focused element clear of the 68px single-row header, rising to `9.5rem` below 29em where the wordmark wraps and the header reaches 145px. Separately, `main.js` closes the collapsed menu whenever a navigation link is activated, because an expanded menu makes the sticky header 450–530px tall. Any tool that adds its own sticky or floating element must make the same provision. |
| **2.5.7 Dragging Movements** | AA | Anything operable by dragging must also be operable by a single pointer without dragging. Native `<input type="range">` satisfies this — it can be clicked at a position and stepped with arrow keys. A custom drag handle drawn on a canvas does not, and needs buttons or a numeric field beside it. |
| **2.5.8 Target Size (Minimum)** | AA | Pointer targets must be at least 24 × 24px, or spaced so a 24px circle around each does not overlap another. The shell sets `min-height: 2.75rem` (44px) on buttons, ranges, selects and choice rows, so this is met with margin to spare. Watch small icon buttons and closely packed chart handles. |
| **3.2.6 Consistent Help** | A | If a help mechanism appears on multiple pages, it must appear in the same relative order. Our "Report a broken link" and documentation links sit in the same footer position on every page; keep them there. |
| **3.3.7 Redundant Entry** | A | Do not make a student re-enter information they have already given in the same session. Rarely relevant here, but a multi-step tool must carry a value forward rather than asking twice. |
| **3.3.8 Accessible Authentication (Minimum)** | AA | Not applicable: this project has no accounts, no logins and no cognitive function tests as a condition of entry. |
| **4.1.1 Parsing** | — | *Removed* in WCAG 2.2. Valid, well-formed HTML is still expected here, but it is no longer a conformance criterion in its own right. |

**2.4.13 Focus Appearance** is a AAA criterion and therefore beyond our target,
but the focus style already in use — a 3px solid outline, offset by 2px, with a
contrast ratio of about 5:1 against the page — meets its substance. There is no
reason to weaken it.

## What every tool must do

Beyond the above, a tool cannot be merged unless:

1. **It is fully keyboard operable.** Native `<input>`, `<button>` and `<select>`
   elements do this for free. If you find yourself adding `role="slider"` to a
   `<div>`, use `<input type="range">` instead — it also settles 2.5.7 for you.

2. **Every graphic has a text equivalent that is not hidden.** The
   `.interactive__readout` block in the shell exists for this: the same numbers
   the chart shows, as text, visible to everyone. A `<canvas>` with no text
   alternative is a blank element to a screen reader. Where a chart carries a
   lot of data, provide a table.

3. **Changes are announced.** Use `shell.announce()` — the shell's polite live
   region, with debouncing so a dragged slider does not flood the queue and
   with a repeat-message workaround so re-running the same action is still
   announced.

4. **Controls are properly labelled.** A real `<label for>` per control,
   `<fieldset>` and `<legend>` for groups, `<output for>` for the current value.
   Use `aria-valuetext` where a bare number is uninformative ("25 cases", not
   "25").

5. **Nothing depends on colour, position or timing alone.** If two series are
   distinguished by colour, distinguish them by shape, pattern or a direct label
   as well.

6. **Nothing depends on hover.** Instructions and values that appear only on
   hover are unavailable to keyboard and touch users. Put them in the page.

7. **Timed tasks provide alternatives.** An untimed practice mode, a stated key
   mapping shown before the block begins, an exit that does not lose the
   explanation, and a non-timed route to the same concept. Nothing flashes more
   than three times per second.

8. **Errors and status are accessible.** An invalid entry is described in text,
   next to the control, and announced — not signalled by a red border alone.

9. **Text stays selectable and zoomable.** No text baked into images (there are
   no images), no `user-select: none` on content, no `maximum-scale` in the
   viewport meta.

## How this is checked

Manual checks, run against every page before merging:

- **Keyboard only.** Unplug the mouse. Tab through the whole page. Confirm every
  control is reachable, focus is always visible and never hidden behind the
  sticky header, the order is sensible, and nothing traps focus.
- **Zoom.** 200% and 400% browser zoom; confirm no horizontal page scrolling and
  no clipped content.
- **Narrow viewport.** 320px wide in device emulation.
- **Screen reader.** At least one of NVDA (Windows), VoiceOver (macOS/iOS) or
  Orca (Linux). Confirm headings form a sensible outline, controls announce
  their name and value, and status messages are read.
- **No JavaScript.** Disable it and confirm the page is still readable.
- **Dark mode.** Switch the OS theme and re-check contrast.
- **Forced colours.** Windows High Contrast, if available.
- **Pointer without dragging.** Confirm every draggable affordance can also be
  operated by clicking or stepping (2.5.7).

Automated checks catch a useful minority of problems and are worth running, but
they are not sufficient on their own:

- The browser's built-in accessibility panel (Firefox and Chrome both have one).
- Lighthouse, axe DevTools, or WAVE.

Because the site is static HTML with no build step, none of these are wired into
CI; they are run by hand and the result is noted in the pull request.

## Known gaps

- No formal third-party audit has been carried out.
- No user testing with disabled students has been carried out yet. This is the
  most valuable thing missing, and offers of help are welcome.
- The site has not been tested with speech-input software (Dragon, Voice
  Control).
- Forced-colours support is now implemented in both `assets/css/main.css` and
  `components/interactive-shell.css`, but has been verified only by checking
  that the rules parse and target the right elements. Neither block has been
  looked at in Windows High Contrast on a real machine.

These are listed rather than glossed over. If you can close one, please do.

## If you meet a barrier

Please report it — a barrier encountered in a real class is the most useful bug
report this project can get.

Open an issue at
<https://github.com/utman5454/open-psychology-interactives/issues> including:

- the page or tool;
- what you were trying to do;
- your browser, operating system, and any assistive technology and version;
- what happened instead.

Accessibility issues are treated as defects, not enhancements.

## Standards referenced

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — Level AA is the target.
- [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
  — the six added criteria and the one removed.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — consulted
  before adding any ARIA. The first rule of ARIA still applies: prefer a native
  element.
