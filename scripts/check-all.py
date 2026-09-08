#!/usr/bin/env python3
"""Run every quality gate the repository has and report one pass/fail table.

    python3 scripts/check-all.py              # structural gates + gate self-tests
    python3 scripts/check-all.py --quick      # structural gates only
    python3 scripts/check-all.py --lint       # add oxlint (needs npx and network)
    python3 scripts/check-all.py --browser    # add the Playwright smoke test
    python3 scripts/check-all.py --json       # machine-readable summary

Exits 0 when every gate that ran passed, 1 otherwise. A gate that could not
run because its tooling is absent (no Node, no Playwright) is reported as
SKIP and does not fail the run unless it was requested explicitly.

WHY THIS EXISTS. The repository has seven scripted gates written at different
times for different reasons, each with its own invocation. Anyone (a person
or an AI session) resuming work has to know all seven to be sure the tree is
sound, and a forgotten gate exits 0 by never running. This script is the
single entry point, and PROJECT_STATE.md records the baseline it produced.

Every gate is a subprocess with a timeout, so a hang is a failure rather than
an open-ended wait. Output is captured and only the tail is shown for a
failure, so a green run stays readable.
"""

import argparse
import json
import os
import pathlib
import shutil
import subprocess
import sys
import time

REPO = pathlib.Path(__file__).resolve().parent.parent
PY = sys.executable

# Pinned to the version docs/simplified-edition-maintenance.md documents.
OXLINT = "oxlint@1.80.0"

# Seconds. Generous: the standalone check reads 17 MB, the self-tests copy
# the edition into a sandbox several times.
DEFAULT_TIMEOUT = 300

# How many trailing lines of a failing gate's output to show.
TAIL_LINES = 25


def gate(name, argv, timeout=DEFAULT_TIMEOUT, tier="quick", needs=None, cwd=REPO):
    return {"name": name, "argv": argv, "timeout": timeout,
            "tier": tier, "needs": needs or [], "cwd": cwd}


def check_metadata_json():
    """Built-in gate: every metadata.json parses and, for the original
    edition, is byte-for-byte the same object as its catalogue entry."""
    problems = []
    catalogue = json.loads((REPO / "data/catalogue.json").read_text(encoding="utf-8"))
    entries = {}
    for module in catalogue["modules"]:
        for tool in module["tools"]:
            entries[(tool["moduleSlug"], tool["toolSlug"])] = tool

    seen = 0
    for path in sorted(REPO.glob("modules/*/tools/*/metadata.json")):
        seen += 1
        try:
            meta = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            problems.append("%s: invalid JSON (%s)" % (path.relative_to(REPO), error))
            continue
        key = (meta.get("moduleSlug"), meta.get("toolSlug"))
        entry = entries.pop(key, None)
        if entry is None:
            problems.append("%s: no catalogue entry for %s/%s" % (path.relative_to(REPO), *key))
        elif entry != meta:
            drift = sorted(k for k in set(entry) | set(meta) if entry.get(k) != meta.get(k))
            problems.append("%s: differs from catalogue in %s" % (path.relative_to(REPO), ", ".join(drift)))
    for key in entries:
        problems.append("catalogue lists %s/%s but no metadata.json exists" % key)

    simplified = 0
    for path in sorted(REPO.glob("simplified/modules/*/tools/*/metadata.json")):
        simplified += 1
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            problems.append("%s: invalid JSON (%s)" % (path.relative_to(REPO), error))

    summary = "%d original and %d simplified metadata files parsed" % (seen, simplified)
    return (len(problems) == 0, summary + ("" if not problems else "\n" + "\n".join(problems)))


BUILTIN = {"metadata-json": check_metadata_json}

