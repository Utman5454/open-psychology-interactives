#!/usr/bin/env python3
"""Generate a self-contained, embeddable copy of an interactive.

    python scripts/build-standalone.py <tool-dir> [<tool-dir> ...]
    python scripts/build-standalone.py --all
    python scripts/build-standalone.py --all --check     # verify, do not write

The published tool page links out to four shared stylesheets and two shared
scripts. A lecturer who wants to reuse one activity on their own teaching page
cannot take those links with them, so this script folds everything the activity
needs into one block of HTML and drops everything it does not.

The output is a *fragment*, not a document: one `<div class="opi-activity">`
containing a `<style>`, the activity markup and a `<script>`. It can be pasted
into a blank .html file or straight into an LMS page beside existing content.

Embedding safely
----------------
Every selector is rewritten to sit under `.opi-activity`, so nothing the copy
carries can restyle the page around it. `:root`, `html` and `body` map onto the
wrapper; bare element selectors become descendants of it. The custom properties
that the whole design rests on are declared on the wrapper and inherit inwards.

Scoping also defends the activity against the host, because a scoped rule
(`.opi-activity button`, specificity 0-1-1) outranks the ordinary host rule
(`button`, 0-0-1). Where the design leans on a browser default rather than on a
rule of its own, RESET_CSS restates it, so a host that flattens list padding or
table borders does not flatten the activity's.

What survives
    the contents of <main>, minus the export control;
    the shared design tokens, layout, component and tool styles, scoped;
    the interactive shell and the tool's own script;
    every accessibility affordance - live regions, visually-hidden captions,
    table alternatives, reduced-motion, forced-colours and focus-visible rules.

What is dropped
    site header, navigation, breadcrumbs and footer;
    the export control itself, so a copy never carries its own copy button;
    assets/js/main.js in its entirety - it is nav, footer year and the
    catalogue fetch, none of which the activity calls, and the catalogue fetch
    would be a repository-relative dependency;
    the site-chrome CSS those parts needed (see CHROME_SELECTORS).

Exports are committed so they can be reviewed in a diff and opened directly.
`--check` exits non-zero if any committed export no longer matches its sources,
which is what makes a stale copy a build failure rather than a surprise.
"""

import argparse
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent

#: The wrapper every exported activity is scoped under.
ROOT = ".opi-activity"

#: Site rules are scoped with the class repeated three times. That costs
#: nothing visually and buys specificity, which is the whole mechanism by
#: which an embedded activity keeps its own appearance. See RESET_CSS for the
#: full ladder and why three.
SITE_ROOT = ROOT * 3

#: The site never sets a root font size, so `rem` resolves against the browser
#: default of 16px in the canonical rendering. A host page very often does set
#: one — `html { font-size: 62.5% }` is a widespread idiom — which would rescale
#: the whole activity. Resolving rem to px at build time reproduces the
#: canonical rendering exactly and makes it immune to that. Browser zoom, which
#: is what WCAG 1.4.4 is tested with, scales px as readily as rem; what is given
#: up is the reader's *default font size* preference, and an activity that
#: renders at 62.5% respects that preference rather less.
REM_BASE_PX = 16

SHARED_CSS = [
    REPO / "assets" / "css" / "main.css",
    REPO / "components" / "interactive-shell.css",
    REPO / "components" / "tool-kit.css",
]
#: Inlined into every export. The full-screen control travels with a copy —
#: it is a usability control, useful precisely because the copy is embedded in
#: somebody else's page — whereas copy-activity.js does not, because the copy
#: has no committed artefact of its own to fetch.
SHARED_JS = [
    REPO / "components" / "interactive-shell.js",
    REPO / "components" / "activity-fullscreen.js",
]

