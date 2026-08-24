# The Simplified Edition

A parallel edition of the collection: the same psychology, in shorter
activities with a lighter interaction burden and a different visual language.
Roughly 3–7 minutes of learner work each, against the original edition's
15–30.

This file records the architectural decisions that are **settled**. It is not
a plan for the edition's content. Decisions still open are listed at the end.

**Status: foundations only.** The shared shell, the optional patterns, the
activity mechanics and a template exist. No activities, no catalogue and no
navigation pages have been built yet.

---

## The rule everything else follows

> The original 75 interactives are the authoritative versions and must stay
> intact. Nothing in the Simplified Edition may change how they behave, how
> they are listed, or how they are built.

Every decision below is downstream of that.

---

## The second rule: preserve the mechanism, simplify the lesson

> **Preserve the mechanism; simplify the surrounding lesson.**
>
> The Simplified Edition should keep strong simulations, visualisations,
> demonstrations and applied exercises from the originals. Simplification
> should mainly reduce the number of stages, controls, cases, questions and
> secondary teaching jobs **around** that core mechanism.
>
> The Simplified Edition is not a conversion to a standard quiz or workbook
> interaction. Each activity keeps the interaction form best suited to its
> psychological concept.

The collection's value is concentrated in roughly 2.9 MB of hand-built
`tool.js` — the models, simulations and demonstrations that a static page
cannot do. Converting those into multiple choice would discard exactly what
makes the tools worth having, and would make every activity look the same,
which the golden reference pack warns against in as many words: *"Do not turn
every activity into the same interaction. Preserve useful differences between
prediction tasks, demonstrations, lens switches, evidence judgements,
consequence chains, and recap activities."*

Three of the seven golden references present no choices at all. The choice
grid in `patterns.css` is one pattern among seventeen, not the house style.

### What this means for the four verdicts

| Verdict | Meaning under this rule |
| --- | --- |
| **KEEP** | The mechanism and its density are already right. Port it; rewrite the copy around it. |
| **SIMPLIFY** | The default. Mechanism retained and still live. Fewer rounds, cases, controls, stages and explanatory sections around it. |
| **REBUILD** | Rare. The *interaction* is genuinely wrong for the length — never a working model discarded because a quiz would be quicker to write. |
| **REPLACE** | Narrows the **lesson's scope**: the simplified activity does one part of what the original did and says so, linking to the original for the rest. Never narrows the mechanism. |

### The test to apply before cutting a control

Ask whether the control belongs to the model or to the lesson around it.

- A control that changes **what the learner is entitled to conclude** is part
  of the mechanism. Keep it. The precision slider in Double Dissociation
  Detective and the shared-versus-zoomed scale in the Central Limit Theorem
  Simulator are both of this kind: remove them and the activity still runs,
  but it stops teaching the thing it exists to teach.
- A control that adds **a fourth thing to notice** is part of the lesson.
  Cut it.

Downgrading a live manipulable model into a static synthesis diagram counts
as losing the mechanism, not as simplifying it.

---

## The third rule: know when to stop

> Once the learner has experienced the key mechanism and the concept has been
> clearly explained, the activity should end.
>
> Do not add another challenge, transfer case, reflection, quiz, secondary
> concept or extra visual simply because there is room for one.

A simplified activity should normally stop when all four of these are true:

1. the learner has done the thing that reveals the concept;
2. they have seen the important pattern or consequence;
3. a brief explanation makes the inference clear;
4. any essential limitation or caveat has been stated.

Anything after that point has to earn its place by materially improving
understanding. "There was space on the page" is not a reason, and neither is
symmetry with another activity.

This is the rule most likely to be broken by accident, because every addition
looks defensible on its own. The three tests that catch it:

- **Would removing this change what the learner understands?** If not, remove
  it.
- **Is this a second teaching job wearing the clothes of a first?** A transfer
  case is a new case. A reflection prompt is a new task. A second diagram is a
  second argument.
- **Does it arrive after the caveat?** Once the limitation has been stated,
  the activity has finished its argument. Material after that is almost always
  padding.

Note how this interacts with the second rule. Preserving the mechanism is not a
licence to preserve everything attached to it: the mechanism earns its place
automatically, and each thing around it has to earn its place separately.

---

## Copy conventions

`LEARNER_COPY_STYLE.md` is the governing standard for the whole collection and
applies here unchanged. Two points are worth restating because they are easy to
miss in a simplified activity.

**No em dashes in learner-facing copy.** Use a comma, a colon, a semicolon or a
full stop. An em dash is usually a joint between two thoughts that would read
better as two sentences, or as one sentence with a colon doing the work. This
applies to every string a learner can see: page copy, option labels, feedback,
diagram labels, live-region announcements and status text. It does not apply to
developer comments, teaching notes, metadata or the files in `docs/`.

