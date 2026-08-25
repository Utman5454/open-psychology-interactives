# Activity template — Simplified Edition

Neutral scaffolding. Nothing in this folder is a learner activity, nothing in
it is listed in any catalogue, and nothing in it should be linked from a
module page.

| File | What it is |
| --- | --- |
| `index.html` | The skeleton to copy. Shows the shell working end to end. |
| `activity.js` | Its wiring. Shows what an activity script normally does. |
| `patterns.html` | Every optional pattern in `patterns.css`, with neutral content. A reference sheet, not a page to copy. |

Open `index.html` in a browser. It works from `file://`; nothing here needs a
server, a build step or a network request.

## Copying it

1. Copy `index.html` and `activity.js` into
   `simplified/modules/<module-slug>/tools/<tool-slug>/`.
2. **Change the three asset paths** in `<head>` from `../assets/…` to
   `../../../../assets/…`. A real activity sits four levels below
   `simplified/`; this template sits one. Getting this wrong is the classic
   failure that still works from disk in some browsers and 404s on GitHub
   Pages, so check it under a served sub-path, not only by double-clicking.
3. Drop the `.notice--caution` template banner.
4. Replace everything in square brackets.
5. Delete what the activity does not use. The choice grid is a demonstration,
   not a default — swap it for a stage, a set of controls, a cumulative
   reveal, or whatever the teaching job needs. Three of the seven golden
   references present no choices at all.
6. Drop the `patterns.css` link if you end up using none of the optional
   patterns.

## Compact activity pages

A tool page has a different job from this template: the learner should see the
prompt, every option and the control that moves them on without scrolling. Add
`workbook--compact` beside `workbook` on the root for a tighter vertical
rhythm — smaller hero, smaller headings, less card padding, `--stack` 14px and
`--gap` 10px. Text sizes, target sizes and the gaps between interactive
elements are untouched; it is the same visual system at a closer setting.

Where every option is one entry from a fixed list that is on screen every
round, `option--row` inside `style="--option-columns: 1"` lays them out as
single lines instead of cards, which keeps the whole list comparable at a
glance. `lens-head__task` puts the instruction inside the frame header rather
than in a block of its own.

## The markup contract

`workbook.js` looks for these, all optional:

| Attribute | On | What it does |
| --- | --- | --- |
| `data-workbook` | the activity root | what `Workbook.attach()` is given |
| `data-reset-message` | the activity root | what the live region says after a reset |
| `data-workbook-status` | one element | the polite live region |
| `data-workbook-progress` | the `<ol>` | the progress strip |
| `data-workbook-done-label` | the `<ol>` | overrides the hidden "completed" note |
| `data-workbook-reset` | any button | wired to `reset()` |
| `data-choice` | a choice control | what `choices.lock()` and `choices.clear()` act on |

An activity with none of them still gets a working controller — `announce()`
becomes a no-op, `progress` reports no steps, and everything else carries on.

## Figures

Wrap every SVG in `<div class="plot">`. That gives it a floor: below about
46rem the figure keeps its designed proportions and the region scrolls
sideways instead of shrinking, because a 900-unit viewBox stretched to 320px
renders its 12px labels at three pixels, which is not a small figure but an
unreadable one. `workbook.js` makes the region keyboard reachable, and
announces it, only while it actually scrolls; call `refreshFigures()` if you
change a figure's size yourself.

Two helper classes:

| Class | Use |
| --- | --- |
| `plot__over` | figure text that has to sit over data marks. Paints a halo in the figure's background colour so the glyphs keep an edge without a filled box hiding anything. |
| `field-legend` | a `<legend>` that should be seen. Most groups hide theirs because a nearby heading names them; use this when the group is the pivot of the activity. |

Two things worth knowing before you draw one:

- **A figure whose meaning depends on shape needs matching axes.** If you draw
  squares on residuals, or ask a learner to judge how strong a correlation
  looks, one unit across and one unit up have to be the same number of pixels,
  and the plot area has to be square. Aspect ratio is not decorative there.
- **Decide deliberately whether the axes are fixed or autoscaled, and say why
  in a comment.** Fixed axes are right when something must be seen to stay
  still while everything around it moves; autoscaled axes are right when the
  point is that the units do not matter. The two activities on z-scores and on
  Cohen's d make opposite choices for exactly this reason.

