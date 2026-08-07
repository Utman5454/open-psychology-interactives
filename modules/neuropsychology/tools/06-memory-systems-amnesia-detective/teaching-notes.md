# Teaching notes — Memory Systems Detective

`modules/neuropsychology/tools/06-memory-systems-amnesia-detective/`

Twelve of the twenty-five cells cannot be decided. Students reach for that
answer last, and it is the commonest correct one.

---

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

- **Demonstration from the front:** 12 minutes — profiles A, C and E.
- **Students in pairs:** 35 minutes for all twenty-five cells.
- **With the challenge and debrief:** 50 minutes.

## Preparation

None. Say at the start that "this profile cannot decide it" is used twelve
times out of twenty-five. Without that, students force every profile into a
conclusion, and the exercise teaches the opposite of what it should.

## The demonstration worth doing from the front

**Profile A** first, to establish what support looks like: word knowledge and
skill learning at the control average, learning and recall four SDs below. One
measure clearly intact, a comparable one clearly not.

**Profile B** immediately after, so the crossover is visible: span three and a
half SDs below with delayed recall inside the control range. Put A and B side
by side and the short-term/long-term distinction has a double dissociation
behind it rather than a single one.

**Profile C** is the one to slow down on. Recall at floor, recognition normal.
Ask the room whether the difficulty is at retrieval. Most say yes. Then ask
which of the two tasks healthy controls find easier. The comparison is between
two tasks of unequal difficulty, so a trace too weak to be recalled can still
be recognised — and until the two are matched, the pattern is suggestive
rather than decisive.

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
2. **Profile A**, all five claims. Establish what support looks like and that
   claim 5 is answered "counts against".
3. **Profile B.** The crossover, and the two "cannot decide" cells that follow
   from having no clearly impaired long-term measure.
4. **Profile C.** Claims 1–3 support; claim 4 does not.
5. **Profile D.** Every cell except claim 5 cannot be decided, and the reason
   is the same each time: the material.
6. **Profile E.** Four cannot-decides and one support.
7. **Open the grid** and read the shape of it.
8. **The challenge.**

## Debrief questions

1. Profile A supports the short-term/long-term distinction and profile B
   supports it better. Why?
2. Profile D looks like support for the episodic/skill distinction and is not.
   What exactly is wrong with the comparison?
3. Claim 4 is never supported by any profile. What would a profile have to
   look like for it to be?
4. Name five explanations of profile E that are not a memory system, and say
   what you would do about each.
5. The tool never mentions where anything is. What would adding imaging change
   about the twenty-five judgements?
6. Which cell in the grid would you argue with, and on what grounds?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Impaired here and intact there means two systems." | It means the two tasks do not require all the same things. That is a smaller claim and it is what the evidence gives. |
| "Normal recognition proves it is retrieval." | Recognition is easier. Match the difficulty first. This is claim 4 and it is never supported. |
| "Profile D shows episodic and procedural come apart." | The two differ in system *and* in material *and* in response. A contrast that varies three things cannot be pinned on one. |
| "Profile E is early dementia." | Nothing in the profile says so, and at least six other explanations produce that shape. The tool names no syndrome anywhere and neither should the answer. |
| "Cannot decide means the data are useless." | It means these data do not decide *this claim*. Profile D decides claim 5 perfectly well. |
| "The intended answers are the right answers." | They are a position to argue with. Several cells are genuinely arguable, and the tool says so in its own feedback. |
| "A score two SDs below the control average is a diagnosis." | It is a position in a distribution. Everything that makes it clinical is context the tool does not contain. |

## Limitations and cautions

- **Nobody is described.** Five invented profiles with invented numbers,
  written to make particular inferences possible or impossible.
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
2. **Design profile F.** Invent a profile that would support claim 4. What
   would it have to contain, and why is it hard to obtain?
3. **De-confound profile D.** Which measures would you replace, and with what,
   to make its episodic scores readable?
4. **Rule out profile E.** Write the order in which you would investigate the
   alternatives, cheapest and least invasive first.
5. **Familiarity and recollection.** Read about the two-process account of
   recognition and say what it would add to claim 4.

## The model

Every score is a distance from the average of that measure's own fictional
control group, in control standard deviations. Clearly below is −2.0 or lower;
within range is above about −1.2.

### The five profiles

| Measure | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| Immediate span | +0.2 | −3.4 | −0.1 | −0.3 | −1.1 |
| Span with manipulation | −0.3 | −3.0 | −0.4 | −0.6 | −1.3 |
| Learning across trials | −3.8 | −1.1 | −2.9 | −2.4 | −1.2 |
| Free recall after 30 min | −4.5 | −0.9 | −4.1 | −2.8 | −1.4 |
| Recognition after 30 min | −3.6 | −0.2 | −0.3 | −2.2 | −1.0 |
| Word knowledge | +0.1 | +0.3 | +0.2 | −4.2 | −0.9 |
| Skill learning | −0.2 | +0.1 | −0.1 | −0.2 | −1.2 |

### The intended grid

| Claim | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| 1. Seconds against half an hour | supports | supports | supports | cannot | cannot |
| 2. Episode against word meaning | supports | cannot | supports | cannot | cannot |
| 3. Fact against physical skill | supports | cannot | supports | cannot | cannot |
| 4. Retrieval rather than storage | cannot | cannot | cannot | cannot | cannot |
| 5. One general reduction | against | against | against | against | supports |

Eight supports, five againsts, twelve cannot-decides. **Row 4 is never
supported**, which is the argument of the tool: the pattern always cited for a
retrieval account is a comparison between two tasks of unequal difficulty.

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
