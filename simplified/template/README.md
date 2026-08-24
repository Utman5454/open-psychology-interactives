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
- Every chart has a data table or an equivalent readout.
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
