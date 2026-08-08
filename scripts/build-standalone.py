#!/usr/bin/env python3
"""Generate a self-contained `standalone.html` for one interactive.

    python scripts/build-standalone.py modules/research-methods/tools/20-.../
    python scripts/build-standalone.py --check <tool-dir>   # verify, do not write

The published tool page links out to four shared stylesheets and two shared
scripts. A lecturer who wants to reuse one activity on their own teaching page
cannot take those links with them, so this script folds everything the activity
actually needs into one file and drops everything it does not.

What survives
    the contents of <main>, minus the export control itself;
    the shared design tokens, layout, component and tool styles;
    the interactive shell and the tool's own script;
    every accessibility affordance in the markup - the skip link's target, the
    live region, visually-hidden captions and table alternatives.

What is dropped
    site header, navigation, breadcrumbs and footer;
    assets/js/main.js in its entirety - it is nav, footer year and the
    catalogue fetch, none of which the activity calls, and the catalogue fetch
    would be a repository-relative dependency;
    the site-chrome CSS those parts needed (see CHROME_SELECTORS);
    <head> metadata: canonical, Open Graph, Twitter, theme-color.

The output is committed so that it can be reviewed in a diff and opened
directly. Regenerate it whenever the tool's markup, script or styles change.
"""

import argparse
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent

SHARED_CSS = [
    REPO / "assets" / "css" / "main.css",
    REPO / "components" / "interactive-shell.css",
    REPO / "components" / "tool-kit.css",
]
SHARED_JS = [REPO / "components" / "interactive-shell.js"]

# Rule blocks whose selectors are *entirely* site chrome. A block is dropped
# only when every one of its selectors matches one of these prefixes, so an
# unrecognised selector is always kept. Keeping a dead rule costs a few bytes;
# dropping a live one breaks the activity, and the asymmetry decides the rule.
CHROME_SELECTORS = (
    ".site-header",
    ".site-nav",
    ".site-footer",
    ".nav-toggle",
    ".brand",
    ".breadcrumbs",
    ".card-grid",
    ".card",
    ".hero__actions",
    ".steps",
    ".topic-list",
    ".skip-link",
    # The export control is removed from the markup, so its styling is dead
    # weight in the copy.
    ".activity-export",
)

# Selectors that start with a chrome prefix but are needed anyway. `.card--*`
# modifiers only set --card-accent from the module palette, and the tool page
# puts `card--research-methods` on its title section to colour the eyebrow.
CHROME_KEEP = (".card--",)


# ---------------------------------------------------------------------------
# CSS
# ---------------------------------------------------------------------------

def split_css(text):
    """Split a stylesheet into top-level chunks.

    Yields (kind, selector_or_atrule, body_or_none, raw). `kind` is one of
    "comment", "at-block" (@media/@supports, body kept verbatim), "at-simple"
    (@charset and friends) or "rule". Nesting inside an at-block is left
    untouched and recursed into separately.
    """
    i, n = 0, len(text)
    while i < n:
        # Whitespace
        m = re.compile(r"\s+").match(text, i)
        if m:
            i = m.end()
            continue
        # Comment
        if text.startswith("/*", i):
            end = text.find("*/", i + 2)
            end = n if end == -1 else end + 2
            yield ("comment", None, None, text[i:end])
            i = end
            continue
        # At-rule
        if text[i] == "@":
            j = i
            depth = 0
            while j < n:
                if text[j] == "{":
                    depth += 1
                    break
                if text[j] == ";":
                    yield ("at-simple", text[i:j].strip(), None, text[i:j + 1])
                    i = j + 1
                    break
                j += 1
            else:
                break
            if j >= n or text[j] != "{":
                continue
            prelude = text[i:j].strip()
            k, depth = j + 1, 1
            while k < n and depth:
                if text[k] == "{":
                    depth += 1
                elif text[k] == "}":
                    depth -= 1
                k += 1
            yield ("at-block", prelude, text[j + 1:k - 1], text[i:k])
            i = k
            continue
        # Ordinary rule
        j = text.find("{", i)
        if j == -1:
            break
        k, depth = j + 1, 1
        while k < n and depth:
            if text[k] == "{":
                depth += 1
            elif text[k] == "}":
                depth -= 1
            k += 1
        yield ("rule", text[i:j].strip(), text[j + 1:k - 1], text[i:k])
        i = k


