# Decisions

A short log of decisions that shape the project, newest last. One entry per
decision: what was decided, why, and what it rules out. Add an entry when a
choice would otherwise have to be re-argued by the next person; do not log
routine implementation choices. Superseded entries stay, marked as such.

The decisions the Simplified Edition was built on are recorded separately in
`docs/simplified-edition.md`.

---

## D-001 (2026-09-07): Persistent state lives in the repository as plain files

**Decided.** Project state, decisions and lessons are Markdown files at known
paths (`PROJECT_STATE.md`, `docs/decisions.md`, `docs/lessons.md`), committed
with the work they describe. No external tracker, wiki or database.

**Why.** The repository is the only artefact guaranteed to survive between
sessions and machines. A file in the tree is versioned with the code it
describes, is diffable in review, and needs no account to read.

**Rules out.** State kept only in chat history, local notes, or untracked
files.

## D-002 (2026-09-07): One command for every gate

**Decided.** `scripts/check-all.py` is the single entry point for the quality
gates. New gates are added to its list, never documented only in prose.
Tiers: `--quick` for structural gates before every commit; the default adds
the gate self-tests; `--lint` and `--browser` are opt-in because they need
Node, network or Chromium.

**Why.** Seven gates with seven invocations were spread over three documents.
A gate nobody remembers to run is a gate that does not exist.

**Rules out.** Adding a check that is not wired into `check-all.py`.

## D-003 (2026-09-07): Development tooling may use Node, the site may not

**Decided.** Files under `scripts/` may require Node or Playwright at
development time, provided they degrade to a reported skip when the tooling
is absent and nothing the published site loads depends on them. The site
itself keeps its no-dependency, no-build promise unchanged.

**Why.** A browser-level smoke test catches the class of regression the
Python gates cannot see (console errors, broken shared JS, layout overflow).
The existing oxlint gate already established the pattern of a pinned `npx`
invocation that installs nothing into the repository.

**Rules out.** `package.json`, `node_modules/`, or any script tag pointing at
a package.

## D-004 (2026-09-07): Productisation work happens on a branch, never on `main`

**Decided.** `main` remains the published open collection and is changed only
by reviewed merges. Productisation work proceeds on a working branch (currently
`claude/open-psych-recovery-ibyvho`) in checkpoint commits, each with the
gates green.

**Why.** GitHub Pages deploys `main` directly. A half-built product layer on
`main` would be live to every lecturer using the free site.

**Rules out.** Direct pushes to `main`; force-pushes to any shared branch.

## D-005 (2026-09-07): Documentation that contradicts the implementation is a logged defect

**Decided.** Stale documentation is recorded in the defects table of
`PROJECT_STATE.md` and fixed in its own small commit, not silently corrected
inside an unrelated change.

**Why.** The repository's own history shows how easily "Twelve tools are
published" survived a release of 150. A defect list makes the drift visible
and its fix reviewable.

## D-006 (2026-09-07): Content layer and product layer are separate

**Decided in principle; detail pending the architecture document.** The 150
activities and their catalogues are the content layer and stay exactly as
portable, static and dependency-free as they are now. Anything that needs
accounts, storage or publishing is a product layer that consumes the content
layer through its catalogues and page URLs, and lives in a clearly separated
part of the repository (or a separate deployable), never inside `modules/` or
`simplified/`.

**Why.** The portability of the activities is the asset. A framework
migration would put 17 MB of hand-built, accessibility-tested activities at
risk for no gain to the product.

**Rules out.** Rewriting activities into a framework; making any activity
depend on the product layer to run.
