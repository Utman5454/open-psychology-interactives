# Four Ways to Answer the Same Questionnaire — Simplified Edition

**Module:** Personality & Individual Differences
**Duration:** 5–7 minutes
**Level:** First or second year
**Edition:** Simplified. This keeps the response grids, the recoded scores and
the balanced-keying control from the **Response-Style Simulator**, which the
original's own notes call the most practically useful thing in it. Three
further styles, the split-half and longest-run statistics and the diagnosis
exercise are in the longer version at
`modules/personality-individual-differences/tools/14-response-style-simulator/`.

## A word before you teach it

Response styles are routinely written about as though they were failures of
character or attention. They are not, and the page says so. Agreeing readily
and using the ends of a scale both vary systematically between cultures and
with education; staying near the middle may be caution, ambivalence, or items
that genuinely do not apply; and an apparently careless pattern can come from
fatigue, pain, or a badly built form met with a screen reader. If the
discussion turns to what kind of person answers each way, that is the moment to
say that a pattern is evidence about a pattern.

## Learning objectives

By the end, a student should be able to:

1. recognise the three styles from a response grid;
2. explain why reverse-worded items cancel acquiescence;
3. explain why the same recoding does nothing for the other two styles;
4. explain why an unbalanced scale confuses agreeing with holding a trait;
5. say what a response pattern cannot establish.

## Preparation

None.

## Suggested use

**Before students write their own questionnaire.** The reason to reverse-word
items becomes arithmetical rather than a rule to follow.

**In a lecture on measurement error**, as the case where the error is
systematic and person-specific rather than random.

**Projected, with the vote taken first.** Most of a room votes "all three".

## Prediction question

> Half the items are reverse worded. Whose score does that rescue?

Only the person who agrees with everything. The reason is that agreeing adds a
constant, and recoding turns a constant into a subtraction on the reversed
half, while the other two styles multiply the distance from the midpoint and a
multiplication survives the flip.

## Activity sequence

1. **Take the vote.**
2. **Read the grids across.** The agreeing row never drops below 3. The ends
   row is full of 1s and 5s. The central row is almost all 3s.
3. **Read the four scores against the upright line.** The straightforward and
   the agreeing respondent are both on it. The other two are not.
4. **Press "Show the unbalanced questionnaire".** The agreeing respondent
   jumps by about a point. Ask what changed about the person. Nothing.
5. **Look back at the other two rows.** They barely moved. Balancing was never
   doing anything for them.
6. **Move the standing slider to the extremes.** At the top of the scale the
   cancellation breaks down, because answers cannot go above 5.

## Debrief questions

- How would you spot each of these three styles in real data?
- Why does reverse wording cancel agreement but not extremity?
- On the unbalanced questionnaire, two readings of the agreeing respondent's
  score are available. What are they, and can the data choose between them?
- The person who stays central scores below their true standing. What would
  happen to a correlation computed on a sample of such people?
- What would you need, beyond the grid, to say why somebody answered this way?

## Likely misconceptions

- **Reverse wording fixes response styles.** It fixes one of them.
- **The agreeing respondent is careless.** Nothing in the grid says that.
  Acquiescence varies with culture and education and is not inattention.
- **Extreme responding is just strong opinions.** It is a way of using the
  scale that shows up independently of item content, which is why it inflates
  the score whichever way an item is worded.
- **Staying central means no opinion.** It may be caution, ambivalence, or
  items that do not apply.
- **You can tell from the grid what somebody was doing.** You can tell what
  pattern is present. That is all.

## Limitations and cautions

Four invented respondents, answers from a formula, a fixed seed, and one shared
set of underlying reactions so that the rows differ only by style. Real
respondents differ from one another for many reasons at once and no real
questionnaire separates the causes this cleanly. Every item has the same
discrimination, and a style is treated as a fixed transformation rather than
something that drifts through a long form. The cancellation is exact in the
middle of the scale and breaks down near its ends, which is a property of
bounded rating scales rather than a defect of the demonstration.

## Accessibility considerations

Every answer is in a real table with row and column headers, and reverse-worded
items are marked with a letter in the column heading rather than by colour, so
the grid is fully readable without the figure. True standing is a native range
input reporting its value in text; the questionnaire toggle is a button
carrying `aria-pressed` and a visible word saying which version is in use. Each
score tile states in words how far the score is from the accurate value. The
chart names every respondent, aligns the values in a column, and its
description gives all four scores and the accurate value.

## Optional extension

Ask students what they would do about extreme and midpoint responding, given
that balancing does not touch either. Ipsatising, within-person standardisation
and anchoring vignettes all come up, and all three cost something. That the
easy fix only covers one of the three problems is the useful thing to leave
with.

## Evidence and citation notes

On acquiescence and what balanced keying does about it see Ray (1983),
*Reviewing the problem of acquiescent response bias*, **Journal of Social
Psychology**, 121(1), 81–96. On cross-cultural variation in extreme and
acquiescent responding see Harzing (2006), *Response styles in cross-national
survey research*, **International Journal of Cross Cultural Management**, 6(2),
243–266, and Johnson, Kulesa, Cho and Shavitt (2005), *The relation between
culture and response styles*, **Journal of Cross-Cultural Psychology**, 36(2),
264–277. On the costs of reverse-worded items, which are real and pull the
other way, see the paired Simplified Edition activity **Reverse-Item Disaster**
and Weijters and Baumgartner (2012), *Misresponse to reversed and negated
items in surveys*, **Journal of Marketing Research**, 49(5), 737–747.