def is_chrome(selector_list):
    """True when every selector in the list is site chrome."""
    selectors = [s.strip() for s in selector_list.split(",") if s.strip()]
    if not selectors:
        return False
    for sel in selectors:
        if any(sel.startswith(keep) for keep in CHROME_KEEP):
            return False
        if not any(
            sel == pre or sel.startswith(pre + " ") or sel.startswith(pre + ":")
            or sel.startswith(pre + "_") or sel.startswith(pre + "-")
            or sel.startswith(pre + ">") or sel.startswith(pre + "[")
            or sel.startswith(pre + ".")
            for pre in CHROME_SELECTORS
        ):
            return False
    return True


def prune_css(text):
    """Drop rule blocks that only style site chrome, recursing into at-blocks.

    Section banner comments are kept, because they make the exported file
    navigable for anyone who opens it — but only when something from that
    section survives. A banner introducing a section that has been pruned away
    entirely would describe styling the file no longer contains.
    """
    out = []
    pending = []          # comments not yet known to introduce anything
    for kind, prelude, body, raw in split_css(text):
        if kind == "comment":
            pending.append(raw)
            continue
        if kind == "rule":
            if is_chrome(prelude):
                # Whatever comments led up to this rule were describing it.
                pending = []
                continue
            kept = raw
        elif kind == "at-block":
            inner = prune_css(body)
            if not inner.strip():
                pending = []
                continue
            kept = "@" + prelude.lstrip("@") + " {\n" + inner + "\n}"
        else:
            kept = raw
        out.extend(pending)
        pending = []
        out.append(kept)
    # Trailing comments introduce nothing and are dropped with their section.
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Inlining text into <script> and <style>
# ---------------------------------------------------------------------------
#
# An HTML parser does not understand JavaScript. Inside <script> it scans raw
# text for `</script`, and the shared shell's own usage example contains one:
#
#     <script src="../../components/interactive-shell.js" defer></script>
#
# Inlined unescaped, that string ends the block early and the rest of the file
# is parsed as HTML — which is exactly what happened the first time this ran.
#
# `<\/script` is the standard neutralisation and is safe everywhere it can
# legally appear: in a string literal `"<\/script>"` is identical to
# `"</script>"`, and in a regular expression `\/` is an escaped solidus. The
# same reasoning covers `<\!--`.
#
# `<script` on its own is only dangerous after a `<!--`, because that is the
# only route into the parser's double-escaped state. It is left alone unless
# such a comment is present, because the obvious escape (`<\script`) would
# change the meaning of a regular expression — `\s` is a character class.

SCRIPT_CLOSE_RE = re.compile(r"</(script)", re.I)
HTML_COMMENT_OPEN_RE = re.compile(r"<!--")
SCRIPT_OPEN_RE = re.compile(r"<(script)", re.I)


def escape_for_script(text, origin):
    text = SCRIPT_CLOSE_RE.sub(r"<\\/\1", text)
    if HTML_COMMENT_OPEN_RE.search(text):
        text = HTML_COMMENT_OPEN_RE.sub(r"<\\!--", text)
        if SCRIPT_OPEN_RE.search(text):
            print(
                f"  warning: {origin} contains both '<!--' and '<script'. "
                "Check the generated file parses as intended."
            )
    return text


def escape_for_style(text, origin):
    if re.search(r"</style", text, re.I):
        print(f"  warning: {origin} contains '</style' — escaping it.")
    return re.sub(r"</(style)", r"<\\/\1", text, flags=re.I)


def assert_self_contained(css, js, markup):
    """Fail loudly rather than write a file that will not parse or will reach
    for the network.

    The three payloads are checked separately, because a `<script src=...>`
    written inside a JavaScript comment is documentation and a
    `<script src=...>` in the markup is a broken dependency, and only a check
    that knows which is which can tell them apart.

    This is the check that would have caught the escaping bug on the first
    run instead of the second.
    """
    problems = []

    # Unescaped terminators would end the inlined block early.
    if re.search(r"(?<!\\)</script", js, re.I):
        problems.append("script payload still contains an unescaped '</script'")
    if re.search(r"(?<!\\)</style", css, re.I):
        problems.append("style payload still contains an unescaped '</style'")

    # The markup must not reach outside the file.
    if re.search(r"<script\b[^>]*\bsrc=", markup, re.I):
        problems.append("markup contains a <script src=...>")
    if re.search(r'<link\b[^>]*rel=["\']?\s*stylesheet', markup, re.I):
        problems.append("markup contains a <link rel=stylesheet>")
    for m in re.finditer(r'\b(?:src|href)\s*=\s*"([^"]+)"', markup):
        value = m.group(1)
        if value.startswith(("data:", "#", "http://", "https://", "mailto:")):
            continue
        problems.append(f"markup has a relative reference: {value}")

    if problems:
        raise SystemExit("Generated file would not be self-contained:\n  - " +
                         "\n  - ".join(problems))


# ---------------------------------------------------------------------------
# HTML
# ---------------------------------------------------------------------------

