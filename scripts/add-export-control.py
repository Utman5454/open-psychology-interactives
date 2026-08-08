#!/usr/bin/env python3
"""Add (or update) the "Copy activity HTML" control on a tool page.

    python scripts/add-export-control.py --all
    python scripts/add-export-control.py --all --check
    python scripts/add-export-control.py <tool-dir> [...]

Two edits per page: the shared script in <head>, and the control itself as the
last thing inside <main>.

Inside <main>, and last, for two reasons. It has to be inside <main> because
that is what the exporter reads, and the exporter is what removes the control
from the copy — a control placed outside would survive into every export. And
it has to be last because most tool pages keep their laboratory in a section
that starts `hidden` until a learner has committed to a prediction; a lecturer
should not have to work through the activity to take a copy of it.

Idempotent: running it twice changes nothing, and it will replace an existing
block that has drifted from the current markup.
"""

import argparse
import importlib.util
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent

# The exporter owns the definition of what the export block is and how it is
# found. Reusing its remover here keeps the two scripts from drifting apart:
# whatever the exporter strips out of a copy is exactly what this replaces.
# No .pyc is written for it, so importing does not leave a __pycache__ behind
# in a repository that otherwise has nothing to ignore.
sys.dont_write_bytecode = True
_spec = importlib.util.spec_from_file_location(
    "build_standalone", REPO / "scripts" / "build-standalone.py")
_bs = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_bs)

# Only the export control. The exporter also strips data-instructor-only
# blocks, but those belong on the website — they are removed from the *copy*,
# not from the page, and reusing that wider routine here would delete a tool's
# educator section from its own source.
strip_export_block = _bs.strip_marked

SCRIPT_TAG = '<script src="{root}components/copy-activity.js" defer></script>'
ANCHOR_TAG = '<script src="{root}components/interactive-shell.js" defer></script>'

BLOCK = """    <!-- Lecturer-facing, and last inside <main> so that it does not sit in a
         section that starts hidden. scripts/build-standalone.py strips this
         block from the export by its data-activity-export attribute, so a
         copied activity never carries a button pointing at a file that is no
         longer beside it. -->
    <div class="section" data-activity-export>
      <div class="container">
        <div class="activity-export">
          <button type="button" data-copy-activity="standalone.html">
            Copy activity HTML
          </button>
          <p class="activity-export__note" data-copy-activity-note>
            For teaching elsewhere: copies this activity as one self-contained
            block of HTML, styled so it will not disturb the page you paste it
            into.
          </p>
        </div>
      </div>
    </div>
"""

# The prototype's first placement: the attribute sat on the .activity-export
# div itself, nested inside another section's container.
LEGACY_BLOCK_RE = re.compile(
    r"(?:[ \t]*<!--(?:(?!-->).)*?-->\s*\n)?"
    r"[ \t]*<div class=\"activity-export\"[^>]*>.*?</div>[ \t]*\n?",
    re.S,
)


def site_root(index_path):
    """The relative path back to the repository root, read from <body>."""
    text = index_path.read_text(encoding="utf-8")
    m = re.search(r'data-site-root="([^"]*)"', text)
    if m:
        return m.group(1)
    depth = len(index_path.relative_to(REPO).parent.parts)
    return "../" * depth


def transform(text, root):
    changed = []

    # 1. The script tag, immediately after the shell it depends on.
    script = SCRIPT_TAG.format(root=root)
    if script not in text:
        anchor = ANCHOR_TAG.format(root=root)
        if anchor not in text:
            raise SystemExit("  no interactive-shell.js script tag to anchor to")
        text = text.replace(anchor, anchor + "\n  " + script, 1)
        changed.append("script tag")

    # 2. Remove any previous placement, then append the current block. The
    #    current shape nests, so it is removed by the same depth-counting
    #    routine the exporter uses rather than by a second regex that could
    #    disagree with it.
    before = text
    text, _ = strip_export_block(text, "data-activity-export")
    text = LEGACY_BLOCK_RE.sub("", text)
    if text != before:
        changed.append("removed previous block")

    # Normalise the whitespace before </main> to exactly one blank line, so
    # that re-running does not accumulate them.
    m = re.search(r"\s*</main\s*>", text)
    if not m:
        raise SystemExit("  no </main> to insert before")
    text = text[:m.start()] + "\n\n" + BLOCK + "\n  </main>" + text[m.end():]
    if "removed previous block" not in changed:
        changed.append("export block")

    return text, changed


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("tool", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--check", action="store_true",
                    help="report pages that would change; exit non-zero if any")
    args = ap.parse_args()

    targets = (sorted(REPO.glob("modules/*/tools/*/index.html")) if args.all
               else [pathlib.Path(t) / "index.html" for t in args.tool])
    if not targets:
        ap.error("give one or more tool directories, or --all")

    would_change = 0
    for index in targets:
        original = index.read_text(encoding="utf-8")
        updated, changed = transform(original, site_root(index))
        if updated == original:
            continue
        would_change += 1
        if args.check:
            print(f"WOULD CHANGE: {index.parent.name}: {', '.join(changed)}")
        else:
            index.write_text(updated, encoding="utf-8", newline="\n")
            print(f"{index.parent.name}: {', '.join(changed)}")

    if args.check:
        print(f"\n{would_change} of {len(targets)} pages would change.")
        return 1 if would_change else 0
    print(f"\n{would_change} of {len(targets)} pages updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
