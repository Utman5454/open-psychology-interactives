# Teaching notes — Discourse and Subject Position Laboratory

`modules/social-critical-psychology/tools/06-discourse-subject-position-lab/`

Five accounts, no false statements, five different people. The ledger stays on
screen so that nobody can leave thinking the events were made of language.

---

## Intended level

Second- or third-year undergraduate on a critical psychology, qualitative
methods or mental-health strand. It assumes students have met discourse analysis
as a name. It works particularly well with students on placement, who will
recognise all five genres.

## Learning objectives

After the activity a student should be able to:

1. identify the subject position an account makes available;
2. say which actions that position renders reasonable;
3. name who the account authorises to speak;
4. locate the responsibility a description implies without stating;
5. explain why this is neither word-counting nor idealism about events.

## Estimated duration

- **Demonstration from the front:** 10 minutes — the case note and the recovery
  summary, read aloud, side by side.
- **Students in pairs, three accounts each:** 30 minutes.
- **With the challenge and the debrief:** 45 minutes.

## Preparation

None. Read the ledger aloud first, and say clearly that nobody disputes any of
it. The whole activity depends on that being established before the first
account appears.

## The demonstration worth doing from the front

Read **the case note** aloud, then **the recovery-oriented summary**. Ask which
one students would rather have written about them. Almost everyone says the
second.

Then put the two responsibility rows of the comparison table side by side:

- Case note: with R's condition, which is not her fault and also nobody else's.
- Recovery summary: with R, as the author of her own choices — reframed as
  empowerment rather than blame.

Say: *the hours were halved in April. In the first version that is invisible
because R has an illness. In the second it is invisible because R made a
choice.* Then ask which of the two makes it harder to reopen the question.

Finish on the **commissioning report**, where R appears once as "one service
user submitted written feedback" and the library group appears as evidence that
the cut worked.

## Prediction question

*What is the most important thing that will differ between the five accounts?*

"How accurate they are" is the most instructive wrong answer: none of the five
contains a false statement, and the feedback says so. That is the point at which
the session stops being about honesty.

## Activity sequence

1. **Read the ledger.** Undisputed, and it stays on screen.
2. **Commit to the prediction.** It gates the laboratory.
3. **Choose an account and answer the four questions.** The account stays pinned
   while you answer. Wrong answers name the account they are correct for.
4. **Analyse at least three.** The synthesis opens at three.
5. **Find ledger entry 2 in the accounts.** Only one contains it.
6. **The challenge.** Four one-sentence extracts.

## Debrief questions

1. Every account is consistent with the whole ledger. What, then, is the
   difference between them a difference *in*?
2. The library group appears in four of the five accounts. Write out what it is
   in each.
3. Which account makes it easiest for R to be answered on the merits of her
   letter? Which makes it hardest, and why?
4. The recovery summary is the warmest and locates responsibility with R. Is
   that a criticism of recovery language, of this template, or of the service?
5. The commissioning report has the most institutional force and says the least
   about anybody. Why are those two facts connected?
6. What would have to change about the case-note template for entry 2 to be
   recordable? Who would have to agree to it?
7. If discourse analysis is not word-counting, what is the evidence for a claim
   about a subject position?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "So the events didn't really happen." | Point at the ledger. It is on screen for exactly this reason, and no account disputes a line of it. |
| "The case note is the bad one." | It exists so a clinician who has never met R can act safely at two in the morning. Ask what the risk register exists because of. |
| "Recovery language is the good one." | It is the one that most completely turns a budget cut into a personal achievement. It was also fought for by service users. Both are true. |
| "This is just about being polite." | The positions are held in place by templates, review meetings and funding conditions. Politeness would not move any of them. |
| "The advocacy bulletin is the honest one." | It is the only one that mentions the cut, and it also asserts rather than shows that the assessment was in error. Its own limitation is stated in the tool. |
| "Discourse analysis means counting words." | Nothing in this activity depends on frequency. Ask them which word would have to be counted to get any of the four answers. |

