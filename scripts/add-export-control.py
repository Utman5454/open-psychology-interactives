#!/usr/bin/env python3
"""Add (or update) the lecturer reuse controls on a tool page.

    python scripts/add-export-control.py --all
    python scripts/add-export-control.py --all --check
    python scripts/add-export-control.py <tool-dir> [...]

Two edits per page: the shared scripts in <head>, and the controls themselves
as the last thing inside <main>. There are two of them now, Copy and Download,
in one block so that a single attribute keeps both out of an exported copy.

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

SCRIPT_TAGS = [
    '<script src="{root}components/activity-fullscreen.js" defer></script>',
    '<script src="{root}components/copy-activity.js" defer></script>',
]
ANCHOR_TAG = '<script src="{root}components/interactive-shell.js" defer></script>'

BLOCK = """    <!-- Utility controls, last inside <main> so that they do not sit in a
         section that starts hidden: a lecturer should not have to work through
         an activity to expand or copy it. Full screen travels into an exported
         copy, because it is a usability control and most useful precisely when
         the activity is embedded in somebody else's page. -->
    <div class="section" data-activity-utilities>
      <div class="container">
        <div class="activity-utilities">
          <div data-activity-fullscreen>
            <button type="button" data-fullscreen-toggle aria-pressed="false">
              Full screen
            </button>
          </div>
          <!-- Controls of this website only. The attribute below is what
               scripts/build-standalone.py looks for to leave these out of a
               copy, which is also why this comment sits inside the block
               rather than above it. Both controls go; Full screen, above,
               stays, because it belongs to the activity. -->
          <div class="activity-utilities__lecturer" data-activity-export>
            <button type="button" data-copy-activity="standalone.html">
              Copy activity HTML
            </button>
            <!-- A plain link, deliberately. The browser fetches the committed
                 artefact itself, so the download needs no script, works with
                 JavaScript unavailable, and cannot differ from what Copy puts
                 on the clipboard. -->
            <a class="activity-utilities__download" href="standalone.html"
               download="{slug}.html" data-download-activity>
              Download activity HTML
            </a>
            <p class="activity-utilities__note" data-copy-activity-note>
              For teaching elsewhere: take this activity as one self-contained
              block of HTML, on the clipboard or as a file. Either way it is
              styled so that it will not disturb the page you put it into.
            </p>
          </div>
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


def transform(text, root, slug):
    changed = []

    # 1. The script tags, immediately after the shell they sit alongside.
    anchor = ANCHOR_TAG.format(root=root)
    for tag in SCRIPT_TAGS:
        script = tag.format(root=root)
        if script in text:
            continue
        if anchor not in text:
            raise SystemExit("  no interactive-shell.js script tag to anchor to")
        text = text.replace(anchor, anchor + "\n  " + script, 1)
        changed.append(re.search(r"([\w-]+\.js)", script).group(1))

    # 2. Remove any previous placement, then append the current block.
    #
    #    Keyed on the *outer* wrapper, data-activity-utilities. The exporter
    #    keys on the inner data-activity-export instead, because it must leave
    #    the full-screen control behind; using that key here would strip only
    #    the copy control and let the utilities section accumulate on every run.
    before = text
    text, _ = strip_export_block(text, "data-activity-utilities")
    text, _ = strip_export_block(text, "data-activity-export")
    text = LEGACY_BLOCK_RE.sub("", text)
    if text != before:
        changed.append("removed previous block")

    # Normalise the whitespace before </main> to exactly one blank line, so
    # that re-running does not accumulate them.
    m = re.search(r"\s*</main\s*>", text)
    if not m:
        raise SystemExit("  no </main> to insert before")
    text = (text[:m.start()] + "\n\n" + BLOCK.format(slug=slug)
            + "\n  </main>" + text[m.end():])
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
        updated, changed = transform(original, site_root(index), index.parent.name)
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
