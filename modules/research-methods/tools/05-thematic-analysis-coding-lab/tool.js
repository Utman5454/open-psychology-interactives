/* =========================================================================
   Thematic Analysis Coding Laboratory
   -------------------------------------------------------------------------
   Six invented interview extracts about asking for help at university. The
   learner writes a code of their own, optionally borrows from a bank of six
   candidate codes, and then sets their reading beside three coding passes
   over the same words.

   WHY THERE IS NO ANSWER KEY
   --------------------------
   In reflexive thematic analysis the researcher is part of the analysis.
   Coding is an analytic act - a short account of what this analyst noticed,
   written in this analyst's words, from a position this analyst occupies -
   and not an extraction of something already sitting in the transcript. Two
   competent analysts producing different codes for the same extract is the
   expected case, not a reliability failure.

   The tool therefore:

     * never marks a code right or wrong;
     * never computes agreement between codings, and says on the page why
       inter-rater agreement is not the criterion for this method;
     * presents THREE defensible passes rather than one correct one, each with
       a written account of what it brings forward and what it pushes out of
       view;
     * echoes the learner's own code back without evaluating it;
     * ends each extract with a reflexive prompt about what the reader brought
       with them.

   The three passes are:

       semantic   staying close to what is said
       latent     reading for what the speaker is doing
       critical   reading for the setting that makes this sayable

   These are three positions on a continuum, chosen to make the range visible.
   A narrative, psychosocial or feminist reading would produce others again,
   and the debrief says so.

   Anything the learner types stays in the tab. There is no storage, no
   network request, and nothing is scored or inferred about the person using
   the tool. The extracts are invented for teaching: no participant,
   interview, institution or study is represented.
   ========================================================================= */

