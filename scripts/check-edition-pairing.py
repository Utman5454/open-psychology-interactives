#!/usr/bin/env python3
"""Check that the original and Simplified editions have not drifted apart.

    python3 scripts/check-edition-pairing.py
    python3 scripts/check-edition-pairing.py --quiet

Exits 0 when the two editions are structurally in step, 1 otherwise.

The two editions share no runtime code and are built from separate trees, so
nothing stops one of them changing shape without the other. This script is the
gate that makes that impossible to do quietly. It reads four things and checks
them against each other:

    data/catalogue.json                       the original edition's index
    modules/*/tools/*/                        the originals on disk
    simplified/modules/*/tools/*/metadata.json  the Simplified Edition's source
    data/catalogue-simplified.json            its generated index
    index.html                                the entry point from the public site

It is deliberately structural. It does not compare wording, learning
objectives or behaviour between an activity and its twin, and it is not meant
to: an activity that keeps its pairing while diverging in content is doing
exactly what a simplified edition is for. What it stops is a pairing that has
quietly become wrong, which is the failure nobody notices until a reader
follows a link into a 404.

Independent of scripts/build-simplified-catalogue.py on purpose. That script
validates before it writes; this one re-derives everything from the files as
committed, so a hand-edited catalogue is caught rather than trusted.
"""

import argparse
import json
import pathlib
import re
import sys
from collections import Counter, defaultdict

REPO = pathlib.Path(__file__).resolve().parent.parent

EXPECTED_COUNTS = {
    "research-methods": 21,
    "cognitive": 12,
    "neuropsychology": 12,
    "personality-individual-differences": 18,
    "social-critical-psychology": 12,
}
TOTAL = 75


