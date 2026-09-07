# Lessons

Things this project has already learned the hard way, kept so that nobody
solves them twice. One short entry each: the symptom, the cause, the rule
that follows. Add to the end. Older lessons that shaped the codebase are
also recorded in comments inside `.gitignore` and the scripts.

---

## L-001: Local brief files were swept into a commit

`git add modules` once committed the per-tool brief and specification notes
that sit beside the module folders, and they had to be removed from history.
**Rule:** `.gitignore` excludes `/modules/*.md` and `/modules/*/*.md`; keep
briefs at exactly those depths and never widen the ignore, because
`teaching-notes.md` and the `tools/README.md` files are legitimately tracked
one level deeper.

## L-002: A gate that only ever sees a healthy tree is untested code

`check-edition-pairing.py` and `check-answer-balance.py` each have a
fault-injection twin (`test-*.py`) because a check that has silently stopped
looking exits 0 exactly like one that works. **Rule:** any new structural
gate gets a self-test that breaks a sandbox copy and asserts the gate
notices.

## L-003: "Always first" answer bias was invisible per activity, obvious in aggregate

The first run of the answer-balance gate found the correct choice in position
1 in 25 of 26 questions. Nobody saw it while reviewing activities one at a
time. **Rule:** collection-wide properties need collection-wide checks;
reviewing pages individually does not find them.

## L-004: Documentation status notes rot fastest

Status notes in `CONTRIBUTING.md` and `docs/teaching-guide.md` still said
"Twelve tools are published" after 150 were live. **Rule:** state facts about
the collection in one place (`PROJECT_STATE.md` and the catalogues) and have
other documents point there rather than repeat the number.

## L-005: Relative paths one `../` short work from disk and 404 on Pages

A page that resolves its assets from `file://` can still break under the
`/open-psychology-interactives/` sub-path when a path is one level short.
**Rule:** test under a served sub-path, not only by double-clicking; the
pairing gate resolves the simplified navigation paths for exactly this
reason.

## L-006: Browser-level checks need no repository dependency

Playwright is available in the development environment as a global Node
package (resolvable via `NODE_PATH`), so `scripts/smoke-browser.js` can drive
headless Chromium without a `package.json`. Python's `http.server` is enough
to serve the site for it. **Rule:** keep development tooling optional and
self-skipping; keep the site dependency-free.

## L-007: A plain file server returns 200 for `404.html`

When testing the error page locally, request `404.html` by name; a missing
URL exercises Python's own error page, not the site's. The real behaviour of
`404.html` (root-absolute paths) can only be verified on GitHub Pages.

## L-008: oxlint warnings are non-blocking; errors are the gate

The pinned `npx --yes oxlint@1.80.0` run reports warnings (unused variables,
`new Array(n)`) with exit 0. Only the complexity, nesting and redeclare rules
in `.oxlintrc.json` are errors. Do not treat a warning-only run as a failure,
and do not "fix" warnings in a commit meant for something else.

## L-009: The remote Claude environment cannot write to GitHub

`git push` returned 403 from the agent proxy (the Claude GitHub App is not
installed for the account) and the GitHub API integration returned 403
"Resource not accessible by integration" on a branch create, while reads
through both paths worked. **Rule:** establish the write path before doing
work you expect to persist. When there is none, export each checkpoint with

    git bundle create <name>.bundle main..<branch>
    git format-patch main..<branch> -o <dir>

and hand the files to the owner, who runs `git fetch <bundle> <branch>` (or
`git am`) and pushes. Installing the Claude GitHub App for the repository
removes the detour. Never assume a local commit is safe until it is visible
on GitHub.
