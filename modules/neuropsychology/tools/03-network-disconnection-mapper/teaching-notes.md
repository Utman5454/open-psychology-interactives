# Teaching notes — Network Disconnection Mapper

`modules/neuropsychology/tools/03-network-disconnection-mapper/`

Every box on the diagram is intact and the task still fails. That is the
screen the lesson turns on.

---

## Running it from the front

Start with A pathway cut between two intact regions. Every box on the diagram is undamaged and repetition is still impaired. That is the whole disconnection argument in one screen, and it is the state a purely localisationist account cannot describe.

Then compare Word-sound store damaged with Speech output damaged and with cutting the pathway between them. Three different failures, one identical profile. Ask what evidence outside the behaviour would separate them.

The second routes are what stop this being a set of light switches. Cutting meaning off from word sounds leaves picture naming possible via the direct route, and the names that come out are semantically wrong - which is a real phenomenon and the reason "impaired" is a different outcome from "fails".

## Intended level

First- or second-year undergraduate neuropsychology. No anatomy is required
and none is taught: the five boxes carry job descriptions, not region names.
It follows well from the Lesion–Symptom Inference Trap, whose second and third
complications this tool makes concrete.

## Learning objectives

After the activity a student should be able to:

1. explain how a deficit can follow from a cut connection between undamaged
   regions;
2. find, unprompted, two different single failures that produce the same
   behavioural profile;
3. distinguish a task that fails from one running on a weaker second route,
   and say what the error pattern adds that the score does not;
4. state why a symptom constrains where a network has failed without
   identifying it;
5. explain why network and localisation accounts are not rivals.

## Estimated duration

- **Demonstration from the front:** 8 minutes — the first two presets are the
  argument.
- **Students in pairs:** 20 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. Read the "this diagram is a toy" panel aloud before starting. Students
who take the diagram for anatomy will spend the session trying to map it onto
a brain, which is not what it is for.

## The demonstration worth doing from the front

**Preset 2 — a pathway cut between two intact regions.** Put it up and say
nothing for a moment. Every box on the diagram is undamaged. Repetition is
impaired. Ask: *where is the lesion?*

There is no answer in terms of regions, and the deficit is real. That is the
disconnection argument, and it is not a subtlety — it was Wernicke's and
Lichtheim's central claim, it was abandoned for most of the twentieth century,
and modern tractography restored it.

**Then presets 4 and 5.** Word-sound store damaged; speech output damaged. The
four chips are identical. Add the third possibility yourself by ticking "word
sounds to speech output" — identical again. Ask what evidence, other than
these four tasks, could separate the three.

**Finally**, tick "seeing objects to word sounds (direct)" on its own. Nothing
changes: real damage, no measured deficit. Ask what that says about a negative
finding.

## Prediction question

> A fictional person understands everything said to them and names pictures
> without difficulty. Asked to repeat a spoken word back, they cannot — and
> the difficulty is worst for unfamiliar words. Where would you look for the
> damage?

The intended answer is *nowhere in particular — the regions may be intact and
a pathway between them cut*. The "worst for unfamiliar words" clause is the
clue: the long way round through meaning works for words you know and not for
words you do not.

## Activity sequence

1. **Commit to the opening judgement.**
2. **Preset 1** — everything intact. Establish that all four tasks run.
3. **Preset 2** — the cut pathway. The core demonstration.
4. **Preset 3** — meaning disconnected from words. Note that naming becomes
   *impaired*, not impossible, and that the errors are semantic.
5. **Presets 4 and 5** plus the pathway between them. The three-way identity.
6. **Free exploration.** Ask each pair to find (a) a single failure nothing
   detects, and (b) two failures with identical profiles other than the three
   already shown.
7. **The challenge.**

## Debrief questions

1. In preset 2, where is the lesion? What would you write in a report?
2. Three failures give the same four outcomes. What evidence outside these
   four tasks would separate them?
3. Cutting the direct picture-to-word pathway changes nothing measurable here.
   What does that say about concluding "no deficit, therefore no damage"?
4. Naming on the second route produces *related* words rather than random
   ones. Why is that pattern more informative than the score?
5. The tool has three outcome states. Real networks have a continuum. What does
   collapsing it to three states hide?
6. Does anything in this tool show that regions do not matter?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "So brain regions are irrelevant." | Damage a node and tasks fail. The claim is that *which* tasks fail depends on connectivity as much as on tissue. |
| "The boxes are brain regions." | They are jobs the network has to do somewhere. The layout is for legibility and carries no anatomy. |
| "Disconnection is a special case." | The white matter under a cortical lesion is damaged in almost every cortical stroke, so it is closer to the normal case than the exception. |
| "Impaired means slightly damaged." | It means a different route is being used, with characteristic errors. It is a qualitative difference, not a quantitative one. |
| "If we test enough tasks we can localise it." | More tasks help, and the many-to-one mapping does not disappear. Two failures that break the same set of routes stay indistinguishable behaviourally however many tasks you add. |
| "Preset 3 is transcortical sensory aphasia." | The tool deliberately names no syndrome. Those categories are contested and fit individuals poorly; naming one here would teach the wrong habit. |

## Limitations and cautions