GATES = [
    gate("metadata-json", None),
    gate("edition-pairing", [PY, "scripts/check-edition-pairing.py", "--quiet"]),
    gate("simplified-catalogue", [PY, "scripts/build-simplified-catalogue.py", "--check"]),
    gate("standalone-exports", [PY, "scripts/build-standalone.py", "--all", "--check"]),
    gate("export-controls", [PY, "scripts/add-export-control.py", "--all", "--check"]),
    gate("answer-balance", [PY, "scripts/check-answer-balance.py"]),
    gate("curated-lessons", [PY, "scripts/check-lessons.py", "--quiet"]),
    gate("dual-task-balance", ["node", "scripts/test-dual-task-balance.js"], tier="full", needs=["node"]),
    gate("multiple-comparisons-fwer", ["node", "scripts/test-multiple-comparisons-fwer.js"],
         tier="full", needs=["node"]),
    gate("neuropsychology-live-qa", ["node", "scripts/test-neuropsychology-live-qa.js"],
         tier="full", needs=["node"]),
    gate("social-critical-live-qa", ["node", "scripts/test-social-critical-live-qa.js"],
         tier="full", needs=["node"]),
    gate("personality-individual-differences-live-qa",
         ["node", "scripts/test-personality-individual-differences-live-qa.js"],
         tier="full", needs=["node"]),
    gate("test-edition-pairing", [PY, "scripts/test-edition-pairing.py"], tier="full"),
    gate("test-answer-balance", [PY, "scripts/test-answer-balance.py"], tier="full"),
    gate("oxlint", ["npx", "--yes", OXLINT], tier="lint", needs=["npx"]),
    gate("browser-smoke", ["node", "scripts/smoke-browser.js"], tier="browser",
         needs=["node"], timeout=600),
    gate("lesson-tests", ["node", "scripts/test-lessons.js"], tier="browser",
         needs=["node"], timeout=600),
    gate("picker-tests", ["node", "scripts/test-picker.js"], tier="browser",
         needs=["node"], timeout=600),
]


def run_gate(spec):
    start = time.time()
    if spec["argv"] is None:
        try:
            ok, output = BUILTIN[spec["name"]]()
        except Exception as error:  # a crash in a built-in gate is a failure, not a traceback
            ok, output = False, "gate crashed: %r" % (error,)
        return ok, output, time.time() - start, "ran"

    for tool in spec["needs"]:
        if shutil.which(tool) is None:
            return None, "%s is not on PATH" % tool, 0.0, "skipped"

    try:
        completed = subprocess.run(
            spec["argv"], cwd=str(spec["cwd"]), capture_output=True, text=True,
            timeout=spec["timeout"], env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
    except subprocess.TimeoutExpired:
        return False, "timed out after %ds" % spec["timeout"], time.time() - start, "ran"
    output = (completed.stdout or "") + (completed.stderr or "")
    # The smoke test reports 'skipped' itself when Playwright is unavailable.
    if completed.returncode == 0 and "SKIPPED:" in output:
        return None, output.strip(), time.time() - start, "skipped"
    return completed.returncode == 0, output.strip(), time.time() - start, "ran"


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--quick", action="store_true", help="structural gates only")
    parser.add_argument("--lint", action="store_true", help="also run oxlint")
    parser.add_argument("--browser", action="store_true", help="also run the browser smoke test")
    parser.add_argument("--json", action="store_true", help="machine-readable summary")
    parser.add_argument("--only", help="run one gate by name")
    args = parser.parse_args(argv)

    tiers = {"quick"}
    if not args.quick:
        tiers.add("full")
    if args.lint:
        tiers.add("lint")
    if args.browser:
        tiers.add("browser")

    selected = [g for g in GATES if g["tier"] in tiers]
    if args.only:
        selected = [g for g in GATES if g["name"] == args.only]
        if not selected:
            parser.error("no gate called %r; known: %s" % (args.only, ", ".join(g["name"] for g in GATES)))

    results = []
    width = max(len(g["name"]) for g in selected)
    if not args.json:
        print("check-all: %d gates, repository %s" % (len(selected), REPO))
        print()
    for spec in selected:
        ok, output, seconds, state = run_gate(spec)
        verdict = "PASS" if ok else ("SKIP" if ok is None else "FAIL")
        # An explicitly requested tier that cannot run is a failure: the
        # caller asked for that evidence and did not get it.
        explicit = (spec["tier"] == "lint" and args.lint) or (spec["tier"] == "browser" and args.browser)
        if ok is None and explicit:
            verdict = "FAIL"
        results.append({"gate": spec["name"], "result": verdict, "seconds": round(seconds, 1),
                        "output": output})
        if not args.json:
            print("  %-4s  %-*s  %6.1fs" % (verdict, width, spec["name"], seconds))
            if verdict != "PASS":
                for line in output.splitlines()[-TAIL_LINES:]:
                    print("        | " + line)

    failed = [r for r in results if r["result"] == "FAIL"]
    if args.json:
        print(json.dumps({"ok": not failed, "results": results}, indent=2))
    else:
        print()
        passed = sum(1 for r in results if r["result"] == "PASS")
        skipped = sum(1 for r in results if r["result"] == "SKIP")
        print("%d passed, %d failed, %d skipped." % (passed, len(failed), skipped))
        if failed:
            print("Failing: " + ", ".join(r["gate"] for r in failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
