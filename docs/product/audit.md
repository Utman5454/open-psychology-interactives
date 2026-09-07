# Repository and product audit

Date: 2026-09-07. Basis: the repository at `main` `0314e14`, every gate run,
13 pages loaded in headless Chromium at desktop and phone widths, and a
sample of activities read in full across both editions (research methods
08, cognitive 06, personality 12, neuropsychology 01, social 08, plus their
Simplified twins). Where a claim rests on sampling rather than a check that
ran over every file, it says so.

---

## Part A: what is actually here

### Architecture

A static site with no build step, published from `main` by GitHub Pages
under `/open-psychology-interactives/`. Two editions share a repository and
nothing else at runtime:

| | Original edition | Simplified Edition |
| --- | --- | --- |
| Location | `modules/<slug>/tools/<slug>/` | `simplified/modules/<slug>/tools/<slug>/` |
| Files per activity | `index.html`, `tool.js`, `tool.css`, `metadata.json`, `teaching-notes.md`, `standalone.html` (generated) | `index.html`, `activity.js`, `metadata.json`, `teaching-notes.md` |
| Shared runtime | `assets/css/main.css` (1200 lines), `assets/js/main.js`, `components/interactive-shell.{css,js}`, `components/tool-kit.css`, plus three optional helpers (full screen, copy activity, learner help) | `simplified/assets/css/{simplified,patterns,edition}.css`, `simplified/assets/js/{workbook,stats,edition-nav}.js` |
| Visual language | dark theme, single permanent palette | warm light "university workbook" |
| Listing | `data/catalogue.json` (hand-maintained, source of truth); module pages fetch it and fall back to static cards | `data/catalogue-simplified.json` and all six browsing pages generated from the 75 `metadata.json` files |
| Size | 17 MB (about 2.9 MB of hand-written `tool.js`; the rest is the generated `standalone.html` copies) | 3.9 MB |

The activities are 75 pairs: 12 cognitive, 21 research methods, 12
neuropsychology, 12 social and critical, 18 personality. Every entry is
`published`. Estimated minutes: originals 15 to 30, twins 5 to 7. Difficulty
labels: 13 introductory, 46 intermediate, 16 advanced (originals).

### Quality of the activities (sampled)

