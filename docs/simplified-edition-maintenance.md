# Simplified Edition — maintenance guide

What you need to know to change the Simplified Edition safely, six months from
now, without reading the whole history.

If you only read one thing, read [The pre-release command
sequence](#the-pre-release-command-sequence) at the bottom. Seven commands,
all exit 0, and between them they catch every failure this edition has actually
had.

Two companion documents cover different ground and are still current:

- [`simplified-edition.md`](simplified-edition.md) — why the edition exists and
  the design decisions behind it.
- [`simplified-edition-integration.md`](simplified-edition-integration.md) —
  how the browsing layer was built, and the reasoning behind each gate.

---

## Directory structure

```
simplified/
├── index.html                    GENERATED. The edition landing page.
├── assets/
│   ├── css/
│   │   ├── simplified.css        design tokens and the workbook shell
│   │   ├── patterns.css          optional activity patterns
│   │   └── edition.css           browsing chrome and activity navigation
│   └── js/
│       ├── workbook.js           the activity controller
│       ├── edition-nav.js        breadcrumb and previous/next, at runtime
│       └── stats.js              shared statistics helpers
├── template/                     NOT an activity. Scaffolding to copy.
│   ├── index.html                the skeleton
│   ├── activity.js               its wiring
│   ├── patterns.html             every optional pattern, as a reference sheet
│   └── README.md                 the markup contract and the shell's API
└── modules/<module-slug>/
    ├── index.html                GENERATED. The module landing page.
    └── tools/<tool-slug>/
        ├── index.html            the activity page
        ├── activity.js           its model and wiring
        ├── metadata.json         the catalogue record
        └── teaching-notes.md     educator guidance
```

Plus, outside `simplified/`:

```
data/catalogue-simplified.json    GENERATED. The edition's index.
.oxlintrc.json                    the JavaScript lint gate
scripts/build-simplified-catalogue.py   generates the four GENERATED things above
scripts/check-edition-pairing.py        the drift gate
scripts/test-edition-pairing.py         fault injection for the drift gate
scripts/check-answer-balance.py         the answer-placement gate
scripts/test-answer-balance.py          fault injection for that gate
```

**Never hand-edit anything marked GENERATED.** Seven files are generated from
the 75 `metadata.json` files: the catalogue, the edition landing page and the
five module pages. Editing one by hand works until the next run of the
generator, which silently reverts it. `--check` catches it before that happens.

The five module slugs are canonical and identical in both editions:
`cognitive`, `research-methods`, `neuropsychology`,
`social-critical-psychology`, `personality-individual-differences`.

## Metadata, and `pairedWith`

`simplified/modules/*/tools/*/metadata.json` is the **only** source of truth
for the edition. Nothing in the catalogue or on a module page is maintained by
hand.

Beyond the fields in the project metadata standard (see `CLAUDE.md`), a
simplified activity carries four of its own:

| Field | What it must be |
| --- | --- |
| `edition` | Exactly `"simplified"`. The generator rejects anything else. |
| `pairedWith` | The **bare tool slug** of the original twin, e.g. `01-posner-spatial-cueing`. Not a path. |
| `originalPath` | `modules/<moduleSlug>/tools/<pairedWith>/index.html`, and it must agree with `pairedWith`. |
| `scopeNote` | What this version keeps and what it leaves to the original. Written for a colleague deciding which to set. |

**The pairing is 1:1 and total.** Every one of the 75 originals is claimed by
exactly one simplified activity, and every simplified activity claims an
original that exists on disk. The generator refuses to build if an original is
claimed twice or left unclaimed, so a pairing mistake stops the build rather
than reaching the site.

`pairedWith` must name an original **in the same module**. A simplified
cognitive activity cannot pair with a research-methods original.

`status` must be `"published"` for an activity to be listed. All 75 are. The
generator currently also accepts `"draft"`; `"planned"` and `"in-progress"` are
hard errors rather than silent omissions, because an activity that exists on
disk but is missing from its module page is a worse failure than a loud one.

## How the catalogue is generated

```sh
python3 scripts/build-simplified-catalogue.py           # write
python3 scripts/build-simplified-catalogue.py --check    # verify, write nothing
```

It reads the 75 metadata files, validates the whole structure, and only then
writes seven files:

- `data/catalogue-simplified.json`
- `simplified/index.html`
- `simplified/modules/<slug>/index.html` × 5

Validation runs **before** any write, so an invalid edition cannot produce a
catalogue at all. It checks the total is 75, the per-module counts are
21/12/12/18/12, ids and paths are unique, each file's `moduleSlug` and
`toolSlug` agree with where it actually sits, `edition` is `simplified`, every
activity has an `index.html` beside its metadata, every `pairedWith` resolves
to exactly one original in the same module, `originalPath` agrees with
`pairedWith`, no original is claimed twice, and none is left without a twin.

`--check` regenerates everything in memory and reports any file that differs.
**Run it in CI or before every release**: it is what catches a hand-edited
module page.

### Why the module pages are written out rather than fetched

The original edition's module pages fetch `data/catalogue.json` at runtime.
This edition's are generated in full: no JavaScript, no fetch, no origin. That
keeps an activity folder working from a download with no server, and makes it
impossible for a page to disagree with the catalogue, because both come from
the same run.

The catalogue is still a real loadable artefact — `edition-nav.js` reads it at
runtime for previous and next, which is the one lookup that genuinely has to
happen live.

## How activity navigation works

`simplified/assets/js/edition-nav.js` is loaded by all 75 activity pages and
adds exactly two things:

1. a **breadcrumb** above `<main>`: Simplified Edition / module name;
2. a **previous / module / next strip** at the foot of `<main>`.

Previous and next are resolved at runtime by fetching
`data/catalogue-simplified.json` and finding the activity's neighbours in
catalogue order, which is teaching order. At a module boundary the missing
neighbour is left as an empty cell so the module link stays centred.

It is an enhancement and fails safe: from `file://`, or if the fetch fails, the
breadcrumb and module link still render and only previous/next are omitted.

Every activity must carry these two lines at the end of its `<head>`:

```html
<link rel="stylesheet" href="../../../../assets/css/edition.css">
<script src="../../../../assets/js/edition-nav.js" defer></script>
```

`check-edition-pairing.py` fails if any activity is missing the script.

> **The styles for the injected strip live in `edition.css`, far from the
> markup that needs them.** Nothing links the two, so deleting that section
> leaves a page that still links correctly and looks broken. This has happened
> once: the whole activity-chrome block was removed during an unrelated CSS
> edit and every activity shipped its navigation as bare 19px anchors, past
> every gate, because the gates tested that the links *resolved*. If you touch
> `edition.css`, check a rendered activity foot, not just the link targets.

## The answer-balance gate

```sh
python3 scripts/check-answer-balance.py            # report and gate
python3 scripts/check-answer-balance.py --verbose  # every question listed
python3 scripts/test-answer-balance.py             # prove the gate still bites
```

A learner who notices that the best-supported answer is usually the first one
has learned something about the collection rather than about psychology. The
first run of this check found the correct answer in position 1 in **25 of the
26** questions it could see, and the longest option correct in 46 per cent.
Both are invisible in any single activity and obvious in aggregate.

The gate measures the two properties that are mechanically checkable:

| Threshold | Value | Meaning |
| --- | --- | --- |
| `MAX_POSITION_SHARE` | 0.40 | No answer position may hold more than 40% of the answers |
| `MAX_LENGTH_RATIO` | 1.25 | The correct answer may not average more than 1.25× its distractors |
| `MIN_QUESTIONS_FOR_SHARE` | 8 | Below this many questions the shares are noise |

It also requires that, for each option-list width, every position is used
somewhere, and that a multi-round activity does not answer in the same position
every round.

**It deliberately does not judge whether a distractor is plausible.** No script
can, and padding a list with weak options to make the positions come out evenly
would be a worse fault than the bias it fixed.

**If you add a choice question**, run the check. If it fails, reorder options —
move only the correct one and leave the distractors in their relative order,
because that order is sometimes doing work (a magnitude scale, a
narrow-to-broad progression). Never shuffle at runtime: the order is static in
markup on purpose, so it is reviewable.

Nothing in the edition indexes choices by position; verdict maps are keyed by
`data-choice` name, so reordering is purely presentational. Verify that before
reordering anything new.

## Oxlint complexity requirements

```sh
npx --yes oxlint@1.80.0        # from the repository root
```

Nothing is installed: no `package.json`, no lockfile, no `node_modules`. The
site still ships zero dependencies. `ignorePatterns` in `.oxlintrc.json`
confines it to `simplified/`; the 75 originals are authoritative history and
are not linted.

Three rules are **errors**:

| Rule | Setting | Why |
| --- | --- | --- |
| `complexity` | max 10 | Cyclomatic complexity per function |
| `max-depth` | max 4 | Block nesting; ESLint's own default |
| `no-redeclare` | error | Added after it caught a real bug: a `verdict()` helper in a file that already had `var verdict = document.getElementById("verdict")`. Silent at parse time, fatal at run time. |

The `correctness` category runs as warnings. Those are advisory; the three
rules above are the gate.

**The threshold is a prompt to look, not a number to satisfy.** When the gate
went in, 2,865 functions were linted and six exceeded 10. The tail was thin,
not systemic, so the fix was seven named extractions at real seams — compute
versus render, judge a response versus advance the trial, run one study versus
run a thousand — never wrapper functions invented to move a number. Where
complexity is genuinely the shape of the problem, use a named seam a reader
gains something from, or an `oxlint-disable-next-line` carrying the reason.
**Learner-facing copy is never rearranged to satisfy the linter.**

## Pairing and drift checks

```sh
python3 scripts/check-edition-pairing.py           # the two editions in step
python3 scripts/test-edition-pairing.py            # prove the gate still bites
```

The two editions share no runtime code and are built from separate trees, so
nothing stops one changing shape without the other. `check-edition-pairing.py`
re-derives everything from the files as committed — independently of the
generator, so a hand-edited catalogue is caught rather than trusted — and
verifies the 1:1 pairing in both directions, the per-module counts, the
navigation layer being loaded by all 75 activities, the module names and
relative paths inside `edition-nav.js`, and the entry point and module counts
on the site's home page.

It is deliberately **structural**. It does not compare wording, learning
objectives or behaviour between an activity and its twin, and should not: an
activity that keeps its pairing while diverging in content is doing exactly
what a simplified edition is for.

### Why there are two fault-injection scripts

`test-edition-pairing.py` and `test-answer-balance.py` break one thing at a
time in a throwaway copy and assert that the corresponding check notices — 17
faults and 4 faults respectively. A gate that only ever runs against a healthy
repository is untested code: it exits 0 whether it is working or has quietly
stopped looking, and the day it stops looking is the day it is needed. Neither
script touches the repository.

## Browser QA expectations

The Python gates are structural. They cannot see a rendered page, and the
edition's two worst defects were both invisible to them. Before a release,
open a browser.

**Serve under the Pages base path, not at `/`.** `404.html` uses root-absolute
paths beginning `/open-psychology-interactives/`, so serving at the root
resolves links differently from production:

```sh
# from a directory containing a symlink or copy named open-psychology-interactives
python3 -m http.server 8123 --bind 127.0.0.1
# then http://127.0.0.1:8123/open-psychology-interactives/simplified/index.html
```

Check at **1440, 1024, 768, 375 and 320**, and **look at the screenshots**, not
only at DOM geometry:

- no horizontal scroll, and nothing clipped by a container that hides overflow;
- no text wider than the box painting it;
- SVG text inside its `viewBox` — `.hero` sets `overflow: hidden`, so an
  overrun is cut off mid-word rather than merely untidy;
- no shape painted over a label, and no computed fill of black (an SVG shape
  with no fill from any source paints black, so give every shape a `fill`
  attribute as well as its class);
- two card columns at desk and tablet width, one at phone width;
- one focus target per card, with a visible focus ring — the edition puts the
  ring on the enclosing card or label via `:has(a:focus-visible)`, so check the
  ancestor, not just the focused element;
- `prefers-reduced-motion` stopping every animation and leaving a meaningful
  figure, not an empty one;
- previous/next rendering as styled targets, not bare links (see the warning
  under [navigation](#how-activity-navigation-works));
- zero console errors on all 75 activities.

**Drive at least one activity per module through its actual mechanism**, not
just its page load. A timed task, a simulation, a figure-heavy page, a
quantitative slider and a lens-based cascade each fail differently.

Two traps worth knowing when scripting this:

- Some activities are **staged**: a control present in the markup is not
  reachable until an earlier step has been taken. Follow the activity's own
  sequence.
- A performed task may **reject implausibly fast responses**. The Stroop
  activity discards anything under 200 ms as an anticipation, so a script that
  clicks instantly gets "not enough usable trials" — which is correct
  behaviour, not a bug. Insert a human-plausible delay before responding.

## Adding or modifying a simplified activity

### Adding one

1. Copy `simplified/template/index.html` and `activity.js` into
   `simplified/modules/<module-slug>/tools/<tool-slug>/`.
2. **Change the three asset paths** in `<head>` from `../assets/…` to
   `../../../../assets/…`. A real activity sits four levels below
   `simplified/`; the template sits one. Getting this wrong still works from
   disk in some browsers and 404s on Pages, so check it under a served
   sub-path.
3. Add the two integration lines to the end of `<head>` (see
   [navigation](#how-activity-navigation-works)).
4. Drop the template's `.notice--caution` banner and replace everything in
   square brackets.
5. Write `metadata.json`, including `edition`, `pairedWith`, `originalPath` and
   `scopeNote`.
6. Write `teaching-notes.md` to the project standard.
7. Run `python3 scripts/build-simplified-catalogue.py` so the activity appears
   in the catalogue and on its module page.
8. Run the full sequence below.

Read `simplified/template/README.md` first. It carries the markup contract, the
shell's API and the patterns available.

The three governing rules for the edition are in
[`simplified-edition.md`](simplified-edition.md) and are not restated here, but
the short version is: **the originals stay intact; preserve the mechanism and
simplify the surrounding lesson; know when to stop.**

### Modifying one

- Changing **only** an activity's own files needs no regeneration, unless you
  touch a metadata field the catalogue copies: `title`, `summary`,
  `readmeTopic` (it becomes `teachingJob` in the catalogue and the one-line
  description on the module page), `topics`, `estimatedMinutes`, `difficulty`,
  `status`, `version`, `lastUpdated`, `pairedWith` or `originalPath`. If in
  doubt, regenerate and let `--check` tell you whether anything moved.
- Bump `version` and `lastUpdated` in `metadata.json`.
- If you changed a model or its numbers, **verify the claims the prose makes
  about it**. Comments and copy quoting a figure go stale silently.
- If you changed choice options, run the answer-balance gate.
- If you changed `edition.css`, look at a rendered activity foot as well as a
  browsing page.
- Never edit a generated file. Change the metadata and regenerate.

### What must not change

The 75 originals under `modules/` are authoritative history.
`python3 scripts/build-standalone.py --all --check` returning 75/75 is the
standing proof that nothing in this edition has disturbed them. If that fails,
stop.

## The pre-release command sequence

All seven exit 0. Run them in this order; the cheap ones fail fastest.

```sh
npx --yes oxlint@1.80.0                                 # no complexity, nesting or redeclare errors
python3 scripts/check-answer-balance.py                 # no positional or length tell
python3 scripts/test-answer-balance.py                  # that gate still bites
python3 scripts/build-simplified-catalogue.py --check   # catalogue and pages current
python3 scripts/check-edition-pairing.py                # the two editions in step
python3 scripts/test-edition-pairing.py                 # the drift gate still bites
python3 scripts/build-standalone.py --all --check       # the original 75 untouched
```

Then the browser pass described above. A green sequence with no browser pass
has, historically, still shipped a visibly broken page.
