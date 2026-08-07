# Teaching notes — “Explain This Person” Courtroom

`modules/personality-individual-differences/tools/24-explain-this-person-courtroom/`

Eight explanations that all fit, and a jury that has to notice which of them
could ever have been wrong.

---

## Intended level

Any undergraduate year. It works particularly well early, before students have
committed to a favourite level of explanation, and again in a final year as a
corrective when they have.

## Learning objectives

After the activity a student should be able to:

1. explain what underdetermination means for psychological explanation;
2. distinguish an explanation that accommodates from one that predicts;
3. identify what evidence would discriminate between two accounts that fit
   equally well;
4. distinguish competing explanations from compatible ones;
5. calibrate confidence to what the evidence can support.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **As a full seminar with argument between groups:** 45 minutes, and it will
  fill the time.

## Preparation

None. Read the case aloud. Resist answering "but which one is it?" — the
answer is that there isn't one, and saying so early spoils the discovery.

## There is no correct answer

This needs saying plainly, to yourself before the session and to the students
after it. The tool stores no hidden fact about why the fictional person
volunteered. Every explanation was written to fit the case.

Students find this genuinely annoying, which is the most useful thing about it.
The annoyance is the felt experience of underdetermination, and it is worth
naming when it appears: *this is what it is like to explain a person, and the
discomfort you are feeling is the appropriate response to the evidence, not a
failure to think hard enough.*

## Activity sequence

1. **Read the case.** One paragraph.
2. **Rate all eight explanations** before requesting any evidence. Most
   students rate most of them "likely", which is the first result.
3. **Look at the distinctiveness column.** The broad trait account scores
   lowest: it predicts almost nothing the others do not. Students have usually
   rated it highly.
4. **Request evidence.** Discuss which pieces to ask for *before* asking.
5. **Watch the standing column change** — and notice how many explanations are
   untouched by evidence, whatever it says.
6. **The six-month follow-up.** Marked unavailable. Any student who requests it
   anyway has understood the exercise; the verdict says so.
7. **Confidence, then verdict.**
8. **The diagram.** Which pairs actually compete. Fewer than expected.

## Debrief questions

1. Which explanation did you rate highest before any evidence? What would have
   had to be true for you to lower it?
2. The trait explanation has the lowest distinctiveness score. Does that make
   it false, or unhelpful, or neither?
3. Which two explanations, on the diagram, genuinely compete? Which pairs turn
   out to be compatible?
4. You asked for evidence. Did any of it change your mind? If not, was it worth
   asking for?
5. The most discriminating evidence is not yet available. What should a
   researcher who noticed that do next?
6. When you explain something a friend did, which of these eight kinds of
   explanation do you reach for first? Does that vary with whether you like
   what they did?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "It's obviously the achievement motive." | Ask what evidence, in principle, would have shown that it was not. If nothing would have, the confidence is not coming from the evidence. |
| "Traits explain it — she's just like that." | Distinctiveness column. What does that account predict that the others do not? |
| "The tool is broken, it won't tell me the answer." | It has none. Say so, and ask what that implies for explaining people they actually know. |
| "So we can never explain anything." | Overcorrection. Some accounts *were* undermined by the evidence. Underdetermination is not the same as ignorance. |
| "You should just pick the simplest one." | Simplicity is a real criterion and it is not the one being taught here. Ask which of two equally simple accounts they would choose, and how. |
| "Situational explanations are the scientific ones." | The situational accounts here are as distinctive as the motivational ones and no more so. Level of explanation and testability are separate axes. |

## Limitations and cautions

- **There is no hidden answer.** Nothing is stored.
- **Distinctiveness is not truth.** A bold explanation can be wrong; a vague
  one can be right. The claim is only that the bold one can be found out.
- **This is not a model of theory choice in science.** Simplicity, scope and
  consistency with other findings all matter and none is modelled.
- **The evidence findings are stipulated** to bear on some accounts and not
  others. Real evidence is messier.
- **Not a method for real people.** The case is fictional, and using this as a
  procedure for working out why someone you know did something would be a
  misuse of it. Say so if anyone starts.

## Accessibility considerations

- Each explanation is a `fieldset` whose `legend` carries the full statement,
  so a screen-reader user hears the explanation with each rating option. The
  legend is floated, which also stops multi-line legends spilling out of their
  box.
- Native radios, checkboxes and buttons; no custom widgets, no dragging.
- The competition diagram is hidden from assistive technology and paired with
  a visible table stating every pair's relationship in words. Nodes are
  labelled, and supported/undermined states use stroke pattern as well as
  fill.
- The requirements checklist writes "(met)" or "(not yet)" into the text.
- Every evidence request announces the running count.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Write the ninth explanation.** Add one that is compatible with the case
   and makes a distinctive prediction none of the eight makes. Say what
   evidence would test it.
2. **Design the study.** You have a year and a modest budget. What would you
   collect to distinguish the achievement-motive account from the
   self-efficacy account?
3. **The unavailable evidence.** Write the two sentences you would put in a
   discussion section acknowledging that the discriminating evidence does not
   exist.
4. **Turn it around.** Take a behaviour of your own from last week and list
   four explanations that fit it. Then say which you would have offered if
   asked, and why that one.

## The model

Also documented at the top of `tool.js`.

Each explanation carries a **fit** value (all high, by construction) and a
prediction of +1, −1 or 0 for each of the six pieces of evidence.
**Distinctiveness** is the proportion of evidence items on which an
explanation's prediction differs from another explanation's, averaged over all
rivals. **Standing** is the evidence-weighted agreement between what an
explanation predicted and what the stipulated findings say.

Two explanations **compete** when they make opposite predictions on more items
than they agree on, and are **compatible** when they never predict opposite
things. Only competing pairs are joined in the diagram.

### The eight explanations, by distinctiveness

The trait account and the role-experience account score lowest — they predict
little that the others do not. The values, reputation and situational-pressure
accounts score highest, because each commits to something about the private
conversation, the timing or the incentive that the others deny.

This ordering is the pedagogical spine of the tool. Students reliably rate the
low-distinctiveness accounts highest, because comfortable fit reads as
explanatory power.

## Citation and evidence notes

- **Underdetermination** in the general form is Duhem–Quine; the psychological
  application needs no philosophy of science beyond the basic idea.
- **Popper** on falsifiability is the obvious reference for "which of these
  could have been wrong", with the usual caveat that naive falsificationism is
  not how science actually proceeds.
- **Meehl (1967, 1978)** on why weak theories survive in psychology is the
  sharpest treatment of the "fits everything" problem and is worth setting as
  a reading alongside this.
- **Ross (1977)** on the fundamental attribution error, for why students reach
  for dispositional accounts first.
- **Bandura (1977)** on self-efficacy as domain-specific — the reason that
  explanation makes different predictions from the trait one.
- **McClelland (1961)** and later work on the achievement motive, for the
  moderate-difficulty prediction.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its case from any of them.
