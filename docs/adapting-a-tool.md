# Adapting a tool

How to take a tool from this project and change it for your own course, and —
because the two are the same job — how to build a new one against the shared
shell.

> **Current status.** Seventy-five tools are published across all five modules,
> so there is plenty to copy. They are built on the shared shell
> (`components/interactive-shell.css` and `components/interactive-shell.js`),
> documented here in full, plus `components/tool-kit.css`, which styles the
> page furniture around the shell — prediction panels, feedback boxes,
> verdicts, tables and charts. A tool folder plus those four files is
> self-contained.
>
> If you want one activity rather than a whole tool folder, every tool has a
> **Copy activity HTML** button; see [Just one activity, without the
> repository](#just-one-activity-without-the-repository).

---

## What you are allowed to do

Everything in this repository is MIT licensed. You may copy a tool, change
anything about it, host your version anywhere, use it in teaching you are paid
for, and never mention this project. The one condition is that the copyright
notice and licence text travel with any substantial portion you reuse — keeping
the `LICENSE` file in your copy satisfies this.

A credit line such as *"Adapted from Open Psychology Interactives"* with a link
back is appreciated but is not required beyond that notice.

## Getting a copy

No account or Git knowledge is needed for the simplest route:

1. Go to <https://github.com/utman5454/open-psychology-interactives>
2. **Code → Download ZIP**
3. Unzip it and open `index.html` by double-clicking.

Or, with Git:

```sh
git clone https://github.com/utman5454/open-psychology-interactives.git
cd open-psychology-interactives
```

Everything works from your own disk. There is no install step, no `npm install`,
nothing to compile.

### Just one activity, without the repository

If you only want a single activity on a page of your own, every tool carries a
**Copy activity HTML** button at the foot of the page. It puts a complete,
self-contained copy of that one activity on your clipboard: markup, styles,
script and accessibility text in a single block, with no stylesheet links, no
script tags pointing anywhere, no images and no network requests at all. Paste
it into a blank `.html` file and open it, or into any page that accepts HTML —
a VLE page, a module handbook, your own site.

What you get is the activity — the objective, the prediction, the laboratory,
the challenge and the debrief. What you do not get is this site's header,
navigation, breadcrumbs or footer, the Copy button itself, or any link back
here.

The teaching notes are deliberately not included, because they are written for
whoever is running the session rather than for the page. Take
`teaching-notes.md` from the tool's folder if you want them.

**It will not disturb the page you paste it into.** Everything is wrapped in a
`<div class="opi-activity">` and every style is scoped to it, so nothing the
copy carries can reach your headings, buttons, tables or typography. The
defence runs the other way too: the activity restates the styling it depends
on, so a page that flattens list padding, colours every `td`, or restyles every
`button` does not flatten or restyle the activity.

The copy keeps its **Full screen** button, which expands just the activity —
useful when it is sitting in the middle of a busy VLE page. It does not keep
the Copy button; that one belongs to this site.

Two things to know:

- **One copy per page.** Activities use element IDs internally, and two copies
  on the same page would collide. Different activities on one page are usually
  fine; the same one twice is not.
- **Paste as HTML, not as text.** An editor that escapes the markup, or one
  that strips `<style>` and `<script>`, will give you the words without the
  activity. Most VLEs have an HTML or source view that pastes it properly.
- **Full screen needs permission.** If your VLE shows the activity inside an
  `<iframe>` without `allow="fullscreen"`, the browser refuses, and the button
  removes itself rather than sitting there doing nothing. Everything else works
  as normal.

The file behind the button is `standalone.html` in the tool's own folder, so it
can also be opened, read or downloaded directly. It is generated rather than
maintained by hand — see [Regenerating a standalone
copy](#regenerating-a-standalone-copy) if you change a tool.

## Where tools live

The repository is organised into five canonical modules. Every tool sits inside
one of them:

```
modules/<module-slug>/tools/<tool-slug>/
├── index.html          the tool itself
├── metadata.json       the catalogue record
├── teaching-notes.md   educator guidance
└── standalone.html     generated; the embeddable copy of the activity
```

`standalone.html` is the only generated file in the repository. Do not edit it
by hand — see [Regenerating the exports](#regenerating-the-exports).

The five module slugs are fixed:

| Module | Slug |
| --- | --- |
| Cognitive Psychology | `cognitive` |
| Research Methods | `research-methods` |
| Neuropsychology | `neuropsychology` |
| Social and Critical Psychology | `social-critical-psychology` |
| Personality and Individual Differences | `personality-individual-differences` |

Tool-specific CSS and JavaScript live in the same folder, conventionally
`tool.css` and `tool.js`.

A tool depends on four shared files, all referenced with relative paths:

```
assets/css/main.css                 site styling and design tokens
components/interactive-shell.css    the shell's styling
components/tool-kit.css             page furniture around the shell
components/interactive-shell.js     the shell's behaviour
```

To lift a tool out of this repository entirely, take its folder plus those four
files and keep the relative paths between them intact.

`tool-kit.css` styles the parts of a tool page that sit outside the
interactive itself: prediction panels, feedback boxes, verdict boxes, data
tables, charts and stage tracks. It was added once eleven tools existed and the
same four hundred lines were otherwise going to be maintained in a dozen
places. The one exception is `12-alpha-trap`, which predates it and carries its
own copy.

## The three most common adaptations

### Change the starting values

Look for the `value`, `min`, `max` and `step` attributes on the controls in
`index.html`. Changing `value` changes where the tool starts; the reset button
returns to the values your `tool.js` reset handler sets, so change both.

### Change the wording

The heading, the one-sentence brief, the control labels and the teaching notes
are all plain text in `index.html`. Edit them directly. If you teach in another
language, translate them and change `<html lang="en">` to match — the tools use
no baked-in text in images, so translation is a text edit.

### Change the worked example

If a tool ships with an example dataset or scenario, it will be a small array or
object near the top of `tool.js`, marked with a comment. Replace it with
something from your own field.

## The shell: markup contract

The shell gives you a consistent frame and the fiddly accessibility plumbing.
This is the markup it expects. Class names drive the styling; `data-*`
attributes are what the JavaScript looks for.

```html
<!-- The root. data-reset-message is optional; it customises what the status
     line says after a reset. -->
<section class="interactive" id="my-tool"
         data-interactive
         data-reset-message="Back to the starting values.">

  <header class="interactive__header">
    <!-- h2, not h1: the page's h1 is the tool's title in the page header. -->
    <h2 class="interactive__title">Sampling distribution of the mean</h2>
    <p class="interactive__brief">
      One sentence saying what this shows. Nothing more.
    </p>
  </header>

  <div class="interactive__body">

    <!-- Controls come first in the DOM so the tab order reads
         "change something, then see the result". -->
    <form class="interactive__controls" data-interactive-controls>
      <fieldset>
        <legend>Sampling</legend>

        <div class="control">
          <div class="control__header">
            <label class="control__label" for="sample-size">Sample size</label>
            <!-- output[for] pairs the value with its input; the shell keeps
                 the text in step via bindRange(). -->
            <output class="control__value" for="sample-size">25</output>
          </div>
          <input type="range" id="sample-size" min="2" max="200" step="1" value="25">
          <p class="control__hint">Cases drawn in each sample.</p>
        </div>

        <label class="control--choice">
          <input type="checkbox" id="show-population">
          Show the population distribution
        </label>
      </fieldset>
    </form>

    <!-- Where you draw. Inline SVG or <canvas>. -->
    <div class="interactive__stage" data-interactive-stage>
      <svg viewBox="0 0 400 240" role="img" aria-labelledby="chart-title">
        <title id="chart-title">Distribution of 500 sample means</title>
        <!-- ... -->
      </svg>

      <!-- The text equivalent. Not optional, and not hidden on small screens:
           this is what a screen-reader user gets instead of the graphic. -->
      <dl class="interactive__readout">
        <div><dt>Samples drawn</dt><dd>500</dd></div>
        <div><dt>Mean of means</dt><dd>4.98</dd></div>
        <div><dt>Standard error</dt><dd>0.41</dd></div>
      </dl>
    </div>

  </div>

  <!-- Polite live region. Leave it empty; the shell writes into it. -->
  <p class="interactive__status" data-interactive-status role="status"></p>

  <div class="interactive__actions">
    <button type="button" data-draw>Draw a sample</button>
    <button type="button" data-variant="secondary" data-interactive-reset>Reset</button>
  </div>

  <details class="interactive__notes">
    <summary>Teaching notes</summary>
    <div>
      <p>What to ask students, and the misconception this targets.</p>
    </div>
  </details>

</section>
```

Load order in the page `<head>`:

```html
<link rel="stylesheet" href="../../../../assets/css/main.css">
<link rel="stylesheet" href="../../../../components/interactive-shell.css">
<link rel="stylesheet" href="tool.css">
<script src="../../../../components/interactive-shell.js" defer></script>
<script src="tool.js" defer></script>
```

Four levels of `../` because a tool sits at
`modules/<module-slug>/tools/<tool-slug>/index.html`. Both scripts use `defer`,
which also guarantees the shell is defined before `tool.js` runs.

## The shell: JavaScript API

```js
const shell = InteractiveShell.attach('#my-tool');
```

Returns `null` and warns to the console if the selector matches nothing.

| Member | What it does |
| --- | --- |
| `shell.root` | The `.interactive` element. |
| `shell.controls` | The `[data-interactive-controls]` element, or `null`. |
| `shell.stage` | The `[data-interactive-stage]` element, or `null`. |
| `shell.status` | The live-region element, or `null`. |
| `shell.announce(message, opts)` | Write to the live region. Debounced by 350 ms; pass `{immediate: true}` for discrete actions such as a button press. Identical consecutive messages are still announced. |
| `shell.onReset(handler)` | Register a reset callback. Several may be registered; they run in the order added. |
| `shell.reset(opts)` | Run the reset handlers, then re-sync every bound range. `{silent: true}` suppresses the announcement — useful for the initial draw. |
| `shell.bindRange(input, opts)` | Keep a range input's `<output>` in step. See below. |
| `shell.prefersReducedMotion()` | `true` if the reader has asked for reduced motion. |

`bindRange` options:

- `format(value) → string` — what appears in the `<output>`.
- `describe(value) → string` — what goes into `aria-valuetext`. Defaults to
  `format`. Use it to turn a bare number into something a screen reader can say
  usefully.
- `onInput(value)` — called after the display updates. Redraw here.

A complete `tool.js` skeleton:

```js
(function () {
  'use strict';

  const shell = InteractiveShell.attach('#my-tool');
  if (!shell) return;

  const DEFAULTS = { sampleSize: 25, showPopulation: false };
  let state = Object.assign({}, DEFAULTS);

  shell.bindRange('#sample-size', {
    format: n => String(n),
    describe: n => n + ' cases per sample',
    onInput: n => { state.sampleSize = n; draw(); }
  });

  shell.root.querySelector('[data-draw]').addEventListener('click', () => {
    const result = drawSample(state.sampleSize);
    draw();
    // Discrete action: announce straight away, and say what changed.
    shell.announce(
      `Sample of ${state.sampleSize} drawn. Mean ${result.mean.toFixed(2)}.`,
      { immediate: true }
    );
  });

  shell.onReset(() => {
    state = Object.assign({}, DEFAULTS);
    // Just restore the input's value. Assigning to .value does not fire an
    // `input` event, but reset() re-syncs every bound range afterwards, so
    // the <output> and aria-valuetext follow on their own.
    shell.root.querySelector('#sample-size').value = DEFAULTS.sampleSize;
    draw();
  });

  function draw() {
    // Redraw the SVG *and* update the .interactive__readout text.
    // If shell.prefersReducedMotion() is true, draw the end state directly
    // rather than animating towards it.
  }

  shell.reset({ silent: true });   // establish the starting state
})();
```

## The other two files

A tool folder is not complete without them.

### `metadata.json`

The catalogue record. The same object is copied into the module's `tools` array
in `data/catalogue.json`. Required fields are listed in
[`../CONTRIBUTING.md`](../CONTRIBUTING.md); the full standard is in
[`../CLAUDE.md`](../CLAUDE.md).

The `status` field is what controls visibility: only `"published"` makes a tool
appear on its module page. Leave it as `"in-progress"` while you build.

### `teaching-notes.md`

Educator guidance: intended level, learning objectives, estimated duration,
preparation, suggested lecture or seminar use, the prediction question, the
activity sequence, debrief questions, likely misconceptions, limitations and
cautions, accessibility considerations, an optional extension task, and citation
notes where appropriate.

If you adapt a tool, adapt its teaching notes too — notes that describe a
different version of the tool are worse than none.

## Regenerating the exports

Every tool keeps its exported copy in `standalone.html`, beside `index.html`.
The canonical files are the source of truth; `standalone.html` is generated
from them, and committed so it can be reviewed in a diff and opened directly.

**Two commands.** Rebuild:

```sh
python scripts/build-standalone.py --all
```

and check, which is the same build compared against what is committed. It
prints every stale export and exits non-zero, so it works as a guard in a
pre-commit hook or CI:

```sh
python scripts/build-standalone.py --all --check
```

Rebuild after changing a tool's markup, script or styles, **and** after
changing any of `assets/css/main.css`, `components/interactive-shell.css`,
`components/tool-kit.css` or `components/interactive-shell.js` — those are
inlined into all seventy-five, so one edit makes every export stale. `--check`
is what stops that going unnoticed.

Nothing else is needed: no npm, no bundler, no lockfile. Python 3 and the
standard library.

### What the build does

1. Takes the contents of `<main>`, and removes any element marked
   `data-activity-export` (the Copy control) or `data-instructor-only`
   (material addressed to whoever is running the session). The **Full screen**
   control is deliberately not removed: it is a usability control and is most
   useful precisely when the activity has been embedded somewhere busy. That is
   why the two controls sit in sibling blocks and only one carries
   `data-activity-export`.
2. Inlines the four stylesheets, dropping the site-chrome rules, and rewrites
   every selector to sit under `.opi-activity` — see below.
3. Inlines `components/interactive-shell.js` and the tool's `tool.js`, and
   leaves out `assets/js/main.js` entirely: that file is navigation, the footer
   year and the catalogue fetch, none of which an activity calls, and the
   catalogue fetch would be a dependency on this repository.
4. Refuses to write anything that is not self-contained.

### How the styles are made safe to embed

The copy has to survive a page it knows nothing about, and leave that page
alone. Both directions come out of one specificity ladder:

| | selector | specificity |
| --- | --- | --- |
| a host element rule | `td` | (0,0,1) |
| the export's defensive reset | `.opi-activity *` | (0,1,0) |
| a host themed rule | `.theme .content td` | (0,2,1) |
| the export's host resistance | `.opi-activity`×3 `:where(td)` | (0,3,0) |
| the activity's own rules | `.opi-activity`×3 `.data-table td` | (0,4,1) |

The reset is `all: revert`, which throws away the host's declarations and lets
inherited properties fall back to what the wrapper sets. Elements *inside* an
`<svg>` are left out of the revert so chart presentation attributes survive.

The reset alone was not enough, and a real VLE proved it: it sits at (0,1,0),
and an ordinary themed rule beats it. Because the shared stylesheets set colour
on only three bare elements — `body`, `a` and `code` — table cells and body text
inherited theirs, and an inherited value loses to *any* rule that matches the
element directly. In dark mode that meant dark text on a dark panel. The
resistance block states those colours instead of leaving them to inheritance,
and `:where()` keeps it at exactly three classes: high enough to clear any
realistic themed selector, low enough that every rule the collection writes
still outranks it.

There is no `!important` anywhere in this, on purpose. Three tools colour table
cells through `td[data-strength]` and `td[data-empty]` attributes, and a blanket
important rule would have flattened their data coding.

**The one case this cannot win** is a host rule scoped by `id` — `#content td
{ color: … }`. An ID beats any number of classes, so only `!important` could
override it, at the cost above. If an activity's text looks wrong in a
particular platform, inspect a cell and see whether the winning rule uses an ID;
that is the one shape of host CSS the export cannot out-rank.

`:root`, `html` and `body` map onto the wrapper, minus the declarations that
belong to a page rather than a `<div>` — `body` is a flex column filling the
viewport, and a copy of that would stretch the activity to full screen height
inside somebody's article.

`rem` lengths are resolved to `px` in declarations, though not in media query
preludes, which are already immune. The site sets no root font size, so this
reproduces the canonical rendering exactly while making it immune to a host
that writes `html { font-size: 62.5% }`.

### Refusals

The build fails rather than writing a copy that has an unescaped `</script` in
its JavaScript, an unscoped selector, a relative `src` or `href` in the markup,
or the export control still in it. None of these is hypothetical — each one is
a bug this script shipped once. The shell's own documentation comment contains
a literal `</script>`, which ends the inlined block early if it is not escaped.

### Full screen

`components/activity-fullscreen.js` expands the exported `.opi-activity`
wrapper where there is one and this site's `<main>` otherwise — never `<body>`,
which would take the header and footer with it.

The label is driven by the `fullscreenchange` event rather than by the click,
which is what makes Escape work: leaving full screen that way fires no click.
The full-screen element gets `overflow-y: auto`, without which an activity
taller than the display would have its debrief clipped out of reach, and a
background of its own, because the default backdrop is black.

Two feature checks, not one. `requestFullscreen` says whether the browser has
the API; `document.fullscreenEnabled` says whether this document is *permitted*
to use it, which is the one that matters inside a VLE iframe with no
`allow="fullscreen"`. When permission is absent the control hides itself rather
than remaining as something that looks pressable and is not.

### Adding the controls to a new tool

```sh
python scripts/add-export-control.py <tool-dir>     # or --all, or --check
```

It is idempotent, and it will replace controls that have drifted from the
current markup. It adds the two shared scripts after the shell they sit
alongside, and puts the utilities row last inside `<main>` — inside, because
that is what the exporter reads and therefore what it can edit; last, because
most tools keep the laboratory in a section that starts `hidden`, and a lecturer
should not have to work through an activity to expand or copy it.

Note that the two scripts are keyed differently: this script removes a previous
block by `data-activity-utilities`, the outer wrapper, while the exporter
removes only the inner `data-activity-export`. Using the exporter's key here
would strip the copy control and let the utilities row accumulate on each run.

## Rules worth keeping when you adapt

You may of course do as you like with your copy. These are the constraints the
originals are built under, and they are cheap to preserve:

- **No dependencies.** Plain HTML, CSS and JavaScript. No framework, no build
  step, no CDN. This is what makes the tools still work in a decade and work
  offline.
- **Relative paths only.** An absolute path breaks the moment the site is hosted
  under a sub-path — which it is, at `/open-psychology-interactives/`. The one
  approved exception is `404.html`; the reason is documented in that file.
- **Nothing leaves the browser.** No analytics, no external fonts, no fetches to
  third-party services. Student responses stay in the tab.
- **No copyrighted media.** No photographs, stock images or icon fonts. Graphics
  are drawn with SVG, canvas or CSS.
- **Keep the text equivalent.** If you change the chart, change the readout to
  match. A visualisation without its text version excludes people.
- **Keep it to one idea.** The strongest temptation when adapting is to add
  "just one more" control. Resist it, or build a second tool.

## Hosting your version

Any static host works, because there is nothing to run server-side. GitHub Pages
is the least trouble:

1. Push your copy to a GitHub repository.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder
   `/ (root)`.
3. Keep the `.nojekyll` file at the repository root. Without it GitHub's Jekyll
   step ignores any file or folder whose name begins with an underscore.
4. Update the project prefix in `404.html` to match your repository name, and
   the `canonical` and `og:url` tags in each page's `<head>`.
5. Your site appears at `https://<username>.github.io/<repository>/`.

Because everything else is relative, the same files also work from a university
web server, a VLE file upload, a USB stick, or a local folder.

## Contributing your version back

If your adaptation would help other people teaching the same topic, a pull
request is welcome. See [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
