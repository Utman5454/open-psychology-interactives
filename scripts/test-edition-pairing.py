#!/usr/bin/env python3
"""Prove that scripts/check-edition-pairing.py actually fails when it should.

    python3 scripts/test-edition-pairing.py
    python3 scripts/test-edition-pairing.py --keep   # leave the sandbox for inspection

Exits 0 when every fault below is caught, 1 otherwise.

A check that only ever runs against a healthy repository is untested code. It
exits 0 whether it is working or has quietly stopped looking, and the day it
stops looking is the day it is needed. This script breaks one thing at a time
and asserts that the check notices, so "the pairing is verified" means the
verifier itself is verified.

Nothing here touches the repository. Each run copies what the check reads into
a temporary directory, breaks the copy, and deletes it afterwards:

    data/                                  both catalogues
    scripts/                               the check under test
    simplified/                            the edition
    index.html                             the entry point from the public site
    modules/*/tools/*/index.html           the originals, as empty stubs

The originals are stubbed rather than copied because the check only ever asks
whether they exist. Copying 17MB to answer that would make the test slow for
no gain.
"""

import argparse
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

REPO = pathlib.Path(__file__).resolve().parent.parent


# ------------------------------------------------------------------ sandbox

def build_sandbox(root):
    """A throwaway copy of everything the check reads."""
    for name in ("data", "scripts", "simplified"):
        shutil.copytree(REPO / name, root / name,
                        ignore=shutil.ignore_patterns("__pycache__"))

    # The check reads index.html for the entry point and its module counts.
    shutil.copy2(REPO / "index.html", root / "index.html")

    stubbed = 0
    for page in REPO.glob("modules/*/tools/*/index.html"):
        target = root / page.relative_to(REPO)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.touch()
        stubbed += 1
    return stubbed


def run_check(root):
    result = subprocess.run(
        [sys.executable, str(root / "scripts" / "check-edition-pairing.py"), "--quiet"],
        cwd=root, capture_output=True, text=True)
    return result.returncode, result.stdout + result.stderr


# ------------------------------------------------------- ways to break a copy
# Each returns a callable that puts the sandbox back exactly as it was, so one
# failing scenario cannot contaminate the next.

def edit_json(root, rel, mutate):
    path = root / rel
    before = path.read_text(encoding="utf-8")
    data = json.loads(before)
    mutate(data)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n",
                    encoding="utf-8")
    return lambda: path.write_text(before, encoding="utf-8")


def edit_text(root, rel, old, new):
    path = root / rel
    before = path.read_text(encoding="utf-8")
    if old not in before:
        raise AssertionError("fixture text not found in %s: %r" % (rel, old))
    path.write_text(before.replace(old, new, 1), encoding="utf-8")
    return lambda: path.write_text(before, encoding="utf-8")


def move_away(root, rel):
    path = root / rel
    stash = path.parent / (path.name + ".stashed")
    path.rename(stash)
    return lambda: stash.rename(path)


def hide_dir(root, rel):
    """Move a directory right out of the tree rather than renaming it in
    place. The check globs `simplified/modules/*/tools/*/metadata.json`, so a
    renamed sibling is still found and a different fault gets provoked than
    the one being tested."""
    path = root / rel
    stash = root.parent / (root.name + "__stash") / path.name
    stash.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(path), str(stash))
    return lambda: shutil.move(str(stash), str(path))


# ---------------------------------------------------------------- scenarios

COG = "simplified/modules/cognitive/tools"
NAV = "simplified/assets/js/edition-nav.js"