#: Shared scripts inlined only for tools whose markup asks for them, keyed on
#: the attribute the component looks for. This keeps a component that one tool
#: uses out of the other seventy-four exports — which matters while a pattern
#: is being prototyped, because adding it unconditionally would rewrite every
#: export and bury the change under noise.
CONDITIONAL_JS = {
    "data-learner-help": REPO / "components" / "learner-help.js",
}

# Rule blocks whose selectors are *entirely* site chrome. A block is dropped
# only when every one of its selectors matches one of these prefixes, so an
# unrecognised selector is always kept. Keeping a dead rule costs a few bytes;
# dropping a live one breaks the activity, and the asymmetry decides the rule.
CHROME_SELECTORS = (
    ".site-header", ".site-nav", ".site-footer", ".nav-toggle", ".brand",
    ".breadcrumbs", ".card-grid", ".card", ".hero__actions", ".steps",
    ".topic-list", ".skip-link",
)
# `.activity-utilities` is deliberately *not* pruned: the utilities row
# survives into a copy carrying the full-screen control, and needs its styling.

# `.card--*` modifiers only set --card-accent from the module palette, and a
# tool page puts `card--<module>` on its title section to colour the eyebrow.
CHROME_KEEP = (".card--",)

# Declarations that belong to a page and must not travel to a wrapper <div>.
# `body` is a flex column that fills the viewport; applied to a div inside
# somebody else's page that would stretch the activity to full screen height
# and re-flow whatever sits beside it.
ROOT_DROP_DECLARATIONS = (
    "margin", "min-height", "height", "display", "flex-direction",
    "scroll-padding-top", "overflow-x", "overflow-y", "overflow",
)

# Shields the activity from the page around it.
#
# `all: revert` discards every author declaration for an element and falls back
# to the browser's own stylesheet. Applied to each descendant it removes the
# host's rules wholesale, while the activity's own rules — which are scoped
# with a doubled class and so always outrank this — survive untouched.
# Inherited properties revert to the value they inherit, which is the value the
# wrapper sets, so typography flows from the activity and not from the host.
#
# The specificity ladder this depends on:
#
#     host element rule        td                          (0,0,1)  loses
#     this reset               .opi-activity *             (0,1,0)
#     host themed rule         .theme .content td          (0,2,1)  loses
#     host resistance          .opi-activity ×3 :where(td) (0,3,0)
#     the activity's own rules .opi-activity ×3 .data-table td  (0,4,1)  wins
#
# `revert` alone is not enough, which a real LMS demonstrated: it sits at
# (0,1,0) and any themed rule like `.theme .content td { color: #111 }` beats
# it. The shared stylesheets set colour on only three bare elements — `body`,
# `a` and `code` — so table cells and body text inherit their colour, and an
# inherited value loses to *any* rule that matches the element directly. In
# dark mode that produced dark text on a dark panel. HOST_RESISTANCE_CSS
# states those colours explicitly instead of leaving them to inheritance.
#
# Elements *inside* an <svg> are excluded, because reverting there would drop
# the presentation attributes the charts are drawn with. The <svg> element
# itself is not excluded: a host page styling `svg { border; background }` is
# ordinary, and the charts would otherwise wear it.
RESET_CSS = """/* Defensive baseline. See scripts/build-standalone.py for why this
   is `revert` rather than an enumerated reset, and how the specificity ladder
   keeps the activity's own styling on top of it. */
.opi-activity *:not(svg *) {
  all: revert;
}
.opi-activity, .opi-activity *, .opi-activity *::before, .opi-activity *::after {
  box-sizing: border-box;
}
.opi-activity {
  display: block;
  margin: 0;
  padding: 0;
  text-align: left;
  text-transform: none;
  text-indent: 0;
  font-style: normal;
  font-variant: normal;
  letter-spacing: normal;
  word-spacing: normal;
  white-space: normal;
  visibility: visible;
  float: none;
  max-width: none;
}
.opi-activity svg { max-width: 100%; }
.opi-activity img { max-width: 100%; height: auto; }
.opi-activity [hidden] { display: none !important; }"""


