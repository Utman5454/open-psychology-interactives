# Teaching notes — The Self Through Different Lenses

`modules/social-critical-psychology/tools/05-self-through-different-lenses/`

Statement 8 is about a fee and a rota. Six of the seven frameworks have no
concept for it. That is the session.

---

## Running it from the front

Statement 8 - the course fees rising and her hours being cut - is the one to point at. Six of the seven frameworks mark it as something they have no place for, and the seventh can only reach it obliquely. That is not a gap in these seven particular theories; it is a feature of a literature whose object of study is located inside a person.

Statement 9 - the tutor's remark about "people from your background" - is the other one worth stopping on, because frameworks disagree about whether it is information about Nadia or information about the course.

Do not let the activity settle into finding the best lens. If a student asks which one is right, ask them what question they want answered first.

## Intended level

First- or second-year undergraduate on a social psychology or self-and-identity
strand. It assumes students have met the seven frameworks by name; it does not
assume they can use any of them. It works well as a revision session that turns
into something else halfway through.

## Learning objectives

After the activity a student should be able to:

1. apply seven frameworks to the same nine statements;
2. state the question each framework asks and the evidence that follows;
3. explain why they are not competing diagnoses;
4. distinguish what a framework backgrounds from what its users believe;
5. say what a vocabulary located inside a person systematically cannot record.

## Estimated duration

- **Demonstration from the front:** 8 minutes — two frameworks and the board.
- **Students in pairs, four frameworks each:** 30 minutes.
- **With the challenge and the debrief:** 45 minutes.

## Preparation

None. Read the nine statements aloud, or have nine students read one each. The
activity works much better if the statements have been heard as a person talking
before they become items on a board.

## The demonstration worth doing from the front

Choose **self-efficacy**. Look at the board: statements 5 and 9 are central,
statement 8 is marked *no concept for it*. Read the account.

Now choose **relational and contextual** without changing anything else. Watch
statements 6 and 7 come up and 5 fall back. Read that account.

Say: *nothing about Nadia has changed. What changed is which of her sentences
the framework has a word for.*

Then press **Worked example**, which applies five frameworks and opens the
synthesis. The line to read aloud is the one about statement 8.

## Prediction question

*Seven frameworks are about to be applied to these nine statements. What will
the differences between them mostly be?*

Both "they will ask different questions" and "they will disagree about whether
the self is in Nadia at all" are treated as good answers. The most common wrong
answer — "some will fit better than others" — is the framing the whole board is
built to unsettle, and its feedback asks where the criterion of fit would come
from.

## Activity sequence

1. **Read the nine statements.**
2. **Commit to the prediction.** It gates the board.
3. **Choose a framework and match the account.** Getting it wrong is useful: the
   feedback names the framework the chosen account actually belongs to and the
   statements each of the two leans on.
4. **Apply at least four.** The synthesis will not open before that.
5. **Compare the table.** Question, makes central, backgrounds.
6. **The challenge.** Five sentences, seven frameworks and a "none" option; two
   of the five are "none".

## Debrief questions

1. Which statements did your four frameworks between them never make central?
2. Statement 9 is the tutor's remark. Which frameworks treat it as information
   about Nadia, and which as information about the course? What follows from
   each reading?
3. Nadia asks which version of her is the real one. Two frameworks would try to
   answer; one says the question is badly formed. Who is right, and how would you
   tell?
4. Self-efficacy is deliberately domain-specific. What did that buy, and what did
   it give up?
5. Why can none of these frameworks use statement 8? Is that a gap in the seven,
   or a feature of the field they come from?
6. If an assessment instrument were built from your favourite framework, what
   would it fail to collect about Nadia?
7. Is there an eighth framework that would fix this? What would its object of
   study be?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Which one is right?" | Ask what question they want answered. The tool never nominates a best lens and no fact about Nadia was written down. |
| "They're all saying the same thing differently." | The relational account denies that there is a self underneath to describe. That is not a paraphrase of self-schema. |
| "The one that uses the most statements is the best." | Precision and scope trade off. A framework that makes two statements central has told you something exact about those two. |
| "Backgrounding money means they think money doesn't matter." | The limitations panel. The claim is about what the concepts can represent, not about what researchers believe. |
| "Social identity is about her groups, so it's a social framework." | It is — and it still represents the tutor's remark as a change in what is salient to Nadia rather than as something the tutor did. |
| "So psychology can't handle poverty." | Overcorrection. Plenty of psychology can. The point is narrower: a *self* framework cannot, because its object is a self. |

## Limitations and cautions

