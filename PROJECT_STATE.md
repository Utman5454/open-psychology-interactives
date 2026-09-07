# Project state

The one file to read first. It answers, for whoever opens this repository
next (a person or an AI session), where the project is and how to work on it
without breaking it. Keep it short, keep it current, and update it in the
same commit as any milestone it describes.

Last updated: 2026-09-07 on branch `claude/open-psych-recovery-ibyvho`.

---

## What the product is

**Open Psychology Interactives**: 150 browser-based psychology teaching
activities (75 full-length tools under `modules/`, each with a shorter
Simplified Edition twin under `simplified/`), across five modules, published
as a static site on GitHub Pages and usable offline from a downloaded folder.
MIT licensed. No dependencies, no backend, no accounts, no tracking.

The open collection is complete and live. The current programme of work is
**productisation**: keeping the free collection intact while building a
lecturer-facing product layer around it (discovery, lesson composition, one
student link). See `docs/decisions.md` for the settled decisions and the
"What we are trying next" section below for the plan.

## What is working (verified 2026-09-07)

- Both editions complete: 75 + 75, 1:1 paired, every entry `published`.
- All structural gates pass (see "Checks" below).
- Browser smoke test: 19 representative page loads (including two in embed
  mode and four library pages) at 1280px and 360px with zero console errors, zero failed requests,
  no horizontal scroll, and no site chrome visible in embed mode.
- Library: `library/index.html` searches and filters all 150 activities;
  `library/activity.html` renders any activity's metadata and teaching notes
  (all 150 notes files render through `assets/product/markdown.js` with no
  leftover markup).
- Embed mode: any of the 150 activity pages opened with `?embed=1` hides
  site chrome and posts its content height to a parent frame
  (`{type: "opi:height", height}`).
- Site works from `file://` (tools) and over HTTP (tools plus catalogue-driven
  module listings).

## Last verified milestone

| Milestone | Commit | Date |
| --- | --- | --- |
| Simplified Edition released and documented | `0314e14` (`main`) | 2026-08-27 |
| **Recovery and harness baseline** (this file, `check-all.py`, browser smoke, decisions and lessons logs) | `3580131` (working branch) | 2026-09-07 |
| **Audit, architecture, M0 definition** (`docs/product/`) | `a1264ed` | 2026-09-07 |
| **M0 Stage 1: honest site** (defects D1 to D8) | `ce98a79` | 2026-09-07 |
| **M0 Stage 2: embed mode** (`?embed=1` on any activity page) | `63e8a3d` | 2026-09-07 |
| **M0 Stage 3: library and activity pages** (`library/`, `assets/product/`) | see `git log` | 2026-09-07 |

## Branches

| Branch | Role |
| --- | --- |
| `main` | Published site (GitHub Pages deploys from `main`, root folder). Do not commit productisation work here directly. |
| `claude/open-psych-recovery-ibyvho` | Current working branch for recovery, harness and productisation M0. Started from `main` at `0314e14`. |

A `simplified-edition` branch also exists on GitHub at `e5ee0dd`; it was
merged into `main` (commit `8e8fb50`) and is kept only as history.

No open pull requests or issues on GitHub as of 2026-09-07.

