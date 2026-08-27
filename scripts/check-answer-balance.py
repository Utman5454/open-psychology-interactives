#!/usr/bin/env python3
"""Check that the Simplified Edition's choice questions cannot be answered by
position or by wording length alone.

    python3 scripts/check-answer-balance.py            # report and gate
    python3 scripts/check-answer-balance.py --verbose  # list every question
    python3 scripts/check-answer-balance.py --json     # machine-readable

Exits 0 when the edition is balanced, 1 otherwise.

WHY THIS EXISTS. A learner who notices that the best-supported answer is
usually the first one has learned something about the collection rather than
about psychology, and they will carry that habit into the next activity. The
same goes for a correct answer that is reliably the longest, the most hedged or
the only one written with any care. These are not marking errors; they are
teaching failures, because they let the activity be completed without the
thinking it was built to provoke.

The first run of this check found the correct answer in position 1 in 25 of the
26 questions it could see. That is not a tendency, it is a rule, and it was
invisible while each activity was read on its own.

WHAT IT READS. The edition declares its choices in two idioms, both handled:

  1. Buttons written into index.html carrying data-choice="key", with the JS
     naming the right one in a verdict map: KEY: { state: "correct", ... }.
  2. An options: [{ key, label }] array in activity.js, with the right one
     named by answer: "key" on the same case.

WHAT IT DELIBERATELY DOES NOT DO. It does not judge whether a distractor is
plausible: no script can, and padding a list with weak options to make the
positions come out evenly would be worse than the bias it fixed. It only
measures the two properties that are mechanically checkable, and it treats a
question with no single correct answer -- a prediction the activity accepts any
answer to -- as out of scope rather than as a failure.
"""

import argparse
import collections
import io
import json
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
ACTIVITIES = sorted((REPO / "simplified/modules").glob("*/tools/*"))

# A position is over-represented if it holds more than this share of the
# answers. With four options an even spread is 25% each; 40% leaves room for
# the lumpiness of a small sample without letting "always first" through.
MAX_POSITION_SHARE = 0.40

# How much longer the correct answer may be, on average, than its distractors
# before length becomes a tell. Expressed as a ratio of mean character counts.
MAX_LENGTH_RATIO = 1.25

# Below this many scored questions the shares are noise, so the position test
# is reported but not enforced.
MIN_QUESTIONS_FOR_SHARE = 8


# --------------------------------------------------------------- extraction

def read(path):
    return io.open(path, encoding="utf-8").read() if path.exists() else ""


def strip_tags(fragment):
    """Visible text of an HTML fragment, whitespace collapsed.

    Notes carried for screen readers sit in .visually-hidden spans and are not
    part of what a sighted learner weighs up, so they come out first.
    """
    fragment = re.sub(r'<span[^>]*class="[^"]*visually-hidden[^"]*"[^>]*>.*?</span>',
                      " ", fragment, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment)).strip()


def html_questions(html):
    """Choice groups written into the page, in document order.

    Buttons are grouped by the element that encloses them, so a page with two
    separate questions yields two groups rather than one long list.
    """
    groups = collections.OrderedDict()
    for match in re.finditer(
            r'<(button|label|div)\b[^>]*\bdata-choice="([^"]*)"[^>]*>(.*?)</\1>',
            html, re.S):
        key, inner = match.group(2), match.group(3)
        # Group by the nearest enclosing container id, falling back to one group.
        before = html[:match.start()]
        container = re.findall(r'<(?:div|fieldset|ul|ol|form)[^>]*id="([^"]+)"', before)
        gid = container[-1] if container else "options"
        groups.setdefault(gid, []).append((key, strip_tags(inner)))
    return groups


def js_questions(js):
    """`options: [{ key, label }]` arrays in the activity script, each paired
    with the `answer:` belonging to the same case.

    The two sit either side of one another depending on the activity, so the
    answer is looked for just after the array and, failing that, just before
    it. Anything further away belongs to a different case and is ignored.
    """
    out = []
    for match in re.finditer(r"options:\s*\[(.*?)\n\s*\]", js, re.S):
        block = match.group(1)
        pairs = re.findall(r'key:\s*"([^"]+)"\s*,\s*label:\s*"((?:[^"\\]|\\.)*)"', block)
        if not pairs:
            continue
        after = re.search(r'answer:\s*"([^"]+)"', js[match.end():match.end() + 600])
        before = re.findall(r'answer:\s*"([^"]+)"', js[max(0, match.start() - 600):match.start()])
        keys = [k for k, _ in pairs]
        answer = None
        if after and after.group(1) in keys:
            answer = after.group(1)
        elif before and before[-1] in keys:
            answer = before[-1]
        out.append({"options": [(k, l) for k, l in pairs], "answer": answer})
    return out