# Says out loud what the stylesheets leave to inheritance, so a themed host
# page cannot take it away. Emitted *before* the activity's own rules, so that
# where the two meet at equal specificity — a single-class rule such as
# `.text-muted` also lands on (0,3,0) — the activity's own rule wins on order.
#
# `:where()` contributes nothing to specificity, so each of these sits exactly
# on the three repeated classes and no higher. That is deliberate: high enough
# to clear any realistic themed selector, low enough that every rule the
# collection actually writes still outranks it.
#
# Only colour and background are asserted. Borders, spacing and typography are
# already stated by the collection's own class rules, which outrank both this
# block and anything a host is likely to write.
HOST_RESISTANCE_CSS = """/* Host resistance: the colours the stylesheets leave to
   inheritance, stated explicitly. See scripts/build-standalone.py. */
.opi-activity.opi-activity.opi-activity :where(
  table, thead, tbody, tfoot, tr, th, td, caption, colgroup, col,
  p, ul, ol, li, dl, dt, dd, blockquote, figure, figcaption,
  h1, h2, h3, h4, h5, h6, span, strong, b, em, i, small, sub, sup,
  div, section, article, aside, header, footer, main, form, fieldset,
  legend, label, output, details, summary, abbr, cite, q, time, mark
) {
  color: inherit;
}
.opi-activity.opi-activity.opi-activity :where(
  table, thead, tbody, tfoot, tr, th, td, caption,
  p, ul, ol, li, dl, dt, dd, figure, figcaption, legend, label, output,
  h1, h2, h3, h4, h5, h6, div, section, article, aside, header, footer, main
) {
  background-color: transparent;
}
/* Form controls are coloured by class rules throughout the collection, which
   outrank this; the fallback matters only for a control no rule reaches. */
.opi-activity.opi-activity.opi-activity :where(button, input, select, textarea) {
  color: inherit;
}"""


# ---------------------------------------------------------------------------
# CSS: lexing
# ---------------------------------------------------------------------------

def strip_comments(text):
    """Remove /* ... */ comments, leaving string literals alone.

    Stripping first is not tidiness. Two comments in this collection sit
    *inside* a selector list, and one of those contains a `{`:

        /* :where() keeps this at specificity (0,0,1) so `.some-chart {
           max-width: 30rem }` can still cap an oversized SVG. */

    A brace-counting parser reads that as the start of the rule body and every
    subsequent boundary is wrong. Removing comments makes the grammar regular.
    """
    out = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch in "\"'":
            j = i + 1
            while j < n:
                if text[j] == "\\":
                    j += 2
                    continue
                if text[j] == ch:
                    j += 1
                    break
                j += 1
            out.append(text[i:j])
            i = j
        elif text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = n if end == -1 else end + 2
        else:
            out.append(ch)
            i += 1
    return "".join(out)


def split_css(text):
    """Split a stylesheet into top-level chunks.

    Yields (kind, prelude, body, raw) where kind is "at-block" (@media and
    friends, body kept for recursion), "at-simple" (@charset and the like) or
    "rule". Expects comments to have been stripped already.
    """
    i, n = 0, len(text)
    while i < n:
        m = re.compile(r"\s+").match(text, i)
        if m:
            i = m.end()
            continue
        if text[i] == "@":
            j = i
            while j < n and text[j] not in "{;":
                j += 1
            if j >= n:
                break
            if text[j] == ";":
                yield ("at-simple", text[i:j].strip(), None, text[i:j + 1])
                i = j + 1
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


def split_selectors(selector_list):
    """Split on top-level commas, ignoring those inside () and []."""
    parts, depth, current = [], 0, []
    for ch in selector_list:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(ch)
    tail = "".join(current).strip()
    if tail:
        parts.append(tail)
    return [p for p in parts if p]


# ---------------------------------------------------------------------------
# CSS: pruning and scoping
# ---------------------------------------------------------------------------