## Limitations and cautions

- **No real person, service or record is described.** Everything is invented.
- **Five accounts is a simplification.** A real file contains dozens, they
  contradict one another, and one author shifts position within a paragraph.
- **No account is simply the villain**, and the tool says so for each of them.
- **This is not a method for analysing a real person's records.** If students are
  on placement, say this explicitly.
- **Content note.** The case involves a mental-health-adjacent service and the
  closing of somebody's support. Nothing is graphic, and nobody is diagnosed, but
  it is worth flagging in a group that may contain service users.

## Accessibility considerations

- Native radios and buttons only; no dragging, no timing, no hover-only content.
- The account under analysis is the pinned primary at 209px, so its full text
  stays beside the four questions while the controls column is scrolled.
- Ledger entry 2 carries a heavier rule *and* an explanatory phrase in text, so
  it is never identified by colour alone.
- Wrong answers explain which account the chosen option is the correct answer
  for, rather than reporting an error.
- Announcements go through the shell's polite live region.
- Reduced-motion and forced-colours rules are provided. No horizontal page scroll
  at 320px, 375px, 1366px, 1440px or 1920px.

## Optional extension tasks

1. **Write the sixth account.** From R's own diary. Which of the four columns
   does it change, and does it change who is authorised?
2. **Redesign the template.** Add one field to the case note that would make
   entry 2 recordable. Then work out why it is not already there.
3. **Find the shift.** In any real published case study, find a paragraph where
   the author changes subject position mid-way. Most do.
4. **The letter.** Write the reply R receives under each of the five accounts.

## The model

Documented at the top of `tool.js`. There is no randomness and no seed.

Four analytic dimensions — subject position, legitimate next action, authority to
describe, location of responsibility — each with five options. For each
dimension, exactly one option is the authored answer for each account, so every
distractor is the correct answer for a different text. The tool never marks an
account as true or false.

| Account | Kind of person | Responsibility |
| --- | --- | --- |
| Case note | A patient whose judgement is part of what is impaired | With R's condition |
| Risk register | A source of risk currently outside supervision | With R, for placing herself outside the arrangements |
| Advocacy bulletin | A citizen with a grievance, acting competently | With the service |
| Recovery summary | An individual on a journey, exercising choice | With R, reframed as empowerment |
| Commissioning report | A customer whose satisfaction has fallen | Nowhere in particular |

**Reference values a lecturer can check.** Pressing **Worked example** analyses
the case note, the recovery summary and the commissioning report and leaves the
recovery summary pinned; the synthesis then reports that none of the accounts
analysed mentions ledger entry 2 and suggests the advocacy bulletin. Challenge
answers: 1 turns a disagreement into a symptom; 2 moves responsibility while
appearing to praise; 3 withdraws legitimacy from an ordinary activity;
4 removes R by aggregation.

## Citation and evidence notes

- **Davies and Harré (1990)** for positioning theory, which is the vocabulary
  this activity is built in.
- **Potter and Wetherell (1987)** for interpretative repertoires and for the
  move from language as description to language as action.
- **Parker (1992)** and **Willig (2013, ch. on Foucauldian discourse analysis)**
  for the version of the method that asks what subject positions a discourse
  makes available and what can be done from them.
- **Foucault (1973, 1977)** for the underlying account of how a way of speaking
  and an institutional practice hold each other in place.
- **Smith (2005), *Institutional Ethnography***, for the ruling relations that
  make a case-note template the thing it is — the best companion reading for
  ledger entry 2.
- **Harper (2004)** or **Crowe (2000)** for empirical discourse work on
  psychiatric records specifically.
- **Harper and Speed (2012)** on the absorption of recovery and resilience
  language by services, which is the argument the recovery account is designed
  to make available.

Full references are deliberately not embedded in the page, so the invented case
is not mistaken for anything derived from them.