def load_json(relative):
    path = REPO / relative
    if not path.exists():
        return None, "%s is missing" % relative
    try:
        with path.open(encoding="utf-8") as handle:
            return json.load(handle), None
    except json.JSONDecodeError as error:
        return None, "%s is not valid JSON: %s" % (relative, error)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0],
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--quiet", action="store_true", help="only report problems")
    args = ap.parse_args()

    problems = []
    notes = []

    def fail(message):
        problems.append(message)

    # ------------------------------------------------------- the originals
    original, error = load_json("data/catalogue.json")
    if error:
        print(error, file=sys.stderr)
        return 1

    originals = {}
    for module in original.get("modules", []):
        slug = module.get("moduleSlug")
        for tool in module.get("tools", []):
            key = (slug, tool.get("toolSlug"))
            if key in originals:
                fail("original catalogue lists %s/%s twice" % key)
            originals[key] = tool
            page = REPO / "modules" / slug / "tools" / tool.get("toolSlug", "") / "index.html"
            if not page.exists():
                fail("original %s/%s is in the catalogue but not on disk" % key)

    notes.append("original edition: %d tools in data/catalogue.json" % len(originals))
    if len(originals) != TOTAL:
        fail("original edition has %d tools, expected %d" % (len(originals), TOTAL))

    # ----------------------------------------------- the simplified source
    metadata_files = sorted((REPO / "simplified").glob("modules/*/tools/*/metadata.json"))
    simplified = []
    for path in metadata_files:
        try:
            with path.open(encoding="utf-8") as handle:
                data = json.load(handle)
        except json.JSONDecodeError as error:
            fail("%s is not valid JSON: %s" % (path.relative_to(REPO), error))
            continue
        data["_dirModule"] = path.parts[-4]
        data["_dirTool"] = path.parts[-2]
        simplified.append(data)

    notes.append("simplified edition: %d metadata files on disk" % len(simplified))
    if len(simplified) != TOTAL:
        fail("simplified edition has %d activities, expected %d"
             % (len(simplified), TOTAL))

    # ------------------------------------------------------------ pairing
    claims = defaultdict(list)
    for a in simplified:
        name = a.get("_dirTool", "?")
        module_slug = a.get("moduleSlug")

        if module_slug != a.get("_dirModule"):
            fail("%s: moduleSlug %r but the file is under modules/%s"
                 % (name, module_slug, a.get("_dirModule")))
        if a.get("toolSlug") != a.get("_dirTool"):
            fail("%s: toolSlug %r does not match its directory"
                 % (name, a.get("toolSlug")))

        paired = a.get("pairedWith")
        if not isinstance(paired, str) or not paired.strip():
            fail("%s: pairedWith is missing, empty or not a string (%r)"
                 % (name, paired))
            continue
        if "/" in paired or paired != paired.strip():
            fail("%s: pairedWith %r is malformed, it must be a bare toolSlug"
                 % (name, paired))
            continue

        key = (module_slug, paired)
        claims[key].append(name)

        if key not in originals:
            # A slug that exists in a different module would resolve as a
            # string and fail as a link, so say which module it is really in
            # rather than reporting it twice as simply absent.
            elsewhere = sorted(m for (m, t) in originals
                               if t == paired and m != module_slug)
            if elsewhere:
                fail("%s: pairedWith %r exists, but in %s rather than %s"
                     % (name, paired, ", ".join(elsewhere), module_slug))
            else:
                fail("%s: pairedWith %r has no original in module %s"
                     % (name, paired, module_slug))

        expected_path = "modules/%s/tools/%s/index.html" % (module_slug, paired)
        if a.get("originalPath") != expected_path:
            fail("%s: originalPath %r disagrees with pairedWith, expected %r"
                 % (name, a.get("originalPath"), expected_path))

    for key, names in sorted(claims.items()):
        if len(names) > 1:
            fail("original %s/%s is claimed by %d simplified activities: %s"
                 % (key[0], key[1], len(names), ", ".join(sorted(names))))

    for key in sorted(originals):
        if key not in claims:
            fail("original %s/%s has no simplified twin" % key)

    # ------------------------------------------------------------- counts
    per_module = Counter(a.get("moduleSlug") for a in simplified)
    original_per_module = Counter(m for (m, _t) in originals)
    for slug, expected in sorted(EXPECTED_COUNTS.items()):
        got = per_module.get(slug, 0)
        was = original_per_module.get(slug, 0)
        if got != expected:
            fail("module %s: %d simplified activities, expected %d"
                 % (slug, got, expected))
        if got != was:
            fail("module %s: %d simplified activities against %d originals"
                 % (slug, got, was))
    for slug in sorted(per_module):
        if slug not in EXPECTED_COUNTS:
            fail("unknown module slug in the simplified tree: %s" % slug)

    # --------------------------------------- the generated catalogue agrees
    generated, error = load_json("data/catalogue-simplified.json")
    if error:
        fail(error + " (run scripts/build-simplified-catalogue.py)")
    else:
        listed = [a for m in generated.get("modules", [])
                  for a in m.get("activities", [])]
        notes.append("simplified catalogue: %d activities listed" % len(listed))

        if generated.get("activityCount") != len(listed):
            fail("catalogue activityCount is %r but it lists %d activities"
                 % (generated.get("activityCount"), len(listed)))
        if len(listed) != len(simplified):
            fail("catalogue lists %d activities, the tree has %d"
                 % (len(listed), len(simplified)))

        listed_keys = Counter((a.get("moduleSlug"), a.get("toolSlug")) for a in listed)
        for key, count in sorted(listed_keys.items()):
            if count > 1:
                fail("catalogue lists %s/%s %d times" % (key[0], key[1], count))

        disk_keys = {(a.get("moduleSlug"), a.get("toolSlug")) for a in simplified}
        for key in sorted(set(listed_keys) - disk_keys):
            fail("catalogue lists %s/%s, which is not in the tree" % key)
        for key in sorted(disk_keys - set(listed_keys)):
            fail("%s/%s is in the tree but missing from the catalogue" % key)

        for module in generated.get("modules", []):
            slug = module.get("moduleSlug")
            declared = module.get("activityCount")
            actual = len(module.get("activities", []))
            if declared != actual:
                fail("catalogue module %s declares %r activities but lists %d"
                     % (slug, declared, actual))
            if EXPECTED_COUNTS.get(slug) not in (None, actual):
                fail("catalogue module %s lists %d activities, expected %d"
                     % (slug, actual, EXPECTED_COUNTS[slug]))

        # Every listed path has to resolve, or a link on a module page is dead.
        for a in listed:
            page = REPO / (a.get("path") or "")
            if not a.get("path") or not page.exists():
                fail("catalogue path does not resolve: %r" % a.get("path"))
            original_page = REPO / (a.get("originalPath") or "")
            if not a.get("originalPath") or not original_page.exists():
                fail("catalogue originalPath does not resolve: %r"
                     % a.get("originalPath"))

    # ------------------------- the navigation script's own module list
    # edition-nav.js holds the five module names so an activity's breadcrumb
    # can be built without waiting for a fetch. That is a second copy of data
    # the catalogue already owns, so it is checked rather than trusted.
    nav = REPO / "simplified" / "assets" / "js" / "edition-nav.js"
    if not nav.exists():
        fail("simplified/assets/js/edition-nav.js is missing")
    elif generated:
        text = nav.read_text(encoding="utf-8")
        block = re.search(r"var MODULE_NAMES = \{(.*?)\};", text, re.S)
        if not block:
            fail("edition-nav.js: could not find its MODULE_NAMES object")
        else:
            declared = dict(re.findall(r'"([^"]+)":\s*"([^"]+)"', block.group(1)))
            expected = {m["moduleSlug"]: m["module"]
                        for m in generated.get("modules", [])}
            for slug, name in sorted(expected.items()):
                if slug not in declared:
                    fail("edition-nav.js: no name for module %s" % slug)
                elif declared[slug] != name:
                    fail("edition-nav.js: module %s is named %r, the catalogue "
                         "says %r" % (slug, declared[slug], name))
            for slug in sorted(set(declared) - set(expected)):
                fail("edition-nav.js: names module %s, which is not in the "
                     "catalogue" % slug)
            notes.append("navigation script: %d module names, matching the "
                         "catalogue" % len(declared))

    # ------------------- the navigation script's paths actually resolve
    # These are strings inside JavaScript, so no HTML link checker sees them.
    # An off-by-one in the number of "../" segments produces a page that looks
    # perfectly correct and silently never finds the catalogue.
    if nav.exists() and metadata_files:
        sample = metadata_files[0].parent
        text = nav.read_text(encoding="utf-8")
        for name in ("TO_MODULE", "TO_EDITION", "TO_CATALOGUE"):
            found = re.search(r'var %s = "([^"]+)"' % name, text)
            if not found:
                fail("edition-nav.js: %s is not declared" % name)
                continue
            target = (sample / found.group(1)).resolve()
            if not target.exists():
                fail("edition-nav.js: %s is %r, which does not resolve from an "
                     "activity directory" % (name, found.group(1)))
        notes.append("navigation script: its three relative paths resolve")

    # ------------- the home page's entry point agrees with the catalogue
    # index.html names the five modules and their counts in prose, which is a
    # third copy of data the catalogue owns. It is the copy a reader sees
    # first, so a module that grows or shrinks must not be able to leave a
    # stale number on the front page.
    home = REPO / "index.html"
    if not home.exists():
        fail("index.html is missing")
    elif generated:
        text = home.read_text(encoding="utf-8")
        section = re.search(r'<section[^>]*id="simplified"[^>]*>(.*?)</section>',
                            text, re.S)
        if not section:
            fail('index.html: no <section id="simplified">, so the edition has '
                 "no entry point from the home page")
        else:
            body = section.group(1)
            if 'href="simplified/index.html"' not in body:
                fail("index.html: the Simplified Edition section does not link "
                     "to simplified/index.html")

            listed = dict(
                (slug, int(count)) for slug, count in re.findall(
                    r'href="simplified/modules/([a-z-]+)/index\.html".*?'
                    r'(\d+)\s+activities', body, re.S))
            expected = {m["moduleSlug"]: m["activityCount"]
                        for m in generated.get("modules", [])}
            for slug, count in sorted(expected.items()):
                if slug not in listed:
                    fail("index.html: the Simplified Edition section does not "
                         "link to module %s" % slug)
                elif listed[slug] != count:
                    fail("index.html: module %s is shown as %d activities, the "
                         "catalogue says %d" % (slug, listed[slug], count))
            for slug in sorted(set(listed) - set(expected)):
                fail("index.html: the Simplified Edition section links to %s, "
                     "which is not a module in the catalogue" % slug)
            if listed == expected:
                notes.append("home page: entry point present, %d module counts "
                             "matching the catalogue" % len(listed))

    # ------------------------- every activity loads the navigation layer
    unwired = []
    for path in sorted((REPO / "simplified").glob("modules/*/tools/*/index.html")):
        page = path.read_text(encoding="utf-8")
        if "edition-nav.js" not in page or "edition.css" not in page:
            unwired.append(str(path.relative_to(REPO)))
    if unwired:
        fail("%d activities do not load the navigation layer: %s"
             % (len(unwired), ", ".join(unwired[:3])
                + (" ..." if len(unwired) > 3 else "")))
    else:
        notes.append("navigation layer: loaded by all %d activities"
                     % len(metadata_files))

    # ------------------------------------------------------------- report
    if not args.quiet:
        for note in notes:
            print(note)

    if problems:
        print("\n%d pairing problem%s:"
              % (len(problems), "" if len(problems) == 1 else "s"), file=sys.stderr)
        for problem in problems:
            print("  %s" % problem, file=sys.stderr)
        return 1

    if not args.quiet:
        print("\nThe two editions are in step: %d originals, %d simplified "
              "twins, 1:1 in both directions." % (len(originals), len(simplified)))
        print("Per module: %s" % ", ".join(
            "%s %d" % (s, per_module[s]) for s in sorted(per_module)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