#: What may follow a chrome class name and still belong to that block. The BEM
#: element suffix `__` is included so `.site-header__inner` goes with
#: `.site-header`; a bare letter or digit is not, so `.card` never claims
#: `.cardigan`. `--` is excluded on purpose: the modifiers this collection uses
#: (`.card--cognitive`) carry the module palette and are wanted, and they are
#: listed in CHROME_KEEP.
CHROME_BOUNDARY_RE = re.compile(r"(?:__|[\s>+~:.,\[]|$)")


def is_chrome(selector_list):
    """True when every selector in the list is site chrome."""
    selectors = split_selectors(selector_list)
    if not selectors:
        return False
    for sel in selectors:
        if any(sel.startswith(keep) for keep in CHROME_KEEP):
            return False
        if not any(
            sel.startswith(pre) and CHROME_BOUNDARY_RE.match(sel, len(pre))
            for pre in CHROME_SELECTORS
        ):
            return False
    return True


ROOT_SELECTORS = (":root", "html", "body")


def is_root_selector(sel):
    return sel in ROOT_SELECTORS or any(
        sel.startswith(r) and sel[len(r):len(r) + 1] in (" ", ">", ":", ",")
        for r in ROOT_SELECTORS
    )


def scope_selector(sel, root=SITE_ROOT):
    """Rewrite one selector so it can only match inside the wrapper."""
    sel = sel.strip()
    if not sel or sel.startswith(ROOT):
        return sel

    for r in ROOT_SELECTORS:
        if sel == r:
            return root
        if sel.startswith(r) and sel[len(r):len(r) + 1] in (" ", ">"):
            return root + " " + sel[len(r):].lstrip()
        # `html.foo`, `body:focus-within` and similar: the qualifier applies to
        # the page, not to us, so the wrapper simply takes its place.
        if sel.startswith(r) and sel[len(r):len(r) + 1] in (".", ":", "["):
            return root + sel[len(r):]

    if sel == "*":
        # The wrapper is itself part of "everything inside the activity".
        return root + ", " + root + " *"
    if sel.startswith("*"):
        return root + " " + sel

    return root + " " + sel


REM_RE = re.compile(r"(-?\d*\.?\d+)rem\b")


def rem_to_px(body):
    """Resolve rem lengths against the site's real root size.

    Only declaration bodies are converted. `rem` inside a media query prelude
    is already immune to a host's root font size — media features always
    resolve against the initial value — so converting there would be wrong.
    """
    def sub(m):
        value = float(m.group(1)) * REM_BASE_PX
        text = f"{value:.4f}".rstrip("0").rstrip(".")
        return (text or "0") + "px"
    return REM_RE.sub(sub, body)


def filter_root_declarations(body):
    """Strip page-layout declarations from a rule being mapped onto the wrapper."""
    kept = []
    for decl in body.split(";"):
        name = decl.split(":", 1)[0].strip().lower()
        if name and name in ROOT_DROP_DECLARATIONS:
            continue
        if decl.strip():
            kept.append(decl.strip())
    return ";\n  ".join(kept) + (";" if kept else "")


def scope_rule(prelude, body):
    selectors = split_selectors(prelude)
    if any(is_root_selector(s) for s in selectors):
        body = filter_root_declarations(body)
        if not body.strip():
            return None
    scoped = [scope_selector(s) for s in selectors]
    return ",\n".join(scoped) + " {\n  " + rem_to_px(body.strip()) + "\n}"


