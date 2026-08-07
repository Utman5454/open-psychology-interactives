# Adapting a tool

How to take a tool from this project and change it for your own course, and —
because the two are the same job — how to build a new one against the shared
shell.

> **Current status.** Twelve tools are published, all in Personality and
> Individual Differences, so there is plenty to copy. They are built on the
> shared shell (`components/interactive-shell.css` and
> `components/interactive-shell.js`), documented here in full, plus
> `components/tool-kit.css`, which styles the page furniture around the shell —
> prediction panels, feedback boxes, verdicts, tables and charts. A tool folder
> plus those four files is self-contained.

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

## Where tools live

The repository is organised into five canonical modules. Every tool sits inside
one of them:

```
modules/<module-slug>/tools/<tool-slug>/
├── index.html          the tool itself
├── metadata.json       the catalogue record
└── teaching-notes.md   educator guidance
```

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
