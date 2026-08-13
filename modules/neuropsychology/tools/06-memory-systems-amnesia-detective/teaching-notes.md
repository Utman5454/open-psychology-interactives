# Teaching notes — Memory Systems Detective

`modules/neuropsychology/tools/06-memory-systems-amnesia-detective/`

Three of the nine cells cannot be decided. Students reach for that answer
last, and it is the one worth insisting on.

---

## Running it from the front

Of the nine cells in the core grid, four support a claim, two count against one and three cannot decide. Students find the last category uncomfortable and reach for it last. Say early that it is a real answer rather than a hedge, or they will force every profile into a conclusion.

Profile A settles all three claims and is the only one that does. That is worth naming out loud: the textbook case is in the textbooks because it is unusually informative, not because it is typical.

Profile E has nothing selective in it at all. Ask what would explain it before anybody reaches for a memory system. The case notes give five answers and none of them is damage.

Profile D, behind the disclosure, is the impurity case, and it is the one to reach for if the room is quick. Every verbal measure here uses words, and word knowledge is the thing that is most impaired, so the episodic scores cannot be read as episodic scores.

The retrieval-versus-storage argument is now the challenge rather than a grid row. Recall at floor with normal recognition is the pattern always cited for a retrieval account and it does not establish one: recognition is the easier task, so a trace too weak to be recalled can still be strong enough to be recognised.

## Intended level

Second- or third-year undergraduate. It assumes the standard taxonomy of
memory (short-term and working memory, episodic, semantic, procedural) as
lecture content and then makes students earn it from evidence. It follows
directly from the Double Dissociation Detective, whose logic it applies to a
profile rather than to a pair of tasks.

## Learning objectives

After the activity a student should be able to:

1. state what a profile must contain before it supports a distinction;
2. keep "these two tasks are separable" apart from "there are two systems";
3. explain why normal recognition with impaired recall does not establish a
   retrieval account;
4. spot task impurity in a profile where every impaired measure shares its
   material;
5. list the explanations of a uniformly slightly-low profile that come before
   any memory system.

## Estimated duration

- **Demonstration from the front:** 8 minutes — profiles A and E.
- **Students in pairs:** 15 minutes for the nine core cells.
- **With the challenge and debrief:** 30 minutes.

Profile D is optional and adds three more cells. Reach for it if the room
finishes early, or leave it and make the same point from the debrief.

## Preparation

None. Say at the start that "this profile cannot decide it" is a real answer
and is used three times out of nine. Without that, students force every profile
into a conclusion, and the exercise teaches the opposite of what it should.

## The demonstration worth doing from the front

**Profile A** first, to establish what support looks like: word knowledge and
skill learning at the control average, learning and recall four SDs below. One
measure clearly intact, a comparable one clearly not.

**Profile B** immediately after, so the crossover is visible: span three and a
half SDs below with delayed recall inside the control range. Put A and B side
by side and the short-term/long-term distinction has a double dissociation
behind it rather than a single one.

**The challenge** is the one to slow down on, and it is worth doing from the
front rather than leaving to the end. Recall at floor, recognition normal: ask
the room whether the difficulty is at retrieval. Most say yes. Then ask which
of the two tasks healthy controls find easier. The comparison is between two
tasks of unequal difficulty, so a trace too weak to be recalled can still be
recognised — and until the two are matched, the pattern is suggestive rather
than decisive.

**Profile E** last. Everything about one SD below, nothing clearly below.
Before anybody mentions a memory system, read the background aloud: five hours
of sleep, pain, medication, low mood, tested at the end of a long afternoon,
left school at 16 while the control group was recruited from a university.

## Prediction question

> A fictional person can repeat a list of digits back normally, and cannot
> recall a word list thirty minutes after learning it. What does that pattern
> establish about memory?

The intended answer is *that the two tasks do not depend on all the same
things* — separable rather than separate. "Nothing until you know what the
control group did" is also treated generously, because it is the reason every
score in the tool is control-referenced.

## Activity sequence

1. **Commit to the opening judgement.**
2. **Profile A**, all three claims. Establish what support looks like and that
   the general-reduction claim is answered "counts against".
3. **Profile B.** The crossover, and the "cannot decide" that follows from
   having no clearly impaired long-term measure.
4. **Profile E.** Two cannot-decides and one support, and the case notes are
   the whole explanation.
5. **Open the grid** and read the shape of it.
6. **The challenge**, which is where retrieval against storage is settled.
7. **Profile D**, optionally, for a room that has time.

## Debrief questions

1. Profile A supports the short-term/long-term distinction and profile B
   supports it better. Why?
2. Profile D looks like support for the episodic/skill distinction and is not.
   What exactly is wrong with the comparison?
3. No profile here settles whether a difficulty is at retrieval or at storage.
   What would a profile have to look like for it to?
4. Name five explanations of profile E that are not a memory system, and say
   what you would do about each.
5. The tool never mentions where anything is. What would adding imaging change
   about any of these judgements?
6. Which cell in the grid would you argue with, and on what grounds?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Impaired here and intact there means two systems." | It means the two tasks do not require all the same things. That is a smaller claim and it is what the evidence gives. |
| "Normal recognition proves it is retrieval." | Recognition is easier. Match the difficulty first. This is what the challenge asks. |
| "Profile D shows episodic and procedural come apart." | The two differ in system *and* in material *and* in response. A contrast that varies three things cannot be pinned on one. |
| "Profile E is early dementia." | Nothing in the profile says so, and at least six other explanations produce that shape. The tool names no syndrome anywhere and neither should the answer. |
| "Cannot decide means the data are useless." | It means these data do not decide *this claim*. Profile E decides the general-reduction claim perfectly well. |
| "The intended answers are the right answers." | They are a position to argue with. Several cells are genuinely arguable, and the tool says so in its own feedback. |
| "A score two SDs below the control average is a diagnosis." | It is a position in a distribution. Everything that makes it clinical is context the tool does not contain. |