def extract_main(html):
    m = re.search(r"<main\b[^>]*>(.*)</main\s*>", html, re.S | re.I)
    if not m:
        raise SystemExit("No <main> element found.")
    return m.group(1)


def strip_export_control(markup):
    """Remove the export block itself, so the copy never contains its own button.

    Takes any HTML comment sitting immediately above the block with it — that
    comment explains the block to someone reading the source of *this*
    repository, and means nothing once the block has gone.
    """
    pattern = re.compile(
        r"(?:[ \t]*<!--(?:(?!-->).)*?-->\s*\n)?"
        r"[ \t]*<div[^>]*\bdata-activity-export\b.*?</div>[ \t]*\n?",
        re.S | re.I,
    )
    cleaned, count = pattern.subn("", markup)
    if count == 0:
        print("  note: no [data-activity-export] block found to strip")
    return cleaned


def page_title(html):
    m = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    title = m.group(1).strip() if m else "Interactive activity"
    return title.split("—")[0].strip()


def page_description(html):
    m = re.search(
        r'<meta\s+name="description"\s+content="(.*?)"', html, re.S | re.I
    )
    return m.group(1).strip() if m else ""


def favicon(html):
    m = re.search(r'<link rel="icon"[^>]*>', html, re.I)
    return m.group(0) if m else ""


def reindent(markup, spaces):
    """Re-indent a block that used to sit two levels deeper inside <main>."""
    lines = markup.split("\n")
    trimmed = [ln[4:] if ln.startswith("    ") else ln for ln in lines]
    pad = " " * spaces
    return "\n".join(pad + ln if ln.strip() else "" for ln in trimmed)


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

BANNER = """<!--
  {title}
  Standalone copy of one activity from Open Psychology Interactives.
  <https://github.com/utman5454/open-psychology-interactives>

  Everything this activity needs is inside this file: no stylesheets, scripts,
  fonts, images or network requests of any kind. Save it as a .html file and
  open it, or paste it into a page that accepts HTML.

  Nothing is saved, sent or tracked. Released under the MIT licence; please
  keep this notice with any substantial reuse.
-->"""


def build(tool_dir):
    tool_dir = pathlib.Path(tool_dir).resolve()
    index = tool_dir / "index.html"
    if not index.exists():
        raise SystemExit(f"No index.html in {tool_dir}")

    html = index.read_text(encoding="utf-8")

    css_sources = list(SHARED_CSS)
    local_css = tool_dir / "tool.css"
    if local_css.exists():
        css_sources.append(local_css)

    css_parts = []
    for path in css_sources:
        rel = path.relative_to(REPO).as_posix()
        raw = path.read_text(encoding="utf-8")
        pruned = prune_css(raw) if path in SHARED_CSS else raw
        css_parts.append(
            f"/* ---- {rel} ---- */\n{escape_for_style(pruned, rel)}"
        )

    js_sources = list(SHARED_JS)
    local_js = tool_dir / "tool.js"
    if local_js.exists():
        js_sources.append(local_js)

    js_parts = []
    for path in js_sources:
        rel = path.relative_to(REPO).as_posix()
        js_parts.append(
            f"/* ---- {rel} ---- */\n"
            + escape_for_script(path.read_text(encoding="utf-8"), rel)
        )

    body = reindent(strip_export_control(extract_main(html)).strip("\n"), 2)
    title = page_title(html)

    css_payload = "\n".join(css_parts)
    js_payload = "\n".join(js_parts)
    assert_self_contained(css_payload, js_payload, body)

    doc = f"""<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{page_description(html)}">
{favicon(html)}
{BANNER.format(title=title)}
<style>
{css_payload}
</style>
</head>
<body>

<main id="main">
{body}
</main>

<script>
{js_payload}
</script>
</body>
</html>
"""
    return doc


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("tool", nargs="+", help="tool directory")
    ap.add_argument("--check", action="store_true",
                    help="report whether the file on disk is up to date")
    args = ap.parse_args()

    stale = 0
    for target in args.tool:
        tool_dir = pathlib.Path(target)
        doc = build(tool_dir)
        out = tool_dir / "standalone.html"
        existing = out.read_text(encoding="utf-8") if out.exists() else None
        if args.check:
            state = "up to date" if existing == doc else "STALE"
            if existing != doc:
                stale += 1
            print(f"{state}: {out}")
        else:
            out.write_text(doc, encoding="utf-8", newline="\n")
            kb = len(doc.encode("utf-8")) / 1024
            print(f"wrote {out} ({kb:.0f} KB)")
    return 1 if stale else 0


if __name__ == "__main__":
    sys.exit(main())