**British English throughout**, and `lang="en-GB"` on every page.

---

## 1. A parallel tree, sharing nothing at runtime

The edition lives entirely under `simplified/`:

```
simplified/
├── assets/
│   ├── css/simplified.css      design tokens and the workbook shell
│   ├── css/patterns.css        optional visual patterns
│   └── js/workbook.js          shared activity mechanics
├── template/                   the skeleton to copy, and a pattern gallery
└── modules/<module-slug>/tools/<tool-slug>/    (not built yet)
```

**Considered and rejected:**

- *A `simple.html` beside each existing `index.html`.* Pollutes the
  originals, muddies the promise that downloading one tool folder gives you a
  working tool, and makes the export check noisy.
- *A separate repository.* Forbidden by `CLAUDE.md`, and it would lose
  side-by-side hosting under one Pages site.
- *Extending `assets/css/main.css` with a light palette.* The original
  edition is permanently dark (`--colour-page: #0f141b`). Two palettes in one
  file is how you end up with dark text on a light card six months later.

### Why the tree location matters mechanically

Three pieces of existing machinery are scoped by path, and `simplified/` is
outside all three:

| Machinery | Scope | Effect |
| --- | --- | --- |
| `scripts/build-standalone.py` | `modules/*/tools/*/index.html` | anchored at the repository root, so `simplified/modules/…` is not matched |
| `scripts/add-export-control.py` | the same glob | likewise |
| `assets/js/main.js` | fetches `data/catalogue.json` only | cannot render a simplified entry onto a classic module page |

Had simplified activities been placed under the root `modules/` tree,
`build-standalone.py --all` would have tried to build exports for them and
`--all --check` — the repository's one CI guard — would have gone permanently
red.

### No shared runtime code with the original edition

A simplified page must not load `assets/css/main.css`,
`components/interactive-shell.css`, `components/tool-kit.css` or
`components/interactive-shell.js`. The palettes are incompatible and the
markup contracts differ.

What *is* reused is the thinking, re-implemented: the live-region and
`bindRange` ideas from `interactive-shell.js`, and the catalogue loader's
`file://` guard, `published` filter and `data-site-root` resolution from
`main.js`. `LEARNER_COPY_STYLE.md` applies unchanged — the Simplified Edition
is that standard taken to its conclusion, not a different philosophy.

---

## 2. Standalone exports

**Phase 1 ships no `standalone.html` files for simplified activities, and no
exporter.**

To be precise about why, because an earlier draft of this reasoning was
wrong: a simplified `index.html` that links `simplified.css`, `patterns.css`
and `workbook.js` is **not** self-contained. It is the maintainable website
source, and it depends on three shared files.

That is acceptable for Phase 1 because the edition is being served from this
site, where those files are always present. It is *not* a substitute for an
export. A genuinely standalone copy — one that survives being pasted into a
VLE page or opened from a memory stick on its own — has to inline all three,
exactly as `build-standalone.py` does for the original edition.

A dedicated Simplified Edition exporter may be added later. It is deliberately
**not** implemented now. When it is, it should be a separate script rather
than an extension of `build-standalone.py`, whose selector-scoping and
refusal rules are tuned to the original edition's four stylesheets.

---

## 3. Naming and routing

| | Convention |
| --- | --- |
| URL | `/open-psychology-interactives/simplified/modules/<module-slug>/tools/<tool-slug>/` |
| `moduleSlug` | identical to the original |
| `toolSlug` | identical to the original, so the two editions pair trivially and a link flips by inserting or removing `simplified/` |
| catalogue `id` | `simplified--<tool-slug>`, keeping ids globally unique if the two catalogues are ever merged |
| new metadata fields | `edition: "simplified"`, `pairedWith`, `originalPath` |
| `estimatedMinutes` | 3–7 |
| depth back to `simplified/` | `../../../../` from an activity — a constant, mirroring the original edition's convention |
| DOM ids | namespaced per activity; never the references' bare `id="a"`, `id="t"`, `id="d"` |

The catalogue will be a **separate file**, `data/catalogue-simplified.json`,
on the same schema. `data/catalogue.json` is not to be touched. Two current
invariants hold across all 75 original tools and must hold in the new edition
too: `id` equals `toolSlug`, and each `metadata.json` is field-for-field
identical to its catalogue entry.

---

## 4. The visual system

Derived from the golden references in `docs/simplified-reference/`, which are
read-only exemplars and must not be edited.

Warm off-white page (`#F5F2ED`) under two faint radial washes, white rounded
cards, navy text (`#1A2744`), teal as the working accent (`#1C7293`), blue as
a secondary (`#3D5A80`), gold as a highlight only (`#D4A853`), and a single
980px workbook column. Structure: hero → progress → activity card → reveal →
actions → synthesis → takeaway. One breakpoint.