def transform_css(text, scope=True):
    """Prune site chrome, then scope everything that is left under the wrapper."""
    out = []
    for kind, prelude, body, raw in split_css(text):
        if kind == "rule":
            if is_chrome(prelude):
                continue
            out.append(scope_rule(prelude, body) if scope else raw)
        elif kind == "at-block":
            head = prelude.split("{")[0].strip()
            # Keyframe percentages are not selectors and must not be scoped.
            # There are none in this collection today; the guard is here so
            # that adding one does not silently produce broken CSS.
            if head.lower().startswith(("@keyframes", "@font-face",
                                        "@counter-style", "@property")):
                out.append(raw)
                continue
            inner = transform_css(body, scope)
            if not inner.strip():
                continue
            out.append(head + " {\n" + inner + "\n}")
        else:
            out.append(raw)
    return "\n".join(x for x in out if x)


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
# is parsed as HTML. `<\/script` is the standard neutralisation and is safe
# everywhere it can legally appear: in a string literal `"<\/script>"` is
# identical to `"</script>"`, and in a regular expression `\/` is an escaped
# solidus. The same reasoning covers `<\!--`.
#
# `<script` on its own is only dangerous after a `<!--`, because that is the
# only route into the parser's double-escaped state. It is left alone unless
# such a comment is present, because the obvious escape (`<\script`) would
# change the meaning of a regular expression - `\s` is a character class.

SCRIPT_CLOSE_RE = re.compile(r"</(script)", re.I)
HTML_COMMENT_OPEN_RE = re.compile(r"<!--")
SCRIPT_OPEN_RE = re.compile(r"<(script)", re.I)


def escape_for_script(text, origin):
    text = SCRIPT_CLOSE_RE.sub(r"<\\/\1", text)
    if HTML_COMMENT_OPEN_RE.search(text):
        text = HTML_COMMENT_OPEN_RE.sub(r"<\\!--", text)
        if SCRIPT_OPEN_RE.search(text):
            print(f"  warning: {origin} contains both '<!--' and '<script'.")
    return text


def escape_for_style(text, origin):
    if re.search(r"</style", text, re.I):
        print(f"  warning: {origin} contains '</style' - escaping it.")
    return re.sub(r"</(style)", r"<\\/\1", text, flags=re.I)


def assert_self_contained(css, js, markup, tool):
    """Refuse to write a copy that will not parse, will reach for the network,
    or will leak styling into the page around it."""
    problems = []

    if re.search(r"(?<!\\)</script", js, re.I):
        problems.append("script payload has an unescaped '</script'")
    if re.search(r"(?<!\\)</style", css, re.I):
        problems.append("style payload has an unescaped '</style'")

    # Every selector must be scoped. Checking the payload rather than trusting
    # the transformer is the point: this is what catches a selector shape the
    # scoper did not anticipate. Comments are stripped first for the same
    # reason they are stripped before transforming - the file markers this
    # script writes would otherwise read as selectors.
    for kind, prelude, body, raw in split_css(strip_comments(css)):
        if kind == "rule":
            for sel in split_selectors(prelude):
                if not sel.startswith(ROOT):
                    problems.append(f"unscoped selector: {sel[:60]}")
        elif kind == "at-block":
            head = prelude.split("{")[0].strip().lower()
            if head.startswith(("@keyframes", "@font-face")):
                continue
            for k2, p2, b2, _ in split_css(body):
                if k2 == "rule":
                    for sel in split_selectors(p2):
                        if not sel.startswith(ROOT):
                            problems.append(
                                f"unscoped selector in {head}: {sel[:50]}")

    if re.search(r"<script\b[^>]*\bsrc=", markup, re.I):
        problems.append("markup contains a <script src=...>")
    if re.search(r'<link\b[^>]*rel=["\']?\s*stylesheet', markup, re.I):
        problems.append("markup contains a <link rel=stylesheet>")
    if re.search(r"data-activity-export|data-copy-activity", markup, re.I):
        problems.append("markup still contains the export control")
    for m in re.finditer(r'\b(?:src|href)\s*=\s*"([^"]+)"', markup):
        value = m.group(1)
        if value.startswith(("data:", "#", "http://", "https://", "mailto:")):
            continue
        problems.append(f"markup has a relative reference: {value}")

    if problems:
        raise SystemExit(
            f"{tool}: export would not be self-contained:\n  - "
            + "\n  - ".join(dict.fromkeys(problems)))