## Choosing patterns

Prefer a radio group in `.toggle-grid` over a `<select>` whenever the
alternatives matter pedagogically. A select hides every option the learner is
not currently on, and its longest option truncates in any narrow column. If
switching between two states *is* the lesson, the states should both be
visible.

## The JavaScript API

```js
var wb = Workbook.attach('[data-workbook]');   // null if the root is missing

wb.announce(message, { assertive })            // one sentence to the live region
wb.progress.set(index)                         // 0-based; earlier steps become "done"
wb.progress.markAllDone()
wb.progress.reset()
wb.progress.current()                          // -1 when there is no strip
wb.choices.mark(el, 'chosen'|'correct'|'incorrect'|null, { note })
wb.choices.lock(container)                     // aria-disabled, still focusable
wb.choices.unlock(container)
wb.choices.clear(container)                    // unlock and clear every state
wb.show(target) / wb.hide(target) / wb.toggle(target, on)
wb.scrollTo(target, { block, focus })          // honours prefers-reduced-motion
wb.focus(target)
wb.bindRange(input, { format, output })        // keeps <output for="…"> in step
wb.onReset(handler)
wb.reset({ announce })
Workbook.prefersReducedMotion()
```

There is no notion of a round, a question, a correct answer or a score
anywhere in `workbook.js`. If you find yourself wanting to add one, add it to
your activity instead — the point of the Simplified Edition is that different
teaching jobs keep different mechanics.

## State: what changed from the golden references

The references in `docs/simplified-reference/` signal state with classes.
This shell signals it with `data-state`, because the accessible version of
each state needs more than a tint.

| Reference | Here | Also gets |
| --- | --- | --- |
| `.progress div.active` | `data-state="current"` | `aria-current="step"` |
| `.progress div.done` | `data-state="done"` | a tick, and a hidden "completed" |
| `.option.correct` | `data-state="correct"` | solid border, tick, hidden sentence |
| — | `data-state="partial"` | **dotted** border, plus-minus, hidden sentence; a defensible answer another frame explains better |
| `.option.wrong` | `data-state="incorrect"` | **dashed** border, cross, hidden sentence |
| — | `data-state="chosen"` | dot; selected but not yet judged |
| `option.disabled` | `aria-disabled="true"` | stays in the tab order |

Every other class name is the references' own — `.hero`, `.eyebrow`,
`.progress`, `.card`, `.step-label`, `.lead`, `.casebox`, `.reveal`,
`.small`, `.actions`, `.btn`, `.btn-primary`, `.btn-secondary`,
`.synthesis`, `.diagram-wrap`, `.node-title`, `.node-sub`, `.col-head`,
`.takeaway`, `.option`, `.option-grid`, `.reveal-grid`, `.mini`,
`.evidence`, `.voice`, `.cascade`, `.lens-head`, `.peers`, `.result` — so a
golden example can be pasted in and will look right.

Two renames were unavoidable because the original names were too generic to
share a stylesheet: the references' `.flash` / `.flash-msg` / `.dot` are
`.stage` / `.stage__message` / `.stage__mark`, and their `.identity-strip` /
`.identity-chip` are `.chip-strip` / `.chip`.

## Before you call an activity finished

- Every `id` in the file is namespaced to the activity. Never `id="a"`,
  `id="t"` or `id="d"` — the references reuse those in every file, and they
  collide the moment two activities share a page.
- Every SVG has `<title>` and `<desc>` referenced by `aria-labelledby`, and
  the `<desc>` describes the argument, not the shapes.
- Every chart has a data table or an equivalent readout, and every SVG is
  inside a `.plot` wrapper.
- The figure has been looked at in a browser at 1440x900, 768px and 320px, not
  merely reasoned about: overlapping labels, text over data marks and figures
  that go unreadably dense do not show up in calculated geometry.
- Keyboard only, start to finish. Focus visible at every step, and never
  stranded after answering.
- 320px wide and projector wide.
- `prefers-reduced-motion: reduce` on: nothing scrolls smoothly, nothing
  animates, and any timed exposure has a route that is not timed.
- Greyscale: correct and incorrect are still distinguishable.
- Simulated, fictional and illustrative values are labelled as such.
- `lang="en-GB"`, and British English throughout.
- Console clean.
- Roughly 3–7 minutes of learner work, and one clear teaching job.
