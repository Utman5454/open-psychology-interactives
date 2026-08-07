# Teaching notes — Visual Neglect Laboratory

`modules/neuropsychology/tools/04-visual-neglect-line-bisection/`

Two fictional people both leave food on the left of the plate. One cannot see
it and one is not attending to it, and the copying task tells you which.

---

## Intended level

First- or second-year undergraduate neuropsychology or cognitive psychology.
No anatomy is required. It fits well after the Network Disconnection Mapper,
because the modern account of neglect is substantially a disconnection
account.

## Learning objectives

After the activity a student should be able to:

1. explain why neglect is not blindness on one side;
2. state, for each of the three tasks, what separates neglect from field loss;
3. explain why the bisection error runs in opposite directions for the two;
4. distinguish neglect organised around the viewer from neglect organised
   around each object, and say why the second is hard to explain as a failure
   to look;
5. say what improvement under cueing is and is not evidence for.

## Estimated duration

- **Demonstration from the front:** 10 minutes — the copying task on three
  profiles is the whole argument.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Read the "not a test, and not for you" panel aloud. Neglect is a topic
students want to try on themselves, and the tool must not be presented as
anything they could.

## The demonstration worth doing from the front

Select **copying a scene** and step through three profiles without comment.

- **Left visual field loss.** The copy is complete. Say: *this person has a
  hole in their visual input, and it does not stop them copying a picture.
  Their eyes move, the information gets in, and they know to check.*
- **Left neglect, viewer-centred.** The left of the page is gone: the
  left-hand tree, the left fence, the left half of the house.
- **Left neglect, object-centred.** Now point at the tree on the **right** of
  the page. It is there, and its left half is missing. That omission is not on
  the left of anything except the tree it belongs to. Ask the room how a
  failure to look far enough left could produce it.

Then switch to **line bisection** and compare neglect with field loss: the
errors run in opposite directions on the same task. Two people who both "miss
things on the left" mark the middle of a line on opposite sides of it.

Finally, tick the prompt with **field loss** on cancellation (24 → 26,
completely rescued) and with **viewer-centred neglect** (15 → 18, helped and
not fixed). Then tick it with **object-centred neglect** on copying: 12 → 12,
no change at all, because "check the whole page" is an instruction about the
page.

## Prediction question

> Two fictional people both leave food on the left of the plate and both bump
> into door frames on their left. One has left visual field loss and one has
> left neglect. Which single task separates them most cleanly?

*Copying a scene* is the intended answer. *No single task does it* is also
defensible and the feedback says so — in practice the two frequently occur
together and severity varies.

## Activity sequence

1. **Commit to the opening judgement.**
2. **Copying**, across all five profiles. Establish the signatures.
3. **Line bisection**, neglect against field loss. The opposite directions.
4. **Line bisection**, viewer-centred against object-centred. Open the numbers
   table: the first shows a gradient across the page (18.4%, 14.0%, 9.6%), the
   second the same value on every line (13.0%).
5. **Cancellation**, with and without the prompt.
6. **The prompt on object-centred copying** — the null result.
7. **The blinded case in the challenge.**

## Debrief questions

1. Why does a complete copy argue against neglect but not against field loss?
2. Neglect marks to the right of the middle of a line; field loss marks
   slightly to the left. Why does neglect shift the perceived middle towards
   the attended side?
3. The object-centred profile leaves the left half off the tree on the right of
   the page. What would have to be true for "not looking far enough left" to
   explain that?
4. The prompt rescues field loss completely and neglect only partly. What does
   that tell you about the two mechanisms?
5. Both neglect profiles copy a similar *number* of parts (10 and 12). What
   would be lost by reporting only the score?
6. Where is the lesion? What is wrong with the question?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Neglect means they are blind on the left." | The copying task. Field loss copies perfectly; neglect does not. The input is arriving in neglect. |
| "They just need to look left." | The object-centred profile, and the prompt that changes nothing on its copying. |
| "Neglect is a visual problem." | It affects touch, hearing, imagined space and the person's own body in various combinations. The tool shows visual tasks because they are easiest to draw. |
| "Improvement with cueing means it is mild." | It is informative about mechanism, not severity, and cued improvement does not predict everyday function. |
| "Neglect is in the right parietal lobe." | It follows damage at several right-hemisphere sites and, on the evidence that most changed the debate, in the white matter connecting them. |
| "The two conditions are alternatives." | They frequently occur together — that is what the fifth profile is for. |
| "The bisection error size tells you the severity." | It varies with line length, position and day, and mild cases fall inside the normal range. |

## Limitations and cautions

- **Not an assessment.** No clinical instrument is reproduced, the tasks are
  simplified originals, and nothing here can be used to test anybody,
  including the person using it.
- **Generated performance.** Every mark, omission and copy comes from a rule
  plus a seeded draw. Nobody was tested; the numbers are not data, norms or
  cut-offs.
- **Five profiles is a caricature.** Real presentations vary in severity,
  across tasks, across the day, and between personal, near and far space.
  Imagined space can be affected too.