# ---------------------------------------------------------------------------
# HTML
# ---------------------------------------------------------------------------

def extract_main(html, tool):
    m = re.search(r"<main\b[^>]*>(.*)</main\s*>", html, re.S | re.I)
    if not m:
        raise SystemExit(f"{tool}: no <main> element found.")
    return m.group(1)


#: Blocks removed from every export, identified by an attribute on their
#: outermost element.
#:
#:   data-activity-export   the Copy control itself. A copy must never arrive
#:                          carrying a button that looks for a file beside it.
#:   data-instructor-only   material addressed to whoever is running the
#:                          session rather than to the learner. One tool, the
#:                          Alpha Trap, predates the convention of keeping that
#:                          in teaching-notes.md and has a "For educators"
#:                          section on the page; it also carries the only
#:                          repository-relative links in any tool's <main>.
STRIP_ATTRIBUTES = ("data-activity-export", "data-instructor-only")


def strip_marked(markup, attribute):
    """Remove elements carrying `attribute`, with any comment introducing them.

    The element nests, so its close is found by counting rather than by a
    non-greedy match: the block is a `<div class="section">` wrapping a
    container wrapping the control, and `.*?</div>` would stop at the first
    inner close and leave the outer two behind.

    The comment above the block goes with it. That comment explains the block
    to somebody reading this repository, and it names the very attribute the
    exporter searches for — leaving it behind would both confuse a lecturer
    and trip the self-containment check.
    """
    open_tag_re = re.compile(
        r"<(?P<tag>[a-zA-Z][\w-]*)\b[^>]*\b" + re.escape(attribute) + r"\b[^>]*>")
    count = 0
    while True:
        m = open_tag_re.search(markup)
        if not m:
            break
        tag = m.group("tag")
        open_re = re.compile(r"<" + tag + r"\b", re.I)
        close_re = re.compile(r"</" + tag + r"\s*>", re.I)
        depth, pos = 1, m.end()
        while depth and pos < len(markup):
            nxt_open = open_re.search(markup, pos)
            nxt_close = close_re.search(markup, pos)
            if not nxt_close:
                raise SystemExit("unbalanced export block markup")
            if nxt_open and nxt_open.start() < nxt_close.start():
                depth += 1
                pos = nxt_open.end()
            else:
                depth -= 1
                pos = nxt_close.end()
        start = m.start()
        # Take a comment immediately above it, and the blank line below.
        prefix = markup[:start]
        cm = re.search(r"(?:[ \t]*<!--(?:(?!-->).)*?-->[ \t]*\n)[ \t]*$",
                       prefix, re.S)
        if cm:
            start = cm.start()
        end = pos
        trailing = re.match(r"[ \t]*\n", markup[end:])
        if trailing:
            end += trailing.end()
        markup = markup[:start] + markup[end:]
        count += 1
    return markup, count


def strip_export_control(markup):
    """Remove every block marked for exclusion. Returns (markup, control_count)
    where control_count counts only the export control, so the caller can warn
    about a tool page that has not had one added yet."""
    control_count = 0
    for attribute in STRIP_ATTRIBUTES:
        markup, n = strip_marked(markup, attribute)
        if attribute == "data-activity-export":
            control_count = n
    return markup, control_count


def page_title(html):
    m = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    title = m.group(1).strip() if m else "Interactive activity"
    return title.split("—")[0].strip()


def reindent(markup, spaces):
    lines = markup.split("\n")
    trimmed = [ln[4:] if ln.startswith("    ") else ln for ln in lines]
    pad = " " * spaces
    return "\n".join(pad + ln if ln.strip() else "" for ln in trimmed)


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