(function () {
  "use strict";

  var LEVEL_WORD = {
    semantic: "Semantic",
    latent: "Latent",
    critical: "Situated"
  };

  /* =======================================================================
     The fictional dataset
     ===================================================================== */

  var EXTRACTS = [
    {
      short: "Ama",
      speaker: "Ama, second year — invented extract",
      text:
        "I did think about emailing the tutor, but then you sort of think, " +
        "everyone else seems to have got it, so you'd be the one putting your " +
        "hand up saying I'm the one who hasn't. So I left it. And then it was " +
        "too late to ask, because by then you should have asked three weeks " +
        "ago.",
      bank: [
        {
          id: "compare",
          label: "Comparing self with others",
          level: "semantic",
          note:
            "Stays very close to the words. It captures 'everyone else seems " +
            "to have got it' and leaves out the part about time running out, " +
            "which may be the more distinctive thing here."
        },
        {
          id: "delay",
          label: "Delaying until it is too late",
          level: "semantic",
          note:
            "Also close to the words, and it catches the shape of the account: " +
            "a decision not made, then a window closing. Note that it describes " +
            "a sequence without saying what drove it."
        },
        {
          id: "exposure",
          label: "Asking as making oneself visible",
          level: "latent",
          note:
            "Goes further than the words. 'Putting your hand up' is read as " +
            "exposure rather than as a request for information. Defensible " +
            "from 'you'd be the one', and it is an interpretation and owes the " +
            "reader a justification."
        },
        {
          id: "shift",
          label: "Shifting from 'I' to 'you'",
          level: "latent",
          note:
            "A code about the talk itself. Ama moves into the second person " +
            "exactly where the difficult feeling is. That may be doing work - " +
            "generalising a private discomfort - or it may be ordinary speech. " +
            "Codes like this are worth keeping and worth holding lightly."
        },
        {
          id: "deadline",
          label: "An unwritten deadline for being confused",
          level: "critical",
          note:
            "Reads the setting rather than the speaker: somewhere there is a " +
            "rule that confusion is acceptable in week one and not in week " +
            "four, and nobody wrote it down. This code sends the analysis " +
            "towards the course rather than towards Ama."
        },
        {
          id: "confidence",
          label: "Low confidence",
          level: "latent",
          note:
            "Common, and worth pausing over. It converts an account of a " +
            "situation into a property of a person, and it does so quickly. " +
            "Nothing in the extract says Ama lacks confidence generally; the " +
            "code has imported an explanation."
        }
      ],
      passes: [
        {
          level: "semantic",
          name: "Staying close to what is said",
          codes: [
            "Thinking about emailing the tutor",
            "Everyone else appears to understand",
            "Deciding not to ask",
            "Missing the window to ask"
          ],
          fore:
            "The sequence of events, in Ama's own terms. Anyone could check " +
            "these against the extract in seconds.",
          back:
            "Why any of it happened. A semantic pass over six extracts gives " +
            "you a reliable inventory and no argument."
        },
        {
          level: "latent",
          name: "Reading for what the speaker is doing",
          codes: [
            "Asking as self-exposure",
            "Managing how one appears to the group",
            "Retrospectively justifying not asking",
            "Moving into 'you' where the discomfort is"
          ],
          fore:
            "The social risk in a request for information, and the work Ama " +
            "does to make the decision sound reasonable afterwards.",
          back:
            "The possibility that this is simply about a busy week. Latent " +
            "coding finds meaning, and the price is that it can find it " +
            "whether or not it is there."
        },
        {
          level: "critical",
          name: "Reading for the setting that makes this sayable",
          codes: [
            "An unwritten expiry date on being confused",
            "Comprehension as a public performance",
            "Help routed through an act of self-identification",
            "Silence as the low-cost option the system rewards"
          ],
          fore:
            "The course, not the student. On this reading the interesting " +
            "object is a teaching arrangement in which asking costs something " +
            "and not asking costs nothing until it is too late.",
          back:
            "Ama as a person with a particular history. The critical pass can " +
            "explain the pattern and lose the individual account it came from."
        }
      ],
      reflexive: {
        question:
          "Before you coded this, what did you assume about why Ama did not " +
          "email? Notice whether your first code named something about Ama or " +
          "something about the course.",
        options: [
          {
            label: "That she was anxious or lacking in confidence",
            note:
              "A very common first reading, and it converts a situation into a " +
              "disposition. It may be right. It is worth noticing that the " +
              "extract does not say it, and that you supplied it."
          },
          {
            label: "That the tutor was unapproachable",
            note:
              "Also supplied rather than said - there is no tutor in this " +
              "extract except as the recipient of an unsent email. If your " +
              "codes blame the tutor, that is your reading arriving early."
          },
          {
            label: "That this is normal and everyone does it",
            note:
              "Normalising can be generous and it can flatten. If it is " +
              "ordinary, the analytic question becomes what makes it ordinary - " +
              "which is where the situated pass goes."
          },
          {
            label: "That I have done exactly this myself",
            note:
              "Recognition is a resource, not a contaminant. It lets you see " +
              "quickly and it makes it harder to notice what is different about " +
              "this account. Reflexive practice means using it and saying you " +
              "used it."
          }
        ]
      }
    },

    {
      short: "Jonah",
      speaker: "Jonah, first year — invented extract",
      text:
        "There's a form. You fill in the form and then someone emails you back " +
        "with a link to a page you already read. I filled it in twice. The " +
        "second time I didn't bother reading the reply.",
      bank: [
        {
          id: "form",
          label: "Using the online form",
          level: "semantic",
          note:
            "Faithful and thin. It records what happened and none of the " +
            "flatness of the telling, which is most of what is here."
        },
        {
          id: "circular",
          label: "Being returned to what you already had",
          level: "semantic",
          note:
            "Still close to the words and considerably more useful: it names " +
            "the shape of the encounter rather than just the channel."
        },
        {
          id: "giveup",
          label: "Disengaging after a failed attempt",
          level: "latent",
          note:
            "An interpretation of 'I didn't bother reading the reply' as " +
            "withdrawal. Defensible. Note it treats a small act as evidence of " +
            "a larger stance, which is exactly what latent coding does and " +
            "exactly what it must justify."
        },
        {
          id: "flat",
          label: "Telling it flatly, without complaint",
          level: "latent",
          note:
            "A code about how the story is told rather than what it contains. " +
            "Jonah does not say the system is bad; he describes it and stops. " +
            "That restraint may itself be the finding."
        },
        {
          id: "processed",
          label: "Support delivered as a process, not a conversation",
          level: "critical",
          note:
            "Reads the institution. The reply was generated, correct, and " +
            "useless, which is what happens when help is designed for " +
            "throughput. Sends the analysis towards service design."
        },
        {
          id: "unmotivated",
          label: "Not trying hard enough",
          level: "latent",
          note:
            "Included deliberately. It is a code somebody would write, and it " +
            "carries a judgement into the data under the appearance of a " +
            "description. Notice how it makes the second attempt disappear."
        }
      ],
      passes: [
        {
          level: "semantic",
          name: "Staying close to what is said",
          codes: [
            "Filling in the online form",
            "Receiving a link already read",
            "Trying twice",
            "Not reading the second reply"
          ],
          fore: "The steps, in order, and the fact that he tried more than once.",
          back:
            "The tone. Everything distinctive about this extract is in how " +
            "little Jonah makes of it, and none of that survives here."
        },
        {
          level: "latent",
          name: "Reading for what the speaker is doing",
          codes: [
            "Persisting, then withdrawing",
            "Declining to complain",
            "Treating the reply as not addressed to him",
            "Reporting rather than protesting"
          ],
          fore:
            "A person who did the reasonable thing twice and stopped, and who " +
            "does not present that as a grievance.",
          back:
            "What the service actually did. A reading focused on Jonah's " +
            "stance can leave the machinery that produced it uninspected."
        },
        {
          level: "critical",
          name: "Reading for the setting that makes this sayable",
          codes: [
            "Help as a ticketing process",
            "A reply that discharges the obligation without meeting the need",
            "Effort transferred to the person with the least information",
            "Non-response made to look like non-engagement"
          ],
          fore:
            "That the encounter was designed. Somebody built the form, wrote " +
            "the template and set what counts as a resolved case.",
          back:
            "Jonah's own account of himself, which is understated and might " +
            "reward attention on its own terms."
        }
      ],
      reflexive: {
        question:
          "Did you read Jonah as let down, or as insufficiently persistent? " +
          "Both readings fit four sentences. Which one did you reach for, and " +
          "what does it say about where you expect responsibility to sit?",
        options: [
          {
            label: "That the university had failed him",
            note:
              "Reasonable, and note the speed. He never says it. Attributing " +
              "the failure is your move, and a critical reading has to own it " +
              "rather than present it as what the data said."
          },
            {
            label: "That he should have gone to see someone in person",
            note:
              "This puts the remedy back on Jonah. Worth asking what makes " +
              "that seem obvious to you, and whether it would seem obvious to " +
              "a first-year who does not know whose door to knock on."
          },
          {
            label: "That the flatness meant he did not care much",
            note:
              "Possible. Also possible is that flatness is how a person keeps " +
              "hold of their dignity while describing being ignored. Codes " +
              "about tone are useful and easy to over-read."
          },
          {
            label: "That this is a story about administration, not about learning",
            note:
              "A framing decision made before any coding. It will decide which " +
              "extracts look relevant later, which is precisely why it belongs " +
              "in a reflexive account rather than in the background."
          }
        ]
      }
    },

    {
      short: "Priya",
      speaker: "Priya, third year — invented extract",
      text:
        "My flatmate asked for an extension and got one, so I asked. It felt " +
        "like knowing the trick. Nobody tells you the trick. You find out from " +
        "someone who found out from someone.",
      bank: [
        {
          id: "flatmate",
          label: "Learning from a flatmate",
          level: "semantic",
          note:
            "Accurate and small. It records the source of the information and " +
            "not the fact that a source was needed at all."
        },
        {
          id: "trick",
          label: "The rules described as a 'trick'",
          level: "semantic",
          note:
            "A code that quotes the participant's own term. In-vivo codes like " +
            "this keep the analyst's vocabulary out of the way for a moment, " +
            "which is useful early and is not automatically better."
        },
        {
          id: "insider",
          label: "Entitlement as something you find out you have",
          level: "latent",
          note:
            "Reads 'the trick' as being about access rather than cunning. A " +
            "sizeable interpretive step from four sentences, and traceable to " +
            "'nobody tells you'."
        },
        {
          id: "permission",
          label: "Needing someone else's precedent before acting",
          level: "latent",
          note:
            "Notices that Priya asked only after seeing it work for someone " +
            "else. That may be about confidence, or about not knowing the " +
            "request was permitted; the code does not settle which."
        },
        {
          id: "network",
          label: "Rules distributed through networks rather than published",
          level: "critical",
          note:
            "The hidden curriculum, named. On this reading the finding is " +
            "about who has a flatmate who knows, which turns a story about " +
            "extensions into a story about unequal access."
        },
        {
          id: "savvy",
          label: "Being resourceful",
          level: "latent",
          note:
            "A code that praises. It reframes an unequal information system as " +
            "a personal virtue, and in doing so makes the system disappear. " +
            "Flattering codes deserve the same suspicion as critical ones."
        }
      ],
      passes: [
        {
          level: "semantic",
          name: "Staying close to what is said",
          codes: [
            "Finding out about extensions informally",
            "Asking after seeing a flatmate succeed",
            "Describing the process as a 'trick'",
            "Information passed person to person"
          ],
          fore: "Where the knowledge came from, in Priya's own words.",
          back:
            "Any question about who does not have a flatmate in the right " +
            "position."
        },
        {
          level: "latent",
          name: "Reading for what the speaker is doing",
          codes: [
            "Treating a right as a piece of insider knowledge",
            "Needing a precedent before making a request",
            "Mild irony about how she came to know",
            "Positioning herself as newly let in"
          ],
          fore:
            "Priya's shifting sense of what she was entitled to ask for, which " +
            "changed without any rule changing.",
          back:
            "The distributional question, which on this reading stays in the " +
            "background as context."
        },
        {
          level: "critical",
          name: "Reading for the setting that makes this sayable",
          codes: [
            "The hidden curriculum of entitlement",
            "Rules that are published and not communicated",
            "Access mediated by social networks",
            "Advantage reproduced through who you happen to live with"
          ],
          fore:
            "That the same regulation produces different outcomes for students " +
            "with different networks - a claim about equity rather than about " +
            "Priya.",
          back:
            "Priya's own ambivalence. She is not making this argument, and a " +
            "reading that goes here has to be honest that it is the analyst's " +
            "argument."
        }
      ],
      reflexive: {
        question:
          "This extract is the clearest case in the dataset where the semantic " +
          "and situated passes point in different directions. Which did you " +
          "reach first - and did the research question you imagined make that " +
          "choice for you?",
        options: [
          {
            label: "I read it as being about Priya's confidence",
            note:
              "Then your later themes will be about students. That is a " +
              "coherent study, and it will have little to say about why the " +
              "information was distributed the way it was."
          },
          {
            label: "I read it as being about unfair access",
            note:
              "Then your later themes will be about the institution. Also " +
              "coherent, and it risks writing over Priya's own relatively " +
              "light account of the episode."
          },
          {
            label: "I noticed 'the trick' first",
            note:
              "Staying with the participant's own word is a good discipline. " +
              "Notice that it does not keep you neutral - 'trick' already " +
              "implies a rule you were not told."
          },
          {
            label: "I was thinking about my own experience of extensions",
            note:
              "Which will make some things instantly visible and others " +
              "invisible. Reflexivity is not removing this; it is saying where " +
              "you were standing."
          }
        ]
      }
    },

    {
      short: "Kwame",
      speaker: "Kwame, second year — invented extract",
      text:
        "I don't want to be the student who's always struggling. There's a " +
        "version of me they've got in their heads and I'd rather it stayed the " +
        "one who's fine.",
      bank: [
        {
          id: "notstruggling",
          label: "Not wanting to be seen as struggling",
          level: "semantic",
          note:
            "Almost a restatement. Useful as a first pass and it does not yet " +
            "say anything the extract has not said."
        },
        {
          id: "version",
          label: "'A version of me they've got in their heads'",
          level: "semantic",
          note:
            "An in-vivo code. Kwame has given you a better phrase than most " +
            "analysts would write, and keeping it preserves something the " +
            "paraphrase loses."
        },
        {
          id: "impression",
          label: "Managing an impression held by staff",
          level: "latent",
          note:
            "Names what the extract is doing in more analytic language. Note " +
            "the cost: 'impression management' arrives with a literature " +
            "attached, and the code quietly recruits the extract into it."
        },
        {
          id: "cost",
          label: "Weighing help against reputation",
          level: "latent",
          note:
            "Reads the extract as a trade-off, which is not stated but is " +
            "strongly implied by 'I'd rather'. A defensible inference and an " +
            "inference."
        },
        {
          id: "surveil",
          label: "Being continuously assessed as a kind of person",
          level: "critical",
          note:
            "Reads the setting: a place where staff form and retain judgements " +
            "about students, and students know it. This code makes the " +
            "extract about institutional attention rather than about Kwame."
        },
        {
          id: "efficacy",
          label: "Low academic self-efficacy",
          level: "latent",
          note:
            "A theoretical label imported wholesale. It is a diagnosis rather " +
            "than a code: nothing here says Kwame doubts his ability, only " +
            "that he cares what is thought of him. Watch how much this one " +
            "adds."
        }
      ],
      passes: [
        {
          level: "semantic",
          name: "Staying close to what is said",
          codes: [
            "Not wanting to be the struggling student",
            "Awareness of how staff see him",
            "Preferring the existing impression to stand"
          ],
          fore: "Exactly what Kwame said, in three lines.",
          back:
            "Everything else. This is the extract where a purely semantic pass " +
            "most obviously runs out of things to say."
        },
        {
          level: "latent",
          name: "Reading for what the speaker is doing",
          codes: [
            "Protecting an identity that has to be maintained",
            "Trading support for reputation",
            "Treating staff perception as durable",
            "Help-seeking as an admission"
          ],
          fore:
            "The exchange rate. Asking for help costs something specific, and " +
            "Kwame has priced it.",
          back:
            "Why staff perception should be durable at all, which is not a " +
            "fact about Kwame."
        },
        {
          level: "critical",
          name: "Reading for the setting that makes this sayable",
          codes: [
            "Students as objects of continuous institutional judgement",
            "Support systems that require self-identification as struggling",
            "Deficit as an available category to be avoided",
            "Who can afford to be seen needing help"
          ],
          fore:
            "That the category 'struggling student' exists, is administered, " +
            "and has consequences - which is what makes avoiding it rational.",
          back:
            "Kwame's individual history, and the possibility that this is " +
            "ordinary self-presentation rather than institutional pressure."
        }
      ],
      reflexive: {
        question:
          "Did you find yourself wanting to reassure Kwame? Note where that " +
          "impulse would have taken the coding - towards correcting a belief, " +
          "and away from asking whether the belief is accurate.",
        options: [
          {
            label: "I thought he was wrong that staff think that way",
            note:
              "Which turns the analysis into a study of misperception. Worth " +
              "asking on what evidence you concluded he was wrong."
          },
          {
            label: "I thought he was right and it is a problem",
            note:
              "Which turns it into a study of institutional judgement. Also " +
              "not established by the extract, and a defensible place to stand " +
              "if you say so."
          },
          {
            label: "I reached for a psychological construct straight away",
            note:
              "Self-efficacy, impression management, stigma - all fit, all " +
              "arrive with commitments. A construct is a strong claim wearing " +
              "the clothes of a label."
          },
          {
            label: "I noticed he never mentions the work itself",
            note:
              "A good observation, and an argument from absence. Absences are " +
              "legitimate analytic material and need more support than " +
              "presences, because you cannot quote them."
          }
        ]
      }
    },

    {
      short: "Lena",
      speaker: "Lena, first year — invented extract",
      text:
        "I asked in the seminar and she just answered it, no fuss, and " +
        "afterwards two people said they'd wanted to ask the same thing. So it " +
        "was fine. It's just the first one that costs something.",
      bank: [
        {
          id: "asked",
          label: "Asking in the seminar and being answered",
          level: "semantic",
          note:
            "The event. Note this is the only extract in the set where asking " +
            "goes well, which makes it disproportionately important."
        },
        {
          id: "others",
          label: "Others had the same question",
          level: "semantic",
          note:
            "Close to the words and quietly powerful: it makes Ama's 'everyone " +
            "else seems to have got it' look like a shared error."
        },
        {
          id: "firstcost",
          label: "A cost paid only by the first person to ask",
          level: "latent",
          note:
            "Reads 'it's just the first one that costs something' as a general " +
            "principle rather than a passing remark. Whether that is warranted " +
            "from one sentence is a real question."
        },
        {
          id: "disconfirm",
          label: "Evidence that the feared outcome does not occur",
          level: "latent",
          note:
            "Frames the extract as disconfirmation. Useful, and it makes Lena " +
            "into a test case for someone else's belief rather than a person " +
            "with an account."
        },
        {
          id: "public",
          label: "Silence maintained collectively",
          level: "critical",
          note:
            "Reads the room: several people wanted to ask and none did, so the " +
            "silence was produced by everyone at once. Points at a seminar " +
            "norm rather than at any individual."
        },
        {
          id: "brave",
          label: "Being brave",
          level: "latent",
          note:
            "Complimentary and costly. It relocates the whole phenomenon into " +
            "personal character, and if bravery is the explanation there is " +
            "nothing left to change about the seminar."
        }
      ],
      passes: [
        {
          level: "semantic",
          name: "Staying close to what is said",
          codes: [
            "Asking a question in the seminar",
            "Receiving a straightforward answer",
            "Two others had wanted to ask",
            "Describing it afterwards as fine"
          ],
          fore: "A case where asking worked, recorded plainly.",
          back:
            "The last sentence, which is the analytic one and which a semantic " +
            "code can only repeat."
        },
        {
          level: "latent",
          name: "Reading for what the speaker is doing",
          codes: [
            "Revising an expectation after the event",
            "Pricing the first question as the expensive one",
            "Presenting a risk retrospectively as small",
            "Discovering the question was shared"
          ],
          fore:
            "That the cost was anticipated rather than incurred, and that the " +
            "anticipation was wrong.",
          back:
            "Why so many people were carrying the same unasked question, which " +
            "is not a fact about Lena at all."
        },
        {
          level: "critical",
          name: "Reading for the setting that makes this sayable",
          codes: [
            "Silence produced collectively and attributed individually",
            "The first question as a public good somebody has to pay for",
            "Seminar norms that make comprehension performative",
            "A cost that falls on whoever is least able to bear it"
          ],
          fore:
            "That the seminar had a shared problem and a design in which " +
            "solving it required one person to volunteer to look confused.",
          back:
            "Lena's own summary - 'so it was fine' - which this reading has to " +
            "work past rather than with."
        }
      ],
      reflexive: {
        question:
          "This is the only positive case in the set. Did you find it less " +
          "interesting? Analysts tend to code trouble more richly than " +
          "ordinariness, and the resulting themes then describe a dataset that " +
          "was never that bleak.",
        options: [
          {
            label: "I coded this one more thinly than the others",
            note:
              "Extremely common, and it biases the eventual themes. If four " +
              "extracts get twelve codes and this one gets three, the analysis " +
              "has already decided what the story is."
          },
          {
            label: "I treated it as the exception that proves the pattern",
            note:
              "A move that needs justifying rather than assuming. A case that " +
              "does not fit is the best test the analysis has, and folding it " +
              "in too early wastes it."
          },
          {
            label: "I focused on the last sentence and ignored the rest",
            note:
              "Understandable - it is the quotable line. Notice that this " +
              "selects for what will look good in the write-up, which is a " +
              "pressure worth naming."
          },
          {
            label: "I read it as showing the others were worrying over nothing",
            note:
              "Which converts the finding into individual misjudgement. One " +
              "successful case does not establish that the risk was imaginary, " +
              "only that it did not materialise here."
          }
        ]
      }
    },

    {
      short: "Toby",
      speaker: "Toby, mature student, second year — invented extract",
      text:
        "I've worked in an office for eleven years. You ask, someone tells " +
        "you, that's the job. Here it's like admitting something. I still ask, " +
        "but I notice that I notice.",
      bank: [
        {
          id: "compareplaces",
          label: "Comparing university with the workplace",
          level: "semantic",
          note:
            "The organising move of the extract, recorded plainly. Everything " +
            "else here depends on it."
        },
        {
          id: "stillasks",
          label: "Continuing to ask anyway",
          level: "semantic",
          note:
            "Worth coding precisely because it complicates the pattern: Toby " +
            "feels the pressure and does not comply with it."
        },
        {
          id: "admit",
          label: "Asking reframed as admitting",
          level: "latent",
          note:
            "Names the transformation Toby is describing. The same act means " +
            "something different in a different place, which is a claim about " +
            "context rather than about people."
        },
        {
          id: "noticing",
          label: "Noticing oneself noticing",
          level: "latent",
          note:
            "A code about reflexive awareness in the participant. It is also " +
            "a gift to the analyst, since Toby is doing openly what the " +
            "analyst is trying to do."
        },
        {
          id: "norms",
          label: "Local norms that make an ordinary act costly",
          level: "critical",
          note:
            "Generalises from Toby's comparison to a claim about the setting. " +
            "Strongly supported here, because he has supplied the contrast " +
            "himself rather than the analyst supplying it."
        },
        {
          id: "mature",
          label: "Mature student perspective",
          level: "semantic",
          note:
            "A category label rather than a code. It sorts the extract into a " +
            "bin without saying anything about it, and bins like this " +
            "accumulate quietly until the codebook is a filing system."
        }
      ],
      passes: [
        {
          level: "semantic",
          name: "Staying close to what is said",
          codes: [
            "Eleven years of office work",
            "Asking as routine at work",
            "Asking as admission at university",
            "Continuing to ask despite this"
          ],
          fore: "The comparison, and the fact that his behaviour did not change.",
          back:
            "Nothing much - this is the extract where a semantic pass performs " +
            "best, because Toby has done the analytic work aloud."
        },
        {
          level: "latent",
          name: "Reading for what the speaker is doing",
          codes: [
            "Using another setting as a measuring stick",
            "Resisting a norm while feeling it",
            "Reflexive awareness of one's own reaction",
            "Claiming a position from outside the student role"
          ],
          fore:
            "That Toby has a place to stand that the other five do not, and " +
            "that this is what makes the norm visible to him.",
          back:
            "The norm itself, which stays in the background as the thing being " +
            "compared to."
        },
        {
          level: "critical",
          name: "Reading for the setting that makes this sayable",
          codes: [
            "Institutional norms revealed by contrast with elsewhere",
            "Asking recoded as confession by the setting, not the speaker",
            "Prior work identity as a resource for resisting a student role",
            "The norm's grip is uneven and depends on what else you have been"
          ],
          fore:
            "The strongest evidence in the dataset that the phenomenon belongs " +
            "to the place rather than to the students, precisely because one " +
            "participant arrived with a comparison.",
          back:
            "How unusual Toby is. Building a claim about a setting on the one " +
            "person positioned to see it is a real vulnerability and should be " +
            "written down as one."
        }
      ],
      reflexive: {
        question:
          "Toby is doing your job in the extract - noticing his own reaction " +
          "and reporting it. Did that make you trust him more than the others? " +
          "Articulate participants are easier to quote and easier to " +
          "over-weight.",
        options: [
          {
            label: "I found this the most useful extract",
            note:
              "Probably because it is the most explicit. Explicitness is not " +
              "importance, and the analysis should not end up built on " +
              "whoever spoke most like an analyst."
          },
          {
            label: "I read his age or work history as making him more reliable",
            note:
              "A judgement about credibility that the method does not license. " +
              "It also risks treating the first years' accounts as immature " +
              "versions of his."
          },
          {
            label: "I used him to explain the other five",
            note:
              "Tempting, and it makes one participant the interpreter of " +
              "everyone else. If you do it, say you did it - it is a defensible " +
              "analytic move and an invisible one is not."
          },
          {
            label: "I noticed he says he still asks, and coded that",
            note:
              "Good. It is the detail most likely to be dropped, because it " +
              "does not fit a story about a norm that prevents asking."
          }
        ]
      }
    }
  ];

  /* =======================================================================
     Small DOM helpers
     ===================================================================== */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#coding");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var ownCode = $("#own-code");
  var ownLevel = $("#own-level");
  var codeBank = $("[data-code-bank]");
  var extractLabel = $("[data-extract-label]");
  var extractText = $("[data-extract-text]");
  var extractSpeaker = $("[data-extract-speaker]");
  var ownEcho = $("[data-own-echo]");
  var compareFeedback = $("[data-compare-feedback]");
  var bankNotes = $("[data-bank-notes]");
  var bankBody = $("[data-bank-body]");
  var passes = $("[data-passes]");
  var passesBody = $("[data-passes-body]");
  var reflexive = $("[data-reflexive]");
  var reflexiveQuestion = $("[data-reflexive-question]");
  var reflexiveForm = $("[data-reflexive-form]");
  var reflexiveOptions = $("[data-reflexive-options]");
  var reflexiveFeedback = $("[data-reflexive-feedback]");
  var stageTrack = $("[data-stage-track]");

  var compareButton = $('[data-action="compare"]');
  var nextButton = $('[data-action="next"]');

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var index = 0;
  var visited = [];

  function current() { return EXTRACTS[index]; }

  /* --- The pinned echo ----------------------------------------------------- */

  function renderEcho() {
    var text = ownCode.value.trim();
    if (!text) {
      ownEcho.setAttribute("data-empty", "yes");
      ownEcho.textContent =
        "Your code will appear here as you type it. Nothing is stored.";
      return;
    }
    ownEcho.setAttribute("data-empty", "no");
    var level = ownLevel.value;
    ownEcho.textContent = "Your code: “" + text + "”" +
      (level ? " — you called this " + LEVEL_WORD[level].toLowerCase() + "." : "");
  }

  ownCode.addEventListener("input", renderEcho);
  ownLevel.addEventListener("change", renderEcho);

  /* --- Code bank ------------------------------------------------------------ */

  function buildBank() {
    clear(codeBank);
    current().bank.forEach(function (code) {
      var label = make("label", "codebank");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = "bank";
      input.value = code.id;
      label.appendChild(input);
      var text = make("span", "codebank__text");
      text.appendChild(make("span", "codebank__level", LEVEL_WORD[code.level]));
      text.appendChild(document.createTextNode(code.label));
      label.appendChild(text);
      codeBank.appendChild(label);
      input.addEventListener("change", function () {
        renderBankNotes();
        shell.announce((input.checked ? "Added " : "Removed ") +
          "the code “" + code.label + "”. It is neither right nor wrong; the " +
          "note beside it says what it does.");
      });
    });
  }

  function renderBankNotes() {
    var chosen = $$('input[name="bank"]:checked', codeBank)
      .map(function (b) { return b.value; });
    clear(bankBody);
    if (!chosen.length) {
      bankNotes.hidden = true;
      return;
    }
    bankNotes.hidden = false;
    current().bank.filter(function (code) {
      return chosen.indexOf(code.id) !== -1;
    }).forEach(function (code) {
      var block = make("div", "banknote");
      block.appendChild(make("p", "banknote__name",
        code.label + " (" + LEVEL_WORD[code.level].toLowerCase() + ")"));
      block.appendChild(make("p", "banknote__body", code.note));
      bankBody.appendChild(block);
    });
  }

  /* --- Stage track ---------------------------------------------------------- */

  function renderTrack() {
    clear(stageTrack);
    EXTRACTS.forEach(function (item, i) {
      var li = make("li");
      li.appendChild(make("span", null, String(i + 1) + "."));
      li.appendChild(document.createTextNode(" " + item.short));
      if (visited[i]) {
        li.setAttribute("data-state", "done");
        li.appendChild(make("span", "visually-hidden", " (compared)"));
      }
      if (i === index) {
        li.setAttribute("aria-current", "step");
        li.appendChild(make("span", "visually-hidden", " (current)"));
      }
      stageTrack.appendChild(li);
    });
  }

  /* --- Showing an extract ---------------------------------------------------- */

  function showExtract(i) {
    index = i;
    extractLabel.textContent = "Extract " + (i + 1) + " of " + EXTRACTS.length;
    extractText.textContent = "“" + current().text + "”";
    extractSpeaker.textContent = current().speaker;
    ownCode.value = "";
    ownLevel.value = "";
    renderEcho();
    buildBank();
    bankNotes.hidden = true;
    compareFeedback.hidden = true;
    passes.hidden = true;
    reflexive.hidden = true;
    reflexiveFeedback.hidden = true;
    reflexiveForm.reset();
    buildReflexive();
    nextButton.textContent =
      i === EXTRACTS.length - 1 ? "Back to extract 1" : "Next extract";
    renderTrack();
  }

  /* --- Reflexive prompt ------------------------------------------------------- */

  function buildReflexive() {
    reflexiveQuestion.textContent = current().reflexive.question;
    clear(reflexiveOptions);
    current().reflexive.options.forEach(function (option, i) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = "reflexive";
      input.value = String(i);
      label.appendChild(input);
      label.appendChild(document.createTextNode(option.label));
      reflexiveOptions.appendChild(label);
    });
  }

  reflexiveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="reflexive"]:checked', reflexiveForm)
      .map(function (b) { return Number(b.value); });
    clear(reflexiveFeedback);
    reflexiveFeedback.setAttribute("data-tone", "neutral");
    if (!chosen.length) {
      reflexiveFeedback.appendChild(make("p", null,
        "Nothing ticked. That is a legitimate answer and it is worth being " +
        "suspicious of: the assumptions that matter most are the ones that do " +
        "not feel like assumptions. Every note is below in any case."));
      chosen = current().reflexive.options.map(function (_, i) { return i; });
    } else {
      reflexiveFeedback.appendChild(make("p", null,
        "None of this is scored, stored or compared with anyone. The notes " +
        "below say what each position tends to make visible and what it tends " +
        "to hide."));
    }
    var list = make("ul");
    chosen.forEach(function (i) {
      var option = current().reflexive.options[i];
      var li = make("li");
      li.appendChild(make("strong", null, option.label + " — "));
      li.appendChild(document.createTextNode(option.note));
      list.appendChild(li);
    });
    reflexiveFeedback.appendChild(list);
    reflexiveFeedback.hidden = false;
    shell.announce("Reflexive notes shown.", { immediate: true });
  });

  /* --- Comparing --------------------------------------------------------------- */

  function compare() {
    var own = ownCode.value.trim();
    clear(compareFeedback);
    compareFeedback.hidden = false;
    compareFeedback.setAttribute("data-tone", "neutral");

    var lead = make("p");
    if (own) {
      lead.appendChild(make("strong", "feedback__verdict",
        "Your code: “" + own + "”. "));
      lead.appendChild(document.createTextNode(
        ownLevel.value
          ? "You called it " + LEVEL_WORD[ownLevel.value].toLowerCase() +
            ". Hold that beside the three passes below and see which one it " +
            "sits closest to — and whether you still agree with your own " +
            "classification after reading them."
          : "You have not said whether you would call it semantic or latent. " +
            "Decide now, before reading the passes below, and notice how much " +
            "harder that is than it sounds."));
    } else {
      lead.appendChild(make("strong", "feedback__verdict",
        "No code of your own yet. "));
      lead.appendChild(document.createTextNode(
        "The comparison is more useful if you commit to something first, even " +
        "a bad one. The three passes are below regardless."));
    }
    compareFeedback.appendChild(lead);

    var closing = make("p");
    closing.textContent =
      "None of these three is the answer. Each is a defensible reading of the " +
      "same words from a different position, and each one buys its visibility " +
      "somewhere by losing it somewhere else.";
    compareFeedback.appendChild(closing);

    clear(passesBody);
    current().passes.forEach(function (pass) {
      var block = make("div", "pass");
      block.setAttribute("data-level", pass.level);
      block.appendChild(make("h5", "pass__name",
        LEVEL_WORD[pass.level] + " — " + pass.name));
      var list = make("ul", "pass__codes");
      pass.codes.forEach(function (code) {
        list.appendChild(make("li", null, code));
      });
      block.appendChild(list);
      var fore = make("p", "pass__note");
      fore.appendChild(make("strong", null, "Brings forward: "));
      fore.appendChild(document.createTextNode(pass.fore));
      block.appendChild(fore);
      var back = make("p", "pass__note");
      back.appendChild(make("strong", null, "Puts in the background: "));
      back.appendChild(document.createTextNode(pass.back));
      block.appendChild(back);
      passesBody.appendChild(block);
    });

    passes.hidden = false;
    reflexive.hidden = false;
    visited[index] = true;
    renderTrack();
    shell.announce(
      "Three coding passes shown for extract " + (index + 1) +
      ", followed by a reflexive prompt. None of them is marked correct.",
      { immediate: true });
  }

  compareButton.addEventListener("click", compare);

  nextButton.addEventListener("click", function () {
    showExtract((index + 1) % EXTRACTS.length);
    shell.announce("Extract " + (index + 1) + " of " + EXTRACTS.length + ", " +
      current().short + ".", { immediate: true });
  });

  /* --- Opening prediction --------------------------------------------------------- */

  var OPENING = {
    unreliable: {
      tone: "caution",
      verdict: "That is the right move for a different method.",
      text:
        "Agreeing a scheme and recoding to consensus is exactly right in " +
        "content analysis or coding reliability studies, where the codes are " +
        "meant to be applied consistently by anyone. Reflexive thematic " +
        "analysis makes the opposite bet: the analyst's engagement is the " +
        "instrument, so pressing two analysts towards agreement removes the " +
        "thing the method relies on."
    },
    wrong: {
      tone: "caution",
      verdict: "Possible, and it is not what difference by itself shows.",
      text:
        "A code can certainly be indefensible - unsupported by the extract, " +
        "internally incoherent, or a theoretical label smuggled in as a " +
        "description, and you will meet all three in the code banks below. But " +
        "two readings can both be traceable to the same words and still differ, " +
        "because they were made from different positions and for different " +
        "questions."
    },
    expected: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Difference is the expected case. What a reader is owed is not " +
        "agreement but a reading that can be traced to the data, hangs " +
        "together, and states the position it was written from. That is a " +
        "harder standard than agreement, not a softer one."
    },
    anything: {
      tone: "warn",
      verdict: "This is the misreading worth catching early.",
      text:
        "Rejecting agreement as the criterion is not the same as having no " +
        "criterion. Several code banks below contain labels that would not " +
        "survive scrutiny - a judgement dressed as a description, a " +
        "theoretical construct imported wholesale, a category that files the " +
        "extract without saying anything about it. Interpretation is " +
        "accountable to the data even when it is not reducible to it."
    }
  };

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openLab() {
    labSection.hidden = false;
    showExtract(0);
    $("#lab-heading").focus();
    shell.announce("Laboratory unlocked. Extract 1 of " + EXTRACTS.length + ".",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openLab();
  });

  /* --- Challenge -------------------------------------------------------------------- */

  var CHALLENGE_NOTES = {
    identity: {
      usable: true,
      text:
        "A code. It says what is going on in analytic language, it can be " +
        "traced to 'a version of me they've got in their heads', and another " +
        "analyst could argue with it."
    },
    stigma: {
      usable: true,
      text:
        "A code, and a more interpretive one. It reads 'the student who's " +
        "always struggling' as a category with a cost attached. Defensible, " +
        "and it owes the reader an argument - which is a normal thing for a " +
        "latent code to owe."
    },
    anxiety: {
      usable: false,
      text:
        "Not a code but a diagnosis. Self-efficacy is a construct with a " +
        "literature, a measure and an implied cause, and none of it is in " +
        "these two sentences: Kwame says he cares what staff think, not that " +
        "he doubts he can do the work. Labels like this feel like progress " +
        "because they sound technical, and they close the analysis rather than " +
        "opening it."
    },
    topic: {
      usable: false,
      text:
        "Not a code but a filing category. 'Feelings' tells you which drawer " +
        "the extract went in and nothing about what was noticed. A codebook " +
        "made of these becomes a filing system that cannot generate a theme."
    },
    quote: {
      usable: true,
      text:
        "An in-vivo code, and a good one. Using the participant's own phrase " +
        "keeps the analyst's vocabulary out of the way for a moment. It cannot " +
        "be the whole codebook - phrases do not travel between extracts - but " +
        "as a code it is entirely legitimate."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one label.",
        "Three of the five would work as codes at this stage.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) { return !CHALLENGE_NOTES[v].usable; });
    var rightMissed = Object.keys(CHALLENGE_NOTES).filter(function (v) {
      return CHALLENGE_NOTES[v].usable && chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "caution" : rightMissed.length ? "caution" : "good";
    var verdictText = wrongPicked.length
      ? "At least one of these is doing something other than coding."
      : rightMissed.length
        ? "Everything you accepted would work; there is more that would."
        : "Yes — the three that are codes, and neither the diagnosis nor the filing category.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " This is a judgement about what a code is for, not about whether a " +
      "particular reading of Kwame is right."));
    challengeFeedback.appendChild(lead);
    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var li = make("li");
      li.appendChild(make("strong", null,
        chosen.indexOf(value) !== -1
          ? "You accepted this. " : "You did not accept this. "));
      li.appendChild(document.createTextNode(CHALLENGE_NOTES[value].text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(verdictText, { immediate: true });
  });

  /* --- Reset ------------------------------------------------------------------------- */

  shell.onReset(function () {
    visited = [];
    index = 0;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    showExtract(0);
  });

  /* --- Start-up ---------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the laboratory.",
    { immediate: true });
})();