**Class names are the references' own** for static structure, so a golden
example could plausibly have been authored against this shell. Interactive
*state* is the one departure: it moves from classes (`.active`, `.done`,
`.correct`, `.wrong`) to `data-state`, because each state also needs a glyph,
a border style and a text label that only JavaScript can keep in step. The
full mapping is in `simplified/template/README.md`.

Two further departures from the references, both deliberate:

- **Lengths are in `rem`.** At default settings this renders identically;
  when a reader raises their browser font size, the layout follows. The
  references are fixed at `px` throughout, which pins the text.
- **`Inter` is dropped from the font stack.** The references name it first
  but never load it, so it silently falls through to the system UI font
  almost everywhere. Naming a font we do not ship is misleading, and shipping
  one would mean either a network request or a bundled licence — both against
  the project's rules.

---

## 5. Accessibility

The golden references define the visual and pedagogic target. **They are not
the accessibility baseline.** Across all seven: no focus styles at all, no
`prefers-reduced-motion` handling despite an unconditional smooth scroll in
every file, `lang="en"` rather than `en-GB`, no skip link, correct and
incorrect signalled by colour alone, options `disabled` after answering
(which drops them from the tab order), an unadjustable one-second exposure
with no untimed alternative, silent failure on out-of-range numeric entry,
and a progress strip that assistive technology is told nothing about.

This project holds WCAG 2.2 AA as a merge requirement, not a follow-up
(`docs/accessibility.md`, `CONTRIBUTING.md`). The shared shell therefore adds
what the references lack, once, so that no activity has to remember:

- `:focus-visible` rings in a hue used for nothing else, offset so the ring
  is drawn on the background rather than on the accent it surrounds;
- a global reduced-motion block, and a motion check inside every
  `workbook.js` scroll;
- `aria-disabled` in place of `disabled` for answered options, with
  activation swallowed by a delegated listener, so a locked option stays
  reachable and re-readable;
- three signals per state — hue, border style, and a corner glyph — plus a
  visually hidden sentence naming it;
- the progress strip as a labelled `<ol>` with `aria-current="step"` and a
  hidden "completed" note on finished steps;
- a single polite live region per activity, written through `announce()`,
  which clears before writing so a repeated message is announced again;
- `min-height: 2.75rem` on interactive controls (WCAG 2.2 SC 2.5.8 asks 24px;
  44px is more comfortable on a projector and under touch);
- a skip link, `.visually-hidden`, and a forced-colours block.

### Colour

Every pairing in the palette was measured rather than eyeballed, and the
reasoning is recorded in the token block of `simplified.css`. Three
consequences are worth knowing before adding anything:

- **Gold is never a text colour.** `#D4A853` is 2.2:1 on white. It is used
  for fills, tints and decorative marks only.
- **Gold has a border-safe sibling, `--gold-strong` (`#9E7318`).** The
  reference files draw gold edges at 18–45% alpha, which lands around 1.9:1
  against the tint they sit on — below the 3:1 that WCAG 2.2 SC 1.4.11 asks
  of a boundary carrying meaning. Anywhere a gold line means something — the
  border of an incorrect option, of a completed step, of a flagged notice —
  uses `--gold-strong`, which clears 3:1 on white, on `--page` and on
  `--gold-light`. `--gold` stays for the page wash, the hero's decorative
  ring and the step-label dot, none of which carry meaning.
- **Green has the same split.** `--green` is a graphic colour at 4.4:1 on its
  own tint; `--green-strong` is the text-safe variant at 6.3:1.

One judgement call, recorded rather than hidden: the *resting* border of an
`.option` is `--border` (`#DDD8CF`), well under 3:1 against the white card.
SC 1.4.11 applies to visual information required to identify a component or
its state, and a resting option is a `<button>` with a visible text label —
its role and name identify it without the edge. Raising that border to 3:1
would mean a mid-grey outline on every card and would lose the reference
look entirely. The *state* borders are a different matter, which is why they
were raised. If this call is ever revisited, this is the paragraph to argue
with.

---

## 6. What is deliberately not decided yet

- The Simplified Edition landing page and module pages.
- `data/catalogue-simplified.json` and its loader.
- Whether, and when, the original edition's pages link across to their
  simplified twins. Adding that link is a 76-file edit to the originals and
  should wait until the edition is broad enough to be worth pointing at.
- Whether the Simplified Edition appears in the site's main navigation.
- A `404.html` entry for the new tree.
- The exporter described in section 2.
- How the two editions are kept from drifting apart when a factual correction
  lands in only one of them. `pairedWith` is the hook; the check is not
  written.
