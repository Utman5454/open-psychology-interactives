#!/usr/bin/env python3
"""Prove that scripts/check-answer-balance.py actually fails when it should.

    python3 scripts/test-answer-balance.py
    python3 scripts/test-answer-balance.py --keep   # leave the sandbox behind

Exits 0 when every fault below is caught, 1 otherwise.

The bias this gate exists to stop went unnoticed for the whole build of the
edition, because it is invisible in any single activity and obvious only in
aggregate. A gate against that kind of fault is worth nothing unless it is
itself tested: one that has quietly stopped looking exits 0 in exactly the same
way as one that is working, and the day it stops looking is the day the pattern
creeps back.

Nothing here touches the repository. Each run copies the edition's markup into
a temporary directory, reintroduces one form of the bias in the copy, and
asserts that the check notices.
"""

import argparse
import io
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

REPO = pathlib.Path(__file__).resolve().parent.parent
CHECK = "check-answer-balance.py"


# ------------------------------------------------------------------ sandbox

def build_sandbox(root):
    """A throwaway copy of everything the check reads."""
    shutil.copytree(REPO / "scripts", root / "scripts",
                    ignore=shutil.ignore_patterns("__pycache__"))
    for activity in sorted((REPO / "simplified/modules").glob("*/tools/*")):
        target = root / activity.relative_to(REPO)
        target.mkdir(parents=True, exist_ok=True)
        for name in ("index.html", "activity.js"):
            if (activity / name).exists():
                shutil.copy2(activity / name, target / name)
    return len(list((root / "simplified/modules").glob("*/tools/*")))


def run_check(root):
    return subprocess.run(
        [sys.executable, str(root / "scripts" / CHECK)],
        capture_output=True, text=True, cwd=str(root)).returncode


# -------------------------------------------------------------------- edits

BUTTON = re.compile(r'([ \t]*)<button\b[^>]*\bdata-choice="([^"]+)"[^>]*>.*?</button>\n', re.S)


def options_path(root, activity):
    return root / "simplified/modules" / activity / "index.html"


def move_answer_first(path, key):
    """Put one activity's correct option back at the top of its list."""
    src = io.open(path, encoding="utf-8").read()
    buttons = list(BUTTON.finditer(src))
    blocks = [(m.group(2), m.group(0)) for m in buttons]
    keys = [k for k, _ in blocks]
    if key not in keys:
        raise SystemExit("fixture drift: %s has no %r option" % (path, key))
    at = keys.index(key)
    reordered = [blocks[at]] + blocks[:at] + blocks[at + 1:]
    out = src[:buttons[0].start()] + "".join(b for _, b in reordered) + src[buttons[-1].end():]
    io.open(path, "w", encoding="utf-8", newline="").write(out)


def lengthen_answer(path, key, padding):
    """Make one activity's correct option conspicuously the longest."""
    src = io.open(path, encoding="utf-8").read()
    pattern = re.compile(
        r'(<button\b[^>]*\bdata-choice="%s"[^>]*>.*?<span>)(.*?)(</span>)' % re.escape(key),
        re.S)
    new, count = pattern.subn(lambda m: m.group(1) + m.group(2).rstrip() + " " + padding + m.group(3),
                              src, count=1)
    if not count:
        raise SystemExit("fixture drift: no span for %r in %s" % (key, path))
    io.open(path, "w", encoding="utf-8", newline="").write(new)


# -------------------------------------------------------------------- faults

