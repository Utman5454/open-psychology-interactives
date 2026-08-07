# modules/personality-individual-differences/tools/

Tools for the **Personality and Individual Differences** module live here, one
folder per tool.

## Published

<!-- PUBLISHED:START -->
| Tool | Folder | Topic |
| --- | --- | --- |
| Person–Situation Interaction Theatre | [`03-person-situation-interaction-theatre/`](03-person-situation-interaction-theatre/) | Person-situation interaction: situational strength, affordances, and why the debate was badly posed |
| State versus Trait Tracker | [`04-state-versus-trait-tracker/`](04-state-versus-trait-tracker/) | States versus traits: within-person variability, repeated measurement and what a single administration cannot tell you |
| Factor Rotation Playground | [`07-factor-rotation-playground/`](07-factor-rotation-playground/) | Factor analysis: what rotation changes, what it cannot change, and why simple structure is a criterion rather than a discovery |
| Facet-Level Detective | [`09-facet-level-detective/`](09-facet-level-detective/) | Trait structure: what a broad domain score averages away, and the bandwidth-fidelity trade-off |
| The Alpha Trap | [`12-alpha-trap/`](12-alpha-trap/) | Reliability: why a high Cronbach's alpha is not validity, unidimensionality or evidence of a good measure |
| “Explain This Person” Courtroom | [`24-explain-this-person-courtroom/`](24-explain-this-person-courtroom/) | Explanation and underdetermination: why fitting a case is cheap and predicting something distinctive is not |
| Intelligence-Test Battery Builder | [`31-intelligence-test-battery-builder/`](31-intelligence-test-battery-builder/) | Intelligence testing: construct coverage, the trade-offs in battery construction, and validity as a property of a use |
| Culture-Fair Test Challenge | [`34-culture-fair-test-challenge/`](34-culture-fair-test-challenge/) | Culture-fair testing: construct-irrelevant demand, opportunity to learn a format, and what comparability requires |
| Twin-Study Simulator | [`39-twin-study-simulator/`](39-twin-study-simulator/) | Behaviour genetics: what heritability is a property of, and which way each broken assumption bends the estimate |
| Gene × Environment Interaction Visualiser | [`42-gene-environment-interaction-visualiser/`](42-gene-environment-interaction-visualiser/) | Gene-environment interaction: how the sampled environmental range decides which theory a study appears to support |

<!-- PUBLISHED:END -->

The module page at `modules/personality-individual-differences/index.html`
describes the rest of the planned scope.

## Canonical tool structure

Each tool is a self-contained folder named with a short, lowercase, hyphenated
slug that matches its `toolSlug` in `data/catalogue.json`:

```
modules/personality-individual-differences/tools/<tool-slug>/
├── index.html          the tool itself
├── metadata.json       the catalogue record (see CLAUDE.md metadata standard)
└── teaching-notes.md   educator guidance (see CLAUDE.md teaching-notes standard)
```

Tool-specific CSS and JavaScript live in the same folder — `tool.css` and
`tool.js` are the usual names. Self-contained means the folder can be copied
out of this repository and still work, provided `assets/css/main.css` and the
two `components/` files travel with it. Nothing is fetched from a CDN and
nothing is bundled.

A tool page sits four levels below the repository root, so shared assets are
referenced as `../../../../assets/css/main.css`.

## Adding one

1. Read [`../../../CONTRIBUTING.md`](../../../CONTRIBUTING.md) for the full
   checklist.
2. Read [`../../../docs/adapting-a-tool.md`](../../../docs/adapting-a-tool.md)
   for the interactive-shell markup contract and a working skeleton.
3. Create the folder and build the page against the shell.
4. Write `metadata.json` and `teaching-notes.md`.
5. Add the same record to the `personality-individual-differences` module's
   `tools` array in
   [`../../../data/catalogue.json`](../../../data/catalogue.json).

The module page lists a tool only when its catalogue `status` is exactly
`"published"`, so a work in progress can be recorded without appearing on the
site as finished.

## Questionnaire items: a hard rule

Tools in this module often need scale items. Use only public-domain or openly
licensed item pools, and record the source in the tool's `metadata.json` and
`teaching-notes.md`. **Do not reproduce commercial inventories**, in whole or
in part, even as "examples".

## Requirements for anything that scores a response

- Say plainly on the page that the result is a classroom illustration, not an
  assessment of the person using it.
- Keep every response in the browser tab: nothing stored, nothing transmitted.
- Do not request names, health information, protected characteristics or other
  identifying details.
- Do not produce employment-suitability, clinical or risk judgements.
- Treat traits as probabilistic, dimensional and context-sensitive. Never imply
  that a score determines behaviour.
- Distinguish states from traits, and facets from broad domains, where the
  distinction affects interpretation.
- Show the uncertainty around a score — a band, not a point — wherever a
  profile is displayed.
- Label simulated values as simulated. Never present generated numbers as norms
  or validated cut-offs.

See [`../../../docs/accessibility.md`](../../../docs/accessibility.md).

## Planned topics

Trait structure and the Big Five · factor analysis · reliability · validity and
measurement error · reading a trait profile.

Reliability is partly covered by The Alpha Trap, which takes the internal
consistency side of it; test–retest reliability is still open. Everything else
is unclaimed. Open an issue before starting so two people do not build the same
thing.