def round_sequences(js):
    """Activities that ask the same question of several cases in turn.

    These build one fixed list of options once and reuse it every round, so
    the option order never changes and the only thing that moves is which
    option is right. If the answer sits at the same index every round, the
    second round onwards is answerable without reading, which is exactly the
    failure this file exists to catch -- and it is invisible to the
    per-question checks above, because each round looks like a fresh question.

    The idiom is a module-level array of rows whose first element is the key,
    rendered with setAttribute("data-choice", row[0]), plus a list of cases
    each carrying answer: "key".
    """
    lists = []
    for match in re.finditer(r"var\s+([A-Z_]+)\s*=\s*\[\s*\n(\s*\[.*?)\n\s*\];", js, re.S):
        rows = re.findall(r'\[\s*"([^"]+)"\s*,\s*"((?:[^"\\]|\\.)*)"', match.group(2))
        if len(rows) >= 2:
            lists.append((match.group(1), rows))

    answers = re.findall(r'answer:\s*"([^"]+)"', js)
    out = []
    for name, rows in lists:
        keys = [k for k, _ in rows]
        used = [a for a in answers if a in keys]
        if len(used) >= 3 and len(set(keys)) == len(keys):
            out.append({
                "list": name,
                "keys": keys,
                "labels": [l for _, l in rows],
                "answers": used,
                "positions": [keys.index(a) for a in used],
            })
    return out


def correct_keys(js):
    """Every key the script calls correct, in either idiom."""
    keys = set(re.findall(r'(\w+):\s*\{\s*state:\s*"correct"', js))
    keys |= set(re.findall(r'answer:\s*"([^"]+)"', js))
    keys |= set(re.findall(r'"([^"]+)"\s*\)\s*,\s*"correct"', js))
    return keys


def questions_for(folder):
    """Every scoreable choice question in one activity."""
    html, js = read(folder / "index.html"), read(folder / "activity.js")
    right = correct_keys(js)
    found = []

    for gid, options in html_questions(html).items():
        keys = [k for k, _ in options]
        marked = [k for k in keys if k in right]
        if len(marked) != 1 or len(keys) < 2:
            continue  # no single right answer: a free prediction, out of scope
        found.append({
            "source": "html:" + gid,
            "keys": keys,
            "labels": [l for _, l in options],
            "correct": keys.index(marked[0]),
        })

    for q in js_questions(js):
        keys = [k for k, _ in q["options"]]
        if not q["answer"] or q["answer"] not in keys or len(keys) < 2:
            continue
        found.append({
            "source": "js",
            "keys": keys,
            "labels": [l for _, l in q["options"]],
            "correct": keys.index(q["answer"]),
        })

    return found


# ----------------------------------------------------------------- measures

def length_bias(question):
    """How much longer the correct label is than the average distractor.

    A ratio of 1.0 means it is exactly average. Short labels are excluded:
    "Most" against "Cannot say" is a four-character difference that no learner
    is going to read as a signal, and including them makes the ratio jumpy.
    """
    labels = question["labels"]
    correct = len(labels[question["correct"]])
    others = [len(l) for i, l in enumerate(labels) if i != question["correct"]]
    if not others:
        return None
    mean_other = sum(others) / len(others)
    if mean_other < 20:
        return None
    return correct / mean_other


def collect():
    rows = []
    for folder in ACTIVITIES:
        rel = "%s/%s" % (folder.parent.parent.name, folder.name)
        for q in questions_for(folder):
            q["activity"] = rel
            q["ratio"] = length_bias(q)
            q["longest"] = (len(q["labels"][q["correct"]]) == max(len(l) for l in q["labels"])
                            and len(set(len(l) for l in q["labels"])) > 1)
            rows.append(q)
    return rows


def collect_rounds():
    out = []
    for folder in ACTIVITIES:
        rel = "%s/%s" % (folder.parent.parent.name, folder.name)
        for seq in round_sequences(read(folder / "activity.js")):
            seq["activity"] = rel
            out.append(seq)
    return out