- **The diagram is not anatomy.** Five boxes, six lines, positions chosen for
  legibility. No real region, tract, connectome or published model is
  reproduced.
- **Binary damage is a large simplification.** Real connections are partly
  damaged, signal degrades rather than vanishing, and regions participate in
  many networks at once.
- **Boxes are not modules.** "The word-sound store" names a job, not a
  dedicated piece of tissue.
- **No syndromes.** Several states resemble textbook aphasia categories. The
  tool never names one, on purpose.
- **Nobody is assessed.** The four tasks are descriptions rather than tests,
  and the person in the opening scenario is fictional.

## Accessibility considerations

- Every element is toggled by a labelled checkbox in the controls column, not
  by clicking the diagram, so the whole tool is keyboard operable and every
  target is comfortably large.
- The diagram is planar by construction — no two pathways cross — so lines can
  be read without tracing them.
- The diagram is `aria-hidden` and paired with two visible tables: one per task
  giving route states and outcome, one per element giving its state.
- Damage is carried by a broken outline **and** a printed cross. Task outcomes
  are carried by the words Normal, Impaired and Fails as well as by a border.
- Every change announces a full four-task summary through the polite live
  region.
- The pinned primary is 361px at 1366×768, so the diagram and the four chips
  stay visible while the pathway checkboxes are reached. Verified at 1366×768,
  1440×900 and 375×812.
- No horizontal page scroll at 320px; wide tables scroll inside their own
  containers.

## Optional extension tasks

1. **Add a task.** Write a fifth task, state its route, and predict which
   existing damage states would break it.
2. **Add a pathway.** What would a direct route from heard speech to speech
   output do to the profiles? Which failures would stop being
   distinguishable?
3. **Make it graded.** How would you represent a partially damaged pathway,
   and what would it predict about error rates rather than error types?
4. **Design the discriminating investigation.** For the three-way identity,
   specify what imaging or additional testing you would want and what each
   would rule out.
5. **Read a disconnection paper.** Take any modern tractography study of a
   deficit and identify which of its claims are about nodes and which about
   edges.

## The model

Each task is a route: an ordered list of regions and pathways that must all be
intact. Two tasks have a second, weaker route.

| Task | Main route | Second route |
| --- | --- | --- |
| Name a picture | seeing → meaning → word sounds → speech output | seeing → word sounds → speech output (direct) |
| Repeat a spoken word | hearing → word sounds → speech output | hearing → meaning → word sounds → speech output |
| Point to a named picture | hearing → meaning → seeing | none |
| Say what is being described | hearing → meaning → word sounds → speech output | none |

Outcome: **normal** if the main route is complete; **impaired** if only the
second route is complete; **fails** otherwise.

### Every single failure, and what it does

Outcomes are listed in chip order: naming / repeating / pointing /
naming-from-description.

| Single failure | Naming | Repeating | Pointing | From a description |
| --- | --- | --- | --- | --- |
| Seeing objects damaged | Fails | Normal | Fails | Normal |
| Meaning damaged | Impaired | Normal | Fails | Fails |
| Word sounds damaged | Fails | Fails | Normal | Fails |
| Speech output damaged | Fails | Fails | Normal | Fails |
| Hearing speech damaged | Normal | Fails | Fails | Fails |
| Seeing → meaning cut | Impaired | Normal | Fails | Normal |
| Seeing → word sounds cut (direct) | Normal | Normal | Normal | Normal |
| Meaning → word sounds cut | Impaired | Normal | Normal | Fails |
| Word sounds → speech output cut | Fails | Fails | Normal | Fails |
| Hearing → word sounds cut | Normal | Impaired | Normal | Normal |
| Hearing → meaning cut | Normal | Normal | Fails | Fails |

Two identities fall out of the table and are worth pointing at:

- **word sounds damaged = speech output damaged = word sounds → speech output
  cut.** Three failures, one profile. This is the challenge.
- **seeing objects damaged** and **seeing → meaning cut** differ only in
  whether naming *fails* or is *impaired*. Without recording the error type,
  those two would also be indistinguishable — which is the argument for
  reporting what people say and not only how many they get right.

And one negative result: **cutting the direct picture-to-word pathway changes
nothing on any of these four tasks.** Damage is not the same as deficit; it
depends on whether anything you measure needs the damaged part.

## Citation and evidence notes

- **Wernicke (1874)** and **Lichtheim (1885)** for the original
  connectionist diagrams and the prediction that a cut connection between
  intact centres produces a specific pattern.
- **Geschwind (1965)** for the revival of disconnection as an explanatory
  framework.
- **Catani and ffytche (2005)** for the modern statement of disconnection
  syndromes.
- **Catani and Mesulam (2008)** on the arcuate fasciculus and the history of
  the conduction-aphasia argument.
- **Bartolomeo, Thiebaut de Schotten and Doricchi (2007)** for a worked case of
  a deficit better explained by a pathway than by cortex.
- **Fornito, Zalesky and Breakspear (2015)** on network-level accounts of brain
  disorder and why node-based descriptions are incomplete.
- **Plaut and Shallice (1993)** on graded degradation and characteristic error
  types in damaged systems.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its fictional network from any of them.