**Persistence in the Claude Code remote environment (2026-09-07).** No
write path to GitHub exists from that environment: `git push` is refused by
the egress proxy (HTTP 403, "Claude doesn't have GitHub access ... for your
organization") and the GitHub API integration is read-only for this
repository (HTTP 403, "Resource not accessible by integration"). Reads work.
Until the owner installs the Claude GitHub App for the repository (or
reconnects GitHub under claude.ai Settings, Connectors), every checkpoint is
exported as a git bundle and a patch series and handed to the owner, who
applies it locally and pushes (see `docs/lessons.md`, L-009). Treat anything
not yet on GitHub as unsaved.

## Checks: what passes and how to run it

One command runs every gate and prints a pass/fail table:

```sh
python3 scripts/check-all.py            # structural gates + gate self-tests (~1 min)
python3 scripts/check-all.py --quick    # structural gates only (seconds)
python3 scripts/check-all.py --lint     # also oxlint via npx (needs network)
python3 scripts/check-all.py --browser  # also Playwright smoke test (needs Chromium)
```

Baseline on 2026-09-07, all passing:

| Gate | What it proves |
| --- | --- |
| `metadata-json` | every `metadata.json` parses and matches its catalogue entry |
| `edition-pairing` | 75 originals and 75 twins, paired 1:1, nav layer intact |
| `simplified-catalogue` | generated catalogue and simplified pages are current |
| `standalone-exports` | the 75 `standalone.html` copies match their sources |
| `export-controls` | every tool page carries the lecturer copy/download block |
| `answer-balance` | no positional or length tell in simplified choice questions |
| `test-edition-pairing` | the pairing gate still catches 17 injected faults |
| `test-answer-balance` | the balance gate still catches 4 injected faults |
| `oxlint` (`--lint`) | 0 errors; 10 warnings are known and non-blocking |
| `browser-smoke` (`--browser`) | representative pages load without console errors |

Run `--quick` before every commit, the default before every push, and
`--browser` after any change to shared CSS, JS or the site pages.

## Architectural invariants (do not change casually)

1. **The 75 original tools are authoritative and stay intact.** Nothing in
   the Simplified Edition or any product layer may change how they behave,
   are listed, or are built.
2. **Every activity is a standalone folder** that works from `file://` with
   no build step, no framework, no CDN, no external font.
3. **Relative paths only** (the single exception is `404.html`). The site
   must work under `/open-psychology-interactives/` and under any other
   sub-path.
4. **Nothing leaves the browser** in the open collection: no analytics,
   telemetry, cookies or third-party requests. Any future product layer that
   stores data must sit outside these folders and be opt-in.
5. **`data/catalogue.json` is the source of truth** for the original edition;
   `data/catalogue-simplified.json` and the simplified index/module pages are
   **generated** by `scripts/build-simplified-catalogue.py` and must not be
   hand-edited. `standalone.html` files are generated by
   `scripts/build-standalone.py`.
6. **Only `status: "published"` entries appear on the site.** Never present an
   unfinished tool as available.
7. **WCAG 2.2 AA** is a merge requirement for every page.
8. **British English** in learner-facing copy; the writing standard is
   `LEARNER_COPY_STYLE.md`.
9. **`.nojekyll` must stay** at the repository root.
10. Module slugs are fixed: `cognitive`, `research-methods`,
    `neuropsychology`, `social-critical-psychology`,
    `personality-individual-differences`.

## Known defects (documentation contradicting the implementation)

Recorded rather than silently fixed, so the fix is a reviewable change.

| # | Where | Problem | Status |
| --- | --- | --- | --- |
| D1 | `CONTRIBUTING.md` status note, `docs/teaching-guide.md` status note | Say "Twelve tools are published, all in Personality" and "other modules are scaffold only". Reality: 75 + 75, all modules complete. | fixed 2026-09-07 |
| D2 | `index.html` line ~123 | "the tools themselves are being written now". All 75 are published. | fixed 2026-09-07 |
| D3 | `modules/*/index.html` badge and `<meta description>` | "N tools published — more in preparation" and "This module is in preparation". No more are in preparation. | fixed 2026-09-07 |
| D4 | `data/catalogue.json` | Every module carries `"status": "in-progress"` and `plannedTopics` lists that are largely delivered; `project.updated` is 2026-08-07 while tools were updated to 2026-08-13. Nothing reads the module status, so this is cosmetic. | fixed 2026-09-07 (`complete`) |
| D5 | `modules/*/tools/README.md` | "All are unclaimed. Open an issue before starting" under planned-topic lists that have since been built. | fixed 2026-09-07 |
| D6 | `CLAUDE.md` "A normal completed tool contains" | Lists three files; a real tool folder has six (`index.html`, `metadata.json`, `teaching-notes.md`, `tool.css`, `tool.js`, `standalone.html`). | fixed 2026-09-07 |
| D7 | `CONTRIBUTING.md` | "There is no CI. Every check is manual." True on GitHub (no workflow), but there are now seven scripted gates; the sentence undersells them. | fixed 2026-09-07 |
| D9 | `docs/teaching-guide.md`, tool pages | Says each tool "carries a Teaching notes panel on the page". 1 of 75 tool pages links its notes, and to a raw `.md`. The 150 teaching-notes files are not reachable from the site. | fixed 2026-09-07: `library/activity.html` renders them |
| D8 | oxlint | 10 warnings (unused variables, `new Array(n)`, two `no-loss-of-precision` literals in `21-multiple-comparisons-fwer-p-hacking/activity.js`). Exit code is 0, so not blocking, but the precision warnings deserve a look. | assessed 2026-09-07: the literals are the standard Lanczos gamma coefficients; loss is in the 17th digit and harmless. No change. |

## What must not be changed casually

- Anything listed under invariants above.
- The generated files (`data/catalogue-simplified.json`,
  `simplified/index.html`, `simplified/modules/*/index.html`,
  `modules/*/tools/*/standalone.html`): regenerate, never hand-edit.
- `components/interactive-shell.*` and `simplified/assets/js/workbook.js`:
  every activity depends on them; a change there needs the `--browser` smoke
  test and a look at several tools of each edition.
- `404.html` root-absolute paths (deliberate, documented in the file).
- The `.gitignore` rules for `/modules/*.md` and `/modules/*/*.md`: local
  brief files live there and must never be committed.
- The product layer (`library/`, `lessons/`, `assets/product/`, `data/lessons/`)
  must never become a runtime dependency of any activity; activities must keep
  working with those folders deleted.

## What we are trying next

Programme: turn the collection into a sellable lecturer product without
harming the free collection. Working sequence:

1. ~~Recover repository, establish baseline, build harness~~ (done).
2. ~~Repository and product audit~~: `docs/product/audit.md` (done).
3. ~~Architecture and M0 definition~~: `docs/product/architecture.md`,
   `docs/product/m0.md` (done).
4. Implement M0 in six stages, one checkpoint commit per stage,
   `check-all.py` green at every commit. Stage status:

   | Stage | Status |
   | --- | --- |
   | 1 Honest site (defects D1 to D8 fixed) | done 2026-09-07 |
   | 2 Embed mode | done 2026-09-07 |
   | 3 Library and activity pages (fixes D9) | done 2026-09-07 |
   | 4 Lesson builder | next |
   | 5 Lesson player | not started |
   | 6 Curated lessons and home page | not started |

Constraints agreed with the owner: no rewrite of the 150 activities; no
student tracking by default; no payment integration in M0; no framework
migration of the content layer; the architecture-subject content (Keziah's
material) is out of scope for M0 but the platform must not be
psychology-specific in its data model.

## How to start, test and recover

**Start**

```sh
git clone https://github.com/utman5454/open-psychology-interactives.git
cd open-psychology-interactives
git checkout claude/open-psych-recovery-ibyvho     # or main for the published site
python3 -m http.server 8000                         # then open http://localhost:8000
```

Nothing to install. Python 3 is needed only for the scripts. Opening
`index.html` from disk also works (module listings then fall back to static
markup).

**Test**

```sh
python3 scripts/check-all.py
```

**Regenerate after changing content**

```sh
python3 scripts/build-standalone.py --all           # after editing any original tool or shared CSS/JS
python3 scripts/build-simplified-catalogue.py       # after editing any simplified metadata.json
python3 scripts/add-export-control.py --all         # after changing the export block markup
```

**Recover**

- Working tree in a bad state: `git status`, then `git stash` or
  `git checkout -- <file>`; never `git reset --hard` on a branch with
  unpushed commits without first `git branch backup/<date>`.
- A gate fails after a content edit: read the gate's own output; the three
  build scripts above are idempotent, so re-running them fixes staleness.
- Generated file edited by hand: re-run its generator; the `--check` mode of
  each script names the offending file.
- Site broken on GitHub Pages but fine locally: almost always an absolute
  path or a missing `.nojekyll`; grep for `href="/` and `src="/`.
- Lost track of the plan: this file, then `docs/decisions.md`, then
  `docs/lessons.md`, then `git log --oneline -20`.