- **No correct lens, and no hidden answer.** Nadia is fictional and nothing was
  written down for a framework to be right about.
- **These are not the only frameworks.** Narrative, dialogical, psychodynamic,
  cultural and neurocognitive accounts are all absent and would light up the
  board differently.
- **The codings are authored judgements.** A specialist in any one tradition
  could argue with several of them, and that argument makes a good seminar.
- **"Backgrounds it" is not "denies it".**
- **Nobody is assessed.** The tool asks nothing about the person using it and is
  not a method for analysing anyone you know.

## Accessibility considerations

- Native radios and buttons; no dragging, no timing, no hover-only content.
- The board writes each coding out in words — CENTRAL, usable, no concept — and
  varies border style as well as tint, so the three levels never depend on
  colour.
- The pinned board is 449px, so it stays in view while the seven frameworks and
  the four candidate accounts are scrolled.
- Wrong answers produce an explanation naming the framework the chosen account
  belongs to and the statements each of the two leans on, never a bare
  "incorrect".
- Announcements go through the shell's polite live region.
- Reduced-motion and forced-colours rules are provided. No horizontal page scroll
  at 320px, 375px, 1366px, 1440px or 1920px.

## Optional extension tasks

1. **Write the eighth account.** Take a framework not on the board and write
   Nadia's account from it in four sentences. Which statements does it make
   central?
2. **The instrument.** Design three questionnaire items from your framework. Then
   say what a service using only those three items would never learn about Nadia.
3. **Statement 8, properly.** What discipline has the concepts to handle it? What
   would a joint account look like, and who would write it?
4. **Interview the tutor.** Statement 9 is a remark somebody made. Write the
   version of this case in which the tutor, not Nadia, is the object of study.

## The model

Documented at the top of `tool.js`. There is no randomness and no seed.

Each framework carries a coding for each of the nine statements: `c` central,
`u` usable indirectly, `n` no concept for it. The counts per framework are:

| Framework | Central | Usable | No concept |
| --- | --- | --- | --- |
| Self-schema | 1, 5 | 3, 4, 6, 7, 9 | 2, 8 |
| Social comparison | 2, 6 | 3, 5, 9 | 1, 4, 7, 8 |
| Self-discrepancy | 3, 4 | 1, 2, 5 | 6, 7, 8, 9 |
| Possible selves | 4 | 1, 3, 5, 8, 9 | 2, 6, 7 |
| Self-efficacy | 5, 9 | 1, 2, 4 | 3, 6, 7, 8 |
| Social identity | 6, 9 | 1, 2, 7 | 3, 4, 5, 8 |
| Relational and contextual | 6, 7 | 1, 2, 5, 8, 9 | 3, 4 |

Statement 8 — "the fees went up in September and my hours got cut the same
month" — is central to **none** of the seven, marked `n` by five of them and
`u` by two (possible selves and relational). The synthesis reports this
explicitly once four frameworks have been applied.

The four candidate accounts for a framework are chosen deterministically from
the other six and rotated so that the correct one is not always in the same
position.

**Reference values a lecturer can check.** Pressing **Worked example** applies
self-schema, social comparison, self-efficacy, social identity and relational,
and the synthesis reports that no applied framework treats statements 3, 4 and 8
as central, and that statement 8 is marked "no concept for it" by four of the
five. Challenge answers: 1 self-efficacy, 2 social identity, 3 self-discrepancy,
4 none, 5 none.

## Citation and evidence notes

- **Markus (1977)** for self-schemas, and for the demonstration that schematic
  domains are processed differently rather than merely rated differently.
- **Festinger (1954)** for social comparison, and **Wood (1989)** for what
  happened to the theory once comparison targets stopped being assumed.
- **Higgins (1987)** for self-discrepancy theory and its specific prediction that
  actual-ought and actual-ideal gaps produce different affect.
- **Markus and Nurius (1986)** for possible selves; **Oyserman et al. (2006)** for
  the finding that feared selves motivate mainly when paired with a specific
  strategy.
- **Bandura (1977, 1997)** for self-efficacy, and for the ordering of its four
  sources that claim 1 in the challenge depends on.
- **Tajfel and Turner (1979)** and **Turner et al. (1987)** for social identity
  and self-categorisation, including salience.
- **Gergen (1991)** and **Hermans (2001)** for relational and dialogical accounts;
  **Sampson (1988)** on the "self-contained individualism" that the debrief
  section is drawing on.
- **Danziger (1997)** or **Rose (1998)** if you want the historical version of
  why psychology's vocabulary for the self is located where it is.

Full references are deliberately not embedded in the page, so the invented case
is not mistaken for anything derived from them.