## Limitations and cautions

- **Nobody is described.** Invented profiles with invented numbers, written to
  make particular inferences possible or impossible.
- **No syndrome is named.** Several profiles resemble textbook descriptions.
  Naming them would teach the habit the tool exists to discourage.
- **The intended answers are judgements**, most arguably in the retrieval row.
- **Seven measures is very few.** Real batteries separate recall of stories
  from recall of word lists, recognition of faces from recognition of words,
  familiarity from recollection.
- **No anatomy and no prognosis.** Nothing here says where anything is or what
  will happen to anybody.

## Accessibility considerations

- Native radio and button controls throughout.
- The profile chart is `aria-hidden` and paired with a table giving each
  measure, what it asks for, the distance from its own controls, and its
  standing in words. Every bar also prints its value.
- The claim under judgement sits in a **goal banner in the interactive
  header**, so it is readable while the verdict radios at the bottom of the
  control column are used. The chart is pinned at 294px, so the evidence stays
  on screen throughout.
- Grid cells print the verdict as a word, and add the intended verdict when
  they differ, so nothing depends on the tint.
- Every judgement announces through the polite live region with a running
  count.
- No horizontal page scroll at 375px or 320px; wide tables scroll inside their
  own containers.

## Optional extension tasks

1. **Argue a cell.** Pick one you disagree with and write the case from the
   numbers on screen.
2. **Design the missing profile.** Invent one that would settle retrieval
   against storage. What would it have to contain, and why is it hard to
   obtain?
3. **De-confound profile D.** Which measures would you replace, and with what,
   to make its episodic scores readable?
4. **Rule out profile E.** Write the order in which you would investigate the
   alternatives, cheapest and least invasive first.
5. **Familiarity and recollection.** Read about the two-process account of
   recognition and say what it would add to the challenge.

## The model

Every score is a distance from the average of that measure's own fictional
control group, in control standard deviations. Clearly below is −2.0 or lower;
within range is above about −1.2.

### The profiles

D is optional and sits behind a disclosure in the profile fieldset.

| Measure | A | B | E | D |
| --- | --- | --- | --- | --- |
| Immediate span | +0.2 | −3.4 | −1.1 | −0.3 |
| Learning across trials | −3.8 | −1.1 | −1.2 | −2.4 |
| Free recall after 30 min | −4.5 | −0.9 | −1.4 | −2.8 |
| Recognition after 30 min | −3.6 | −0.2 | −1.0 | −2.2 |
| Word knowledge | +0.1 | +0.3 | −0.9 | −4.2 |
| Skill learning | −0.2 | +0.1 | −1.2 | −0.2 |

### The intended grid

| Claim | A | B | E | D |
| --- | --- | --- | --- | --- |
| 1. Seconds against half an hour | supports | supports | cannot | cannot |
| 2. Fact against physical skill | supports | cannot | cannot | cannot |
| 3. One general reduction | against | against | supports | against |

Across the nine core cells: four supports, two againsts, three cannot-decides.
**Profile A settles all three claims and is the only one that does**, which is
the argument of the tool — the case that makes the distinctions visible is not
the case you will usually be handed.

### What was cut, and why

The grid was five claims by five profiles. Three things earned nothing:

- **Profile C** (recall at floor, recognition normal) had a verdict column
  identical to profile A on every one of the five claims. Its one distinct
  contribution — the retrieval-versus-storage trap — is a question about
  designing a better test, so it is now the challenge task.
- **Episode against word meaning** had a verdict row identical to *fact against
  physical skill* on every profile. Skill learning is kept because it is the
  stronger contrast and the one measure not made of words, which is what makes
  D's confound visible.
- **Retrieval rather than storage** was `cannot` in all twenty-five cells. A row
  that never discriminates cannot teach a discrimination.

**Span with manipulation** was dropped from the battery for the same reason: it
moved with immediate span in every profile and no claim distinguished them.

The challenge asks what would decide it. The intended answer is to make the
recognition test hard enough that healthy controls score no better on it than
on recall — more similar foils, more items, longer lists. If recognition is
still spared once difficulty is equated, the retrieval account has evidence.

## Citation and evidence notes

- **Scoville and Milner (1957)** and **Corkin (2002)** for the case that
  established the short-term/long-term and episodic/procedural distinctions.
  The tool deliberately does not reproduce it.
- **Shallice and Warrington (1970)** for the reverse pattern — impaired span
  with preserved long-term learning — which is what turns a single
  dissociation into a double one.
- **Tulving (1972, 1985)** for the episodic/semantic distinction and the
  multiple-systems framework.
- **Squire (2004)** for the standard taxonomy, and **Cabeza and Moscovitch
  (2013)** for the argument that systems and processes are not alternatives.
- **Hodges and Patterson (2007)** on semantic memory loss, and why episodic
  measures built from words become uninterpretable when word knowledge is
  affected.
- **Yonelinas (2002)** on familiarity and recollection in recognition, which
  is the literature the challenge points towards.
- **Aggleton and Brown (1999)** for the argument that recall and recognition
  depend on partly different circuitry, and the difficulty-matching problem
  that made it hard to test.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its fictional profiles from any of them.