# Every activity whose answer the reordering moved off position 1. Putting a
# large enough slice of them back is what "the bias has crept in again" looks
# like in practice: not one bad question, but a habit across a module.
FIRST_AGAIN = [
    ("personality-individual-differences/tools/07-factor-rotation-playground", "nothing"),
    ("personality-individual-differences/tools/09-facet-level-detective", "facets"),
    ("personality-individual-differences/tools/12-alpha-trap", "falls"),
    ("personality-individual-differences/tools/24-explain-this-person-courtroom", "predicts"),
    ("personality-individual-differences/tools/31-intelligence-test-battery-builder", "purpose"),
    ("personality-individual-differences/tools/32-positive-manifold-visualiser", "nothing"),
    ("personality-individual-differences/tools/39-twin-study-simulator", "variance"),
    ("personality-individual-differences/tools/49-emotional-intelligence-claims-laboratory", "depends"),
    ("personality-individual-differences/tools/55-personality-disorder-continuum", "interferes"),
    ("social-critical-psychology/tools/01-epistemology-lens-switch", "object"),
    ("social-critical-psychology/tools/02-constructing-a-category", "line"),
    ("social-critical-psychology/tools/04-conformity-under-context", "third"),
    ("social-critical-psychology/tools/05-self-through-different-lenses", "concepts"),
    ("social-critical-psychology/tools/06-discourse-subject-position-lab", "service"),
    ("social-critical-psychology/tools/08-minimal-group-positive-distinctiveness", "gap"),
    ("social-critical-psychology/tools/09-crowd-deindividuation-vs-esim", "esim"),
    ("social-critical-psychology/tools/11-measuring-prejudice-instrument-lab", "observes"),
]

PADDING = ("This is the reading the rest of the evidence supports once the "
           "alternatives have been weighed against it properly and in full.")


def fault_all_first(root):
    """The original bias, restored across two modules."""
    for activity, key in FIRST_AGAIN:
        move_answer_first(options_path(root, activity), key)


def fault_one_module_first(root):
    """A single module drifting back is still a positional tell."""
    for activity, key in FIRST_AGAIN:
        if activity.startswith("social-critical-psychology/"):
            move_answer_first(options_path(root, activity), key)


def fault_answer_always_longest(root):
    """Length as the tell instead of position."""
    for activity, key in FIRST_AGAIN:
        lengthen_answer(options_path(root, activity), key, PADDING)


def fault_never_last(root):
    """Positions spread, but the answer never reaches the final slot: the
    learner learns to skip the last option rather than to read it."""
    import json
    listing = subprocess.run(
        [sys.executable, str(root / "scripts" / CHECK), "--json"],
        capture_output=True, text=True, cwd=str(root))
    for row in json.loads(listing.stdout):
        if str(row["source"]).startswith("html") and row["correct"] == len(row["keys"]) - 1:
            move_answer_first(options_path(root, row["activity"].replace("/", "/tools/")),
                              row["keys"][row["correct"]])


FAULTS = [
    ("the answer back in position 1 across two modules", fault_all_first),
    ("one module quietly putting the answer first again", fault_one_module_first),
    ("the answer made the longest option everywhere", fault_answer_always_longest),
    ("no four-option question ever answering in the last position", fault_never_last),
]


# --------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--keep", action="store_true", help="leave the sandbox for inspection")
    args = ap.parse_args()

    holder = tempfile.mkdtemp(prefix="answer-balance-")
    try:
        base = pathlib.Path(holder) / "clean"
        count = build_sandbox(base)
        if run_check(base) != 0:
            print("the copied edition does not pass the check; fix that first",
                  file=sys.stderr)
            return 1
        print("sandbox: %d activities copied, baseline check clean\n" % count)

        failures = 0
        for name, apply_fault in FAULTS:
            root = pathlib.Path(holder) / re.sub(r"\W+", "-", name)[:40]
            shutil.copytree(base, root)
            apply_fault(root)
            if run_check(root) == 0:
                print("MISSED  %s" % name)
                failures += 1
            else:
                print("pass    %s" % name)

        print()
        if failures:
            print("%d of %d faults went unnoticed. The gate is not doing its job."
                  % (failures, len(FAULTS)), file=sys.stderr)
            return 1
        print("All %d faults are caught. %s fails when it should."
              % (len(FAULTS), CHECK))
        return 0
    finally:
        if args.keep:
            print("\nsandbox kept at %s" % holder)
        else:
            shutil.rmtree(holder, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