High, and consistent. Each sampled original has a stated objective, a
prediction gate before the laboratory opens (59 of 75 declare "prediction
before reveal" in metadata), a seeded simulation or structured judgement
task, live text readouts paired with every graphic, a select-all or
classification challenge with explanatory feedback, and separate "what this
demonstrates" and limitations sections. The statistics and psychology in the
sampled tools are correct and carefully hedged (the p-value simulator never
prints .05; the minimal-group tool separates "ahead" from "better off"). The
Simplified twins genuinely keep the mechanism and cut the lesson, as the
edition's rules require. Copy quality is unusually good and follows a
1300-line house style (`LEARNER_COPY_STYLE.md`).

### Teaching notes: the hidden asset

Every one of the 150 activities has a `teaching-notes.md` of real
substance: a from-the-front demonstration script, timings for three
settings, the prediction question with the instructive wrong answer called
out, debrief questions, a misconceptions table with responses, and
limitations. This is the material a lecturer would pay for, and **it is not
on the site**. One tool page of 75 links to its notes, and that link points
at a raw `.md` file. The notes are reachable only by browsing GitHub. The
teaching guide's statement that each tool "carries a Teaching notes panel on
the page (collapsed by default)" is false for 74 of 75 tools (defect D9).

### Shared components and metadata

`interactive-shell.js` is a small, well-documented accessibility helper
(live region with debounce and repeat workaround, range/output binding,
reset wiring, reduced-motion query). Every original is written against it.
`workbook.js` plays the same role for the Simplified Edition. Metadata is
rich and consistent: all 75 original `metadata.json` files are identical to
their catalogue entries (checked by the new `metadata-json` gate), with
extra fields the docs do not list (`dataStatus`, `simulationNotes`,
`itemSource`, `readmeTopic`). Simplified metadata adds `pairedWith`,
`originalPath`, `teachingJob` and `scopeNote`. There are 539 distinct topic
keywords across the originals, too many to facet directly but good for
search.

### Scripts and checks

Seven Python scripts, all working, all documented in their own docstrings:
two generators (standalone exports, simplified catalogue and pages), one
page-editing tool (export controls), two gates (edition pairing, answer
balance) and two fault-injection self-tests for those gates. Oxlint runs via
a pinned `npx` invocation. There is no CI on GitHub. `scripts/check-all.py`
now wraps all of it.

### Learner journey (as a student today)

A student arrives by a URL a lecturer gave them, lands on a full tool page
with site header, breadcrumb, objective, prediction, laboratory, challenge,
debrief, lecturer export controls and a footer. On a phone the full tool is
long but usable; the Simplified twin is far better suited to a phone. There
is no way for a student to know which of the two editions they should be on,
what they should do after the activity, or what the lecturer wants from them.
Nothing is stored, which is a promise the site keeps and states.

### Lecturer journey (as a lecturer today)

Home page, module card, module page listing, tool page. Then: read it, work
out how to run it from the notes (if they find them on GitHub), copy the URL
into a VLE, or press "Copy activity HTML" and paste the standalone fragment
into a VLE page. There is no search across the collection, no filter by
duration, level or interaction type, no per-activity preview or screenshot,
no way to collect several activities, no way to attach instructions or
questions, and no way to produce a single link that carries any of that.

### Documentation

Extensive and mostly accurate on mechanism, stale on status. `README.md`
is current. `CONTRIBUTING.md`, `docs/teaching-guide.md`, the five module
pages' badges and meta descriptions, the home page's "being written now",
the catalogue's module `status` fields and the module `tools/README.md`
files all describe an earlier state (defects D1 to D7 in
`PROJECT_STATE.md`). The Simplified Edition documents are current and
unusually good on rationale.

### Technical debt

- The two editions have two separate design systems (two token sets, two
  shells, two colour worlds). This was a deliberate decision recorded in
  `docs/simplified-edition.md`, and it works, but it doubles the surface any
  product chrome has to sit on.
- `standalone.html` copies are 13 MB of committed generated output. Correct
  by construction (the `--check` gate), but every shared CSS change
  regenerates 75 files.
- The original module pages hold 75 static fallback cards that duplicate the
  catalogue. Correct today; a manual step every time an entry changes.
- Ten oxlint warnings, including two `no-loss-of-precision` literals worth a
  look (D8).
- The `12-alpha-trap` tool predates `tool-kit.css` and carries its own copy.
- No automated accessibility check; the standard is applied by hand and by
  convention (which the sampled pages honour: skip links, landmarks, labels,
  live regions, `forced-colors` rules, reduced motion, 44px targets).

### Accessibility and test coverage

Accessibility is a genuine strength and is documented honestly (`docs/
accessibility.md` lists what has not been tested: screen-reader passes on
every page, speech input, real Windows High Contrast, users with
disabilities). Test coverage is structural (the gates) plus the new browser
smoke test; there are no behavioural tests of any activity's logic.

---

## Part B: product assessment

### What is unusually valuable

1. **Correctness under scrutiny.** The activities are written by someone who
   teaches this and knows where students go wrong. Most "interactive
   psychology" products on the market are quiz engines with a gloss; these
   are mechanism demonstrations with honest limitations. A methods lecturer
   will notice within a minute.
2. **The teaching notes.** 150 ready-to-run session scripts with debrief
   questions and misconception tables. Currently invisible.
3. **Two lengths of every topic**, which maps onto real teaching formats:
   the twin for a lecture demonstration or phone-based revision, the
   original for a lab or seminar.
4. **Portability and privacy.** No account, no tracking, works offline and
   in a VLE page via a scoped standalone copy. For a university procurement
   conversation this is a feature, not a limitation.
5. **Accessibility as a documented standard**, which many competitors cannot
   claim and which universities are increasingly required to demand.

### What feels like a GitHub project rather than a product

- The home page's primary call to action is "View the repository". The
  hero says "growing collection" and "being written now".
- Two editions presented as two separate sites with different visual
  languages and no shared entry that explains which to use.
- No search, no filters, no previews, no "start here".
- No lecturer-facing surface at all: no notes on the page, no way to
  assemble or share, no onboarding.
- Documentation is Markdown on GitHub, not pages on the site.
- Copy is written for contributors and maintainers as often as for
  lecturers.

### Biggest UX weaknesses

1. Discovery: 150 activities, findable only by module, with no cross-module
   search or filters.
2. Teaching notes off-site.
3. No composition: the natural lecturer unit is a session of two or three
   activities with instructions, and nothing supports it.
4. Student context: a student opening a raw activity URL gets no framing
   from their lecturer.
5. Visual split between editions makes the product look like two projects.

### Lecturer pain points this could solve

Time. A lecturer preparing a methods seminar wants, in ten minutes: find
something that demonstrates the idea, check it is at the right level and
length, know what to say while it runs, add the two questions they want
students to write answers to, and give students one link. Everything
downstream (grading, tracking, LMS integration) is secondary and is where
the privacy risks live.

### Free versus paid: the working boundary

The MIT licence means every current file can be copied and re-hosted by
anyone. That is not a threat to the proposition, because the value a
university pays for is not the files:

| Stays free and open | Becomes paid |
| --- | --- |
| All 150 current activities and their teaching notes, hosted, findable, embeddable | Hosted lecturer workspace: saved lessons, a departmental library, duplication and versioning |
| A searchable library and per-activity pages with notes | Curated teaching sequences and lesson packages written by the author (new content, licensable rather than MIT) |
| Composing a lesson and sharing it as a link (no account) | Optional assignment mode: completion, aggregated class responses, with a data-processing agreement |
| Documentation | VLE and LTI integration, SSO, accessibility statement and support commitments, institutional licence |
| | New premium activity packs and future subject libraries |

The moat is not code. It is: the author's judgement and voice in new
content, the accumulated curated sequences, an institution-grade
accessibility and privacy posture, and a lecturer workspace that becomes
more valuable the more a department puts into it. Competitors can copy the
files; they cannot easily copy the pedagogy or the trust.

### Risks

- **Licence.** The open base cannot be withdrawn. New premium content
  should carry a different licence from the start, and the repository must
  say clearly which folders are MIT.
- **Privacy drift.** The moment a platform stores student responses, the
  product needs a lawful basis, a retention policy and a data-processing
  agreement per institution. Do not cross that line in M0.
- **Two editions, two designs.** Product chrome has to work on both without
  restyling either. The embed approach in the architecture document handles
  this.
- **Single author.** Content production is the bottleneck for premium
  packs; the platform should make the author's existing notes go further
  before asking for new writing.

### Sensible MVP

A lecturer can find any of the 150 activities in seconds, read its notes
on the page, assemble two or three into a lesson with their own
instructions and questions, preview it, and hand students one link that
works on a phone and needs no login. No accounts, no server, no data
stored anywhere but the link itself. This is M0, defined in `m0.md`.

### Longer-term opportunities

- Curated sequences per week of a methods module, sold as packages.
- Departmental libraries with shared, forkable lessons.
- Class-aggregate views where educationally justified (for example the
  distribution of a class's prediction answers, shown live), designed
  anonymous from the start.
- LTI 1.3 so a lesson is a graded or ungraded activity inside Moodle,
  Canvas or Blackboard.
- A second subject library (the architecture material) as proof the
  platform is subject-neutral.
- AI-assisted lesson drafting from a lecturer's learning outcome, grounded
  in the catalogue and notes, only once the manual builder is good.
