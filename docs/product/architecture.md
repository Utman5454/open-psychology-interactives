# Product architecture

Date: 2026-09-07. Status: proposed for M0, with the later layers sketched so
that M0 does not paint them out. Decision D-006 (content layer and product
layer are separate) is the premise.

---

## The two layers

```
content layer  (exists, MIT, static, portable)
  modules/**            75 original activities
  simplified/**         75 simplified twins
  data/catalogue*.json  the two indexes
  components/, assets/  the two shells
  docs/**, *.md         documentation and 150 teaching notes

product layer  (new, additive, also static in M0)
  library/              searchable library across both editions, per-activity pages
  lessons/              lesson builder (lecturer) and lesson player (student)
  data/lessons/         curated lessons as JSON (author-written)
  assets/product/       one stylesheet and the scripts the layer needs
```

The product layer reads the content layer through its catalogues and page
URLs. It never modifies an activity, never requires an activity to know it
exists, and never becomes a dependency of any activity. The only touch on the
content layer is an **embed mode** (below): a few lines in the two shared
site scripts that hide site chrome when a page is shown inside the product
layer, which is progressive enhancement and changes nothing for a page opened
on its own.

## Why M0 has no backend

Every capability in the owner's candidate workflow except "signs in" can be
delivered by static files plus the browser:

| Capability | M0 mechanism |
| --- | --- |
| Discover activities | one page that loads both catalogues and filters client-side |
| Read teaching notes | `teaching-notes.md` fetched and rendered client-side with a small Markdown renderer written for the project |
| Select and sequence | builder state in memory, autosaved as a draft to `localStorage` |
| Add instructions and questions | plain text fields in the builder, stored in the lesson object |
| Preview | the player rendering the current lesson object in place |
| Publish one link | the lesson object serialised, compressed with the browser's `CompressionStream`, base64url-encoded, placed in the URL fragment |
| Student completes | the player opens each activity in an embedded frame and asks the questions; answers stay in the browser and can be copied or downloaded |

A URL fragment is never sent to a server, so a lesson link is private by
construction: nothing about a lesson, a lecturer or a student touches any
infrastructure, and the site's privacy promise holds unchanged. A lesson with
three activities and a few hundred words of instructions compresses to about
one to two thousand characters, within the limits of every current browser,
Moodle, Canvas, Blackboard, Teams and email client. The builder shows the
link length and warns above a conservative threshold.

The cost of this design is that a lesson exists only as its link (and as the
lecturer's local draft). That is exactly the thing an account is later worth
paying for, which is the right place for the free/paid line.

## Lesson data model

Subject-neutral by construction: nothing in it names psychology. Activities
are referenced by catalogue coordinates, and everything else is text.

```json
{
  "schema": 1,
  "title": "Week 4: what a p-value is not",
  "intro": "Work through these before Thursday's seminar. Write your answers down; bring them.",
  "author": "",
  "steps": [
    { "type": "note",     "text": "First, commit to a prediction before you touch anything." },
    { "type": "activity", "edition": "simplified", "module": "research-methods",
                          "tool": "08-sampling-distribution-pvalue-simulator",
                          "instructions": "Run 1,000 studies at the defaults. Then raise n to 200 without moving anything else." },
    { "type": "question", "prompt": "The observed difference did not change. Why did p?", "kind": "long" },
    { "type": "activity", "edition": "original", "module": "research-methods",
                          "tool": "17-statistical-power-type-m-lab" },
    { "type": "question", "prompt": "In one sentence, what is p conditional on?", "kind": "short" }
  ]
}
```

Rules: `edition`, `module` and `tool` must resolve in the catalogues; the
player resolves them at load time and shows a clear message for a reference
it cannot find. Text fields are rendered as text, never as HTML. There is no
identifier for a person anywhere in the model. A future backend stores this
exact object; nothing in the link format has to change when accounts arrive.

## Embed mode

The player shows an activity inside an `<iframe>` pointing at its own page in
the same origin, with `?embed=1` on the URL. `assets/js/main.js` and
`simplified/assets/js/edition-nav.js` each gain a few lines: when the
parameter is present, add a class to `<html>`; one CSS rule per shell hides
the site header, breadcrumbs, footer, previous/next strip and lecturer export
controls. Nothing else changes. A page opened without the parameter is
byte-for-byte the page it was. Using the page rather than `standalone.html`
keeps element identifiers isolated per activity, lets scripts run normally,
and works for the Simplified Edition, which has no standalone export.

The frame is sized to its content by a `postMessage` from the embedded page
(also progressive enhancement: without it the frame has a generous fixed
minimum height and scrolls).

## Discovery

`library/index.html` loads both catalogues and renders one list with:
free-text search over title, summary, topics and learning objectives;
filters for module, edition, duration band, difficulty and interaction type;
a card per activity with a link to its page, its twin and its notes; and
"Add to lesson" when the builder is open. Static, client-side, no server.
Per-activity pages (`library/activity.html?edition=…&module=…&tool=…`)
render the metadata and the teaching notes and link to the activity. This
gives the notes a URL and gives search engines and lecturers something to
link to.

## Later layers (not M0)

```
M1  accounts and storage         lecturer signs in (email link, no password); lessons saved
                                 server-side; a share link is a short id, not a payload;
                                 duplication, versioning, departmental library
M2  assignment mode              optional, per lesson: completion marks and anonymous
                                 aggregate responses; requires a data-processing agreement
M3  integration and licensing    LTI 1.3, SSO, institutional licences, accessibility statement,
                                 support SLA; payments only here
M4  second subject library       a second content layer under the same catalogue schema
```

For M1 the least complex stack that is real: a small server with a relational
database and magic-link sign-in, deployed separately from the static site,
with the static site continuing to be the free layer. The lesson JSON above is
the storage schema. A framework choice is deferred until M1 is scoped; nothing
in M0 constrains it.

## Deployment

M0 deploys exactly as the site does today: files on `main`, GitHub Pages.
The product layer lives under `library/`, `lessons/`, `data/lessons/` and
`assets/product/` so that a fork of the open collection can delete four
folders and lose nothing. The `check-all.py` gates, the browser smoke test
(extended to the new pages) and a new lesson-schema validation gate run
before every checkpoint.

## Data boundaries and privacy

In M0: no data leaves the browser. Drafts are in `localStorage` on the
lecturer's machine and can be cleared from the builder. Student answers are
in memory and, if the student chooses, in a downloaded or copied text file.
The player says so on screen. No analytics.

## What this rules out

- Rewriting activities into the product layer's technology.
- Any product feature that requires an activity page to change beyond the
  embed-mode class.
- Storing anything about a student before M2, and then only opt-in and
  anonymous by default.