BANNER = """<!-- {title}
     From Open Psychology Interactives - https://github.com/utman5454/open-psychology-interactives
     Self-contained: no stylesheets, scripts, fonts, images or network requests.
     Styles are scoped to .opi-activity and do not affect the page around them.
     Nothing is saved, sent or tracked. MIT licensed; please keep this notice.
     Paste anywhere that accepts HTML, or save as a .html file and open it. -->"""


def build(tool_dir):
    tool_dir = pathlib.Path(tool_dir).resolve()
    name = tool_dir.name
    index = tool_dir / "index.html"
    if not index.exists():
        raise SystemExit(f"{name}: no index.html")

    html = index.read_text(encoding="utf-8")

    css_parts = [RESET_CSS, HOST_RESISTANCE_CSS]
    for path in SHARED_CSS + [tool_dir / "tool.css"]:
        if not path.exists():
            continue
        rel = path.relative_to(REPO).as_posix()
        raw = strip_comments(path.read_text(encoding="utf-8"))
        css_parts.append(f"/* {rel} */\n" + transform_css(raw))

    markup, stripped = strip_export_control(extract_main(html, name))
    if stripped == 0:
        print(f"  note: {name} has no [data-activity-export] block")
    body = reindent(markup.strip("\n"), 2)

    # Conditional components are decided from the *stripped* markup, so a
    # component used only by a block that never reaches the copy is not
    # inlined into it either.
    scripts = list(SHARED_JS)
    for attribute, path in CONDITIONAL_JS.items():
        if attribute in body:
            scripts.append(path)

    js_parts = []
    for path in scripts + [tool_dir / "tool.js"]:
        if not path.exists():
            continue
        rel = path.relative_to(REPO).as_posix()
        js_parts.append(
            f"/* ---- {rel} ---- */\n"
            + escape_for_script(path.read_text(encoding="utf-8"), rel))

    css_payload = escape_for_style("\n\n".join(css_parts), name)
    js_payload = "\n".join(js_parts)
    assert_self_contained(css_payload, js_payload, body, name)

    return f"""{BANNER.format(title=page_title(html))}
<div class="opi-activity">
<style>
{css_payload}
</style>

{body}

<script>
{js_payload}
</script>
</div>
"""


def tool_dirs():
    return sorted(
        p.parent for p in REPO.glob("modules/*/tools/*/index.html"))


def main():
    ap = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("tool", nargs="*", help="tool directory")
    ap.add_argument("--all", action="store_true", help="every tool in modules/")
    ap.add_argument("--check", action="store_true",
                    help="report staleness and exit non-zero if any is stale")
    ap.add_argument("--quiet", action="store_true", help="only report problems")
    args = ap.parse_args()

    targets = tool_dirs() if args.all else [pathlib.Path(t) for t in args.tool]
    if not targets:
        ap.error("give one or more tool directories, or --all")

    stale, written = [], 0
    for tool_dir in targets:
        doc = build(tool_dir)
        out = pathlib.Path(tool_dir) / "standalone.html"
        existing = out.read_text(encoding="utf-8") if out.exists() else None
        if args.check:
            if existing != doc:
                stale.append(out)
                print(f"STALE: {out.relative_to(REPO) if out.is_absolute() else out}")
            elif not args.quiet:
                print(f"ok: {pathlib.Path(tool_dir).name}")
        else:
            if existing != doc:
                out.write_text(doc, encoding="utf-8", newline="\n")
                written += 1
            if not args.quiet:
                kb = len(doc.encode("utf-8")) / 1024
                print(f"{pathlib.Path(tool_dir).name}: {kb:.0f} KB")

    if args.check:
        if stale:
            print(f"\n{len(stale)} of {len(targets)} exports are stale. "
                  "Run scripts/build-standalone.py --all to rebuild.")
            return 1
        print(f"\nAll {len(targets)} exports are up to date.")
        return 0

    print(f"\n{written} written, {len(targets) - written} already current.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
