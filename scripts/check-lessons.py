#!/usr/bin/env python3
"""Check the curated lessons under data/lessons/.

    python3 scripts/check-lessons.py
    python3 scripts/check-lessons.py --quiet

Exits 0 when every lesson is valid, 1 otherwise.

Each data/lessons/<id>.json must be valid JSON, must satisfy the lesson
rules (the same ones assets/product/lesson.js applies in the browser and
data/lessons/schema.json states declaratively), must carry an `id` equal to
its file name, and every activity step must point at a published activity
in the matching catalogue. A lesson that references an activity that has
been renamed is exactly the kind of silent breakage a gate exists to catch:
the player would show a student a step that cannot load.

No third-party JSON Schema library is used, on purpose: the rules are small
and the scripts in this repository need nothing beyond Python 3.
"""

import argparse
import json
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
LESSONS = REPO / "data" / "lessons"

LIMITS = {"title": 200, "intro": 4000, "author": 100, "steps": 40,
          "instructions": 2000, "note": 4000, "prompt": 1000, "summary": 400}
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,80}$")
SETTINGS = ("lecture", "seminar", "revision")
KINDS = ("short", "long")
TOP_KEYS = {"schema", "id", "title", "intro", "author", "setting", "summary", "steps"}


def published_keys():
    keys = set()
    original = json.loads((REPO / "data/catalogue.json").read_text(encoding="utf-8"))
    for module in original["modules"]:
        for tool in module["tools"]:
            if tool.get("status") == "published":
                keys.add(("original", tool["moduleSlug"], tool["toolSlug"]))
    simplified = json.loads((REPO / "data/catalogue-simplified.json").read_text(encoding="utf-8"))
    for module in simplified["modules"]:
        for activity in module["activities"]:
            if activity.get("status") == "published":
                keys.add(("simplified", activity["moduleSlug"], activity["toolSlug"]))
    return keys


def check_text(problems, where, value, limit, required=False):
    if value is None:
        if required:
            problems.append("%s is missing" % where)
        return
    if not isinstance(value, str):
        problems.append("%s must be a string" % where)
    elif required and not value.strip():
        problems.append("%s is empty" % where)
    elif len(value) > limit:
        problems.append("%s is longer than %d characters" % (where, limit))


def check_step(problems, index, step, keys):
    where = "step %d" % (index + 1)
    if not isinstance(step, dict):
        problems.append("%s is not an object" % where)
        return
    kind = step.get("type")
    if kind == "activity":
        allowed = {"type", "edition", "module", "tool", "instructions"}
        ref = (step.get("edition"), step.get("module"), step.get("tool"))
        if ref[0] not in ("original", "simplified"):
            problems.append("%s: unknown edition %r" % (where, ref[0]))
        if not all(isinstance(part, str) and SLUG_RE.match(part) for part in ref[1:]):
            problems.append("%s: module and tool must be slugs" % where)
        elif ref not in keys:
            problems.append("%s: no published activity %s/%s/%s" % ((where,) + ref))
        check_text(problems, where + " instructions", step.get("instructions"), LIMITS["instructions"])
    elif kind == "note":
        allowed = {"type", "text"}
        check_text(problems, where + " text", step.get("text"), LIMITS["note"], required=True)
    elif kind == "question":
        allowed = {"type", "prompt", "kind"}
        check_text(problems, where + " prompt", step.get("prompt"), LIMITS["prompt"], required=True)
        if "kind" in step and step["kind"] not in KINDS:
            problems.append("%s: kind must be one of %s" % (where, ", ".join(KINDS)))
    else:
        problems.append("%s: unknown type %r" % (where, kind))
        return
    extra = set(step) - allowed
    if extra:
        problems.append("%s: unexpected fields %s" % (where, ", ".join(sorted(extra))))


def check_lesson(path, keys):
    problems = []
    try:
        lesson = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        return ["not valid JSON: %s" % error]
    if not isinstance(lesson, dict):
        return ["top level is not an object"]
    if lesson.get("schema") != 1:
        problems.append("schema must be 1")
    if lesson.get("id") != path.stem:
        problems.append("id must equal the file name (%r)" % path.stem)
    check_text(problems, "title", lesson.get("title"), LIMITS["title"], required=True)
    check_text(problems, "intro", lesson.get("intro"), LIMITS["intro"])
    check_text(problems, "author", lesson.get("author"), LIMITS["author"])
    check_text(problems, "summary", lesson.get("summary"), LIMITS["summary"])
    if "setting" in lesson and lesson["setting"] not in SETTINGS:
        problems.append("setting must be one of %s" % ", ".join(SETTINGS))
    extra = set(lesson) - TOP_KEYS
    if extra:
        problems.append("unexpected fields %s" % ", ".join(sorted(extra)))
    steps = lesson.get("steps")
    if not isinstance(steps, list) or not steps:
        problems.append("steps must be a non-empty list")
    else:
        if len(steps) > LIMITS["steps"]:
            problems.append("more than %d steps" % LIMITS["steps"])
        for index, step in enumerate(steps):
            check_step(problems, index, step, keys)
    return problems


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args(argv)

    keys = published_keys()
    lessons = sorted(p for p in LESSONS.glob("*.json") if p.name != "schema.json")
    failed = 0
    for path in lessons:
        problems = check_lesson(path, keys)
        if problems:
            failed += 1
            print("FAIL %s" % path.relative_to(REPO))
            for problem in problems:
                print("     %s" % problem)
        elif not args.quiet:
            print("ok   %s" % path.relative_to(REPO))
    print("%d lesson(s) checked, %d invalid." % (len(lessons), failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