# ------------------------------------------------------------------- report

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--verbose", action="store_true", help="list every question")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    args = ap.parse_args()

    rows = collect()
    if args.json:
        print(json.dumps(rows, indent=1))
        return 0

    problems = []
    total = len(rows)
    if not total:
        print("no scoreable choice questions found, which is itself wrong",
              file=sys.stderr)
        return 1

    # ---- position
    positions = collections.Counter(q["correct"] + 1 for q in rows)
    widths = collections.Counter(len(q["keys"]) for q in rows)

    print("Scoreable choice questions: %d, across %d activities."
          % (total, len({q["activity"] for q in rows})))
    print("Option-list widths: %s"
          % ", ".join("%d options x%d" % (w, n) for w, n in sorted(widths.items())))
    print()
    print("Position of the correct answer:")
    for pos in sorted(positions):
        share = positions[pos] / total
        bar = "#" * int(round(share * 50))
        print("  position %d  %3d  %5.1f%%  %s" % (pos, positions[pos], share * 100, bar))

    for pos, count in positions.items():
        share = count / total
        if share > MAX_POSITION_SHARE and total >= MIN_QUESTIONS_FOR_SHARE:
            problems.append(
                "position %d holds %.0f%% of the correct answers (%d of %d); "
                "the ceiling is %.0f%%"
                % (pos, share * 100, count, total, MAX_POSITION_SHARE * 100))

    # A question must be reachable in every position across the edition, or the
    # spread above can be met while each individual width stays predictable.
    for width, _ in sorted(widths.items()):
        same = [q for q in rows if len(q["keys"]) == width]
        if len(same) < MIN_QUESTIONS_FOR_SHARE:
            continue
        used = {q["correct"] + 1 for q in same}
        missing = sorted(set(range(1, width + 1)) - used)
        if missing:
            problems.append(
                "of the %d questions with %d options, none has its answer in "
                "position %s" % (len(same), width, ", ".join(map(str, missing))))

    # ---- length
    rated = [q for q in rows if q["ratio"] is not None]
    if rated:
        mean_ratio = sum(q["ratio"] for q in rated) / len(rated)
        longest = sum(1 for q in rows if q["longest"])
        print()
        print("Wording length:")
        print("  correct answer is %.2fx the mean distractor length (over %d "
              "questions with labels long enough to compare)"
              % (mean_ratio, len(rated)))
        print("  correct answer is the longest option in %d of %d questions "
              "(%.0f%%)" % (longest, total, longest / total * 100))
        if mean_ratio > MAX_LENGTH_RATIO:
            problems.append(
                "the correct answer averages %.2fx the length of its "
                "distractors; the ceiling is %.2fx" % (mean_ratio, MAX_LENGTH_RATIO))
        if longest / total > MAX_POSITION_SHARE:
            problems.append(
                "the correct answer is the longest option in %.0f%% of "
                "questions; the ceiling is %.0f%%"
                % (longest / total * 100, MAX_POSITION_SHARE * 100))

    # ---- multi-round activities: one fixed option list, several cases
    rounds = collect_rounds()
    if rounds:
        print()
        print("Multi-round activities (one option list, reused each round):")
        for seq in rounds:
            spread = sorted({p + 1 for p in seq["positions"]})
            shown = ", ".join(str(p + 1) for p in seq["positions"])
            print("  %-58s answers at %s" % (seq["activity"], shown))
            if len(spread) == 1:
                problems.append(
                    "%s puts the answer in position %d in all %d rounds"
                    % (seq["activity"], spread[0], len(seq["positions"])))
            elif len(seq["positions"]) >= 4 and len(spread) < 3:
                problems.append(
                    "%s uses only %d of %d positions across %d rounds"
                    % (seq["activity"], len(spread), len(seq["keys"]),
                       len(seq["positions"])))

    # ---- per-activity, for anyone fixing one
    if args.verbose:
        print()
        by_activity = collections.OrderedDict()
        for q in rows:
            by_activity.setdefault(q["activity"], []).append(q)
        for activity, qs in by_activity.items():
            print(activity)
            for q in qs:
                print("   [%s] answer %d of %d%s"
                      % (q["source"], q["correct"] + 1, len(q["keys"]),
                         "  (longest)" if q["longest"] else ""))
                for i, label in enumerate(q["labels"]):
                    print("      %s %d. %s" % ("->" if i == q["correct"] else "  ",
                                               i + 1, label[:96]))

    print()
    if problems:
        for p in problems:
            print("PROBLEM: %s" % p, file=sys.stderr)
        print("\nAnswer placement is predictable. Reorder options so that a "
              "learner cannot score by position or by length.", file=sys.stderr)
        return 1

    print("Answer placement is balanced: no position and no length pattern "
          "carries the answer.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