- **Left and right are not symmetrical.** The tool shows left-sided difficulty
  because neglect after right-hemisphere damage is more common and more
  persistent. Why remains argued about.
- **No localisation is offered.** Deliberately: neglect follows damage in
  several regions and in the connections between them.

## Accessibility considerations

- Native radio, checkbox and button controls. The drawings are display-only —
  nothing has to be clicked or dragged inside them.
- Each drawing is `aria-hidden` and paired with a readout (headline result,
  prompt state, unprompted-to-prompted change) and two tables: one breaking
  the current result down by line, page third or scene object, and one giving
  every profile's result on the current task with and without the prompt.
- Nothing depends on colour. A bisection mark is a **tall stroke** and the
  true middle a **short notch**; a found star carries a **stroke through it**
  and a missed one does not; an omitted part of a copy is **absent**.
- Every change announces a full summary through the polite live region.
- The task drawing is the first thing in the stage, and the control column is
  short enough that no pin is needed: at 1366×768 the whole control column and
  the drawing are visible together.
- No horizontal page scroll at 320px; wide tables scroll inside their own
  containers.

## Optional extension tasks

1. **Design a fourth task.** What would separate personal neglect (the
   person's own body) from neglect of the space around them?
2. **Predict then check.** Before selecting it, write down what the
   field-loss-plus-neglect profile should do on each task, then check.
3. **Two numbers, two patterns.** The two neglect profiles copy 10 and 12
   parts. Write the sentence you would put in a report about each, and note
   how little the numbers contributed.
4. **The reading task.** Neglect dyslexia comes in viewer-centred and
   word-centred varieties. Predict what each would do to a printed page.
5. **Look up prism adaptation.** What does it change, how long does it last,
   and what does its effect suggest about the mechanism?

## The model

Bisection deviation is a fraction of line length, positive to the right:

| Profile | Deviation rule |
| --- | --- |
| No difficulty | fixed small jitter (+1.2%, −0.8%, +0.5%) |
| Neglect, viewer-centred | 0.06 + 0.16 × (1 − position of the line across the page) |
| Neglect, object-centred | 0.13, constant |
| Field loss | −0.05, constant |
| Both | 0.85 × the viewer-centred value, then −0.03 |

The prompt multiplies the neglect component by 0.55 and leaves the field-loss
component alone.

Cancellation uses a logistic in horizontal position with a fixed seed
(mulberry32, 20260807), so the page is the same for every profile. Field loss
uses a steep function at the page edge — a strip, not a gradient — and the
prompt removes it entirely.

Copying drops parts by page position for viewer-centred neglect and by
side-within-object for object-centred neglect. **The prompt does nothing to
object-centred copying**, which is deliberate and is the tool's sharpest point.

### Reference values a lecturer can check

**Line bisection — mean deviation** (unprompted, then prompted):

| Profile | Unprompted | Prompted | Across the three lines, unprompted |
| --- | --- | --- | --- |
| No difficulty | +0.3% | +0.3% | +1.2 / −0.8 / +0.5 |
| Neglect, viewer-centred | +14.0% | +7.7% | +18.4 / +14.0 / +9.6 |
| Neglect, object-centred | +13.0% | +7.2% | +13.0 / +13.0 / +13.0 |
| Field loss | −5.0% | −5.0% | −5.0 / −5.0 / −5.0 |
| Both | +8.9% | +3.5% | — |

**Cancellation — stars found out of 26:** 26 → 26; 15 → 18; 19 → 24;
24 → 26; 14 → 18 (in profile order).

**Copying — parts drawn out of 19:** 19 → 19; 10 → 13; **12 → 12**;
19 → 19; 10 → 13.

The two rows worth pointing at are the object-centred copying row, which does
not move under prompting, and the bisection row for field loss, which is the
only negative number on the page.

## Citation and evidence notes

- **Halligan, Fink, Marshall and Vallar (2003)** for a review of the spatial
  cognition and neglect literature.
- **Heilman and Valenstein (1979)**, **Mesulam (1981)** and **Corbetta and
  Shulman (2011)** for the attention-network accounts.
- **Bisiach and Luzzatti (1978)** for neglect of imagined space, which is the
  clearest demonstration that this is not a sensory problem.
- **Driver and Halligan (1991)** and **Behrmann and Moscovitch (1994)** for
  object-centred neglect.
- **Karnath, Ferber and Himmelbach (2001)** and the exchange that followed for
  the argument over which right-hemisphere region matters most.
- **Doricchi and Tomaiuolo (2003)** and **Bartolomeo, Thiebaut de Schotten and
  Doricchi (2007)** for the white-matter disconnection account.
- **Rossetti et al. (1998)** on prism adaptation.
- **Barton and Black (1998)** and **Kerkhoff and Bucher (2008)** on line
  bisection in hemianopia without neglect, which is where the opposite
  direction of error comes from.

Full references are deliberately not embedded in the page, so the tool does
not appear to derive its fictional profiles from any of them.