# (description, break it, a phrase the report must contain)
SCENARIOS = [
    ("missing original on disk",
     lambda r: move_away(r, "modules/cognitive/tools/01-posner-spatial-cueing/index.html"),
     "not on disk"),

    ("missing simplified twin",
     lambda r: hide_dir(r, COG + "/05-attentional-blink"),
     "has no simplified twin"),

    ("duplicate pairing",
     lambda r: edit_json(r, COG + "/02-visual-search-laboratory/metadata.json",
                         lambda d: d.update(
                             pairedWith="01-posner-spatial-cueing",
                             originalPath="modules/cognitive/tools/"
                                          "01-posner-spatial-cueing/index.html")),
     "claimed by 2 simplified activities"),

    ("malformed pairedWith: a path rather than a bare slug",
     lambda r: edit_json(r, COG + "/03-inattentional-blindness/metadata.json",
                         lambda d: d.update(
                             pairedWith="modules/cognitive/tools/03-inattentional-blindness")),
     "is malformed"),

    ("malformed pairedWith: empty",
     lambda r: edit_json(r, COG + "/04-change-blindness-flicker/metadata.json",
                         lambda d: d.update(pairedWith="")),
     "missing, empty or not a string"),

    ("pairedWith that resolves, but in the wrong module",
     lambda r: edit_json(r, COG + "/06-stroop-interference-lab/metadata.json",
                         lambda d: d.update(pairedWith="01-double-dissociation-detective")),
     "rather than cognitive"),

    ("originalPath disagreeing with pairedWith",
     lambda r: edit_json(r, COG + "/07-dichotic-listening-selection/metadata.json",
                         lambda d: d.update(
                             originalPath="modules/cognitive/tools/99-nope/index.html")),
     "disagrees with pairedWith"),

    ("module count mismatch",
     lambda r: edit_json(r, COG + "/08-dual-task-capacity-lab/metadata.json",
                         lambda d: d.update(moduleSlug="neuropsychology")),
     "module cognitive: 11 simplified activities, expected 12"),

    ("hand-edited catalogue: a count it does not match",
     lambda r: edit_json(r, "data/catalogue-simplified.json",
                         lambda d: d.update(activityCount=74)),
     "activityCount is 74"),

    ("hand-edited catalogue: an activity that is not in the tree",
     lambda r: edit_text(r, "data/catalogue-simplified.json",
                         '"toolSlug": "01-posner-spatial-cueing"',
                         '"toolSlug": "01-posner-spatial-cueing-ghost"'),
     "not in the tree"),

    ("an activity that does not load the navigation layer",
     lambda r: edit_text(r, COG + "/09-working-memory-load-lab/index.html",
                         '<script src="../../../../assets/js/edition-nav.js" defer></script>',
                         ""),
     "do not load the navigation layer"),

    ("a module name in edition-nav.js drifting from the catalogue",
     lambda r: edit_text(r, NAV, '"neuropsychology": "Neuropsychology"',
                         '"neuropsychology": "Neuropsych"'),
     "the catalogue says"),

    ("a relative path in edition-nav.js one ../ short",
     lambda r: edit_text(r, NAV, 'var TO_CATALOGUE = "../../../../../data',
                         'var TO_CATALOGUE = "../../../../data'),
     "does not resolve"),

    ("edition-nav.js missing altogether",
     lambda r: move_away(r, NAV),
     "is missing"),

    ("the generated catalogue missing altogether",
     lambda r: move_away(r, "data/catalogue-simplified.json"),
     "is missing"),

    ("a stale module count on the home page",
     lambda r: edit_text(r, "index.html",
                         'simplified/modules/research-methods/index.html">Research Methods</a> '
                         '<span class="text-muted">— 21 activities</span>',
                         'simplified/modules/research-methods/index.html">Research Methods</a> '
                         '<span class="text-muted">— 19 activities</span>'),
     "shown as 19 activities"),

    ("the home page losing its entry point",
     lambda r: edit_text(r, "index.html", '<section class="section" id="simplified"',
                         '<section class="section" id="simplified-was"'),
     "no entry point"),
]


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--keep", action="store_true",
                    help="do not delete the sandbox, and print where it is")
    args = ap.parse_args()

    holder = tempfile.mkdtemp(prefix="edition-pairing-test-")
    root = pathlib.Path(holder) / "repo"
    root.mkdir()

    try:
        stubbed = build_sandbox(root)
        code, out = run_check(root)
        if code != 0:
            print("The sandbox is broken before any fault was injected. The "
                  "test cannot say anything about the check until this "
                  "passes:\n%s" % out, file=sys.stderr)
            return 1
        print("sandbox: %d originals stubbed, baseline check clean\n" % stubbed)

        failures = []
        for name, break_it, expected in SCENARIOS:
            restore = break_it(root)
            try:
                code, out = run_check(root)
            finally:
                restore()

            caught = code == 1 and expected in out
            print("%-4s  %s" % ("pass" if caught else "FAIL", name))
            if not caught:
                failures.append((name, expected, code, out))

        code, out = run_check(root)
        if code != 0:
            print("\nThe sandbox did not return to a clean state, so one of "
                  "the results above may be an artefact:\n%s" % out,
                  file=sys.stderr)
            return 1

        if failures:
            print("\n%d fault%s went undetected by check-edition-pairing.py:"
                  % (len(failures), "" if len(failures) == 1 else "s"),
                  file=sys.stderr)
            for name, expected, code, out in failures:
                print("\n--- %s\n    expected exit 1 and %r, got exit %d\n%s"
                      % (name, expected, code, out), file=sys.stderr)
            return 1

        print("\nAll %d faults are caught. check-edition-pairing.py fails "
              "when it should." % len(SCENARIOS))
        return 0
    finally:
        if args.keep:
            print("\nsandbox kept at %s" % holder)
        else:
            shutil.rmtree(holder, ignore_errors=True)
            shutil.rmtree(str(root.parent) + "__stash", ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
