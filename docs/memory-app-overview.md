# Memory — How the App Works

A mid-level overview of Memory's design: what each system does, why it exists, and what the user sees. For full detail and rationale, see `memory-design-spec.md`.

---

## The core idea

Memory is a personal memory aid, designed for someone with ADHD. They need to keep track of a lot: tasks, intentions, facts about people and upcoming events.

The problem it solves is that a normal to-do list or calendar becomes overwhelming. The more you need to remember, the more useless a flat list gets. So Memory splits things into two views:

- **The bubble map ("Now")**: a small, curated view of *what matters right now*. It's like the bestseller table at the front of a bookstore.
- **The browse view**: the full shelves, with everything organized by theme.

The whole app runs on two actions:
1. **Capture**: getting things in with almost no effort.
2. **Surfacing**: showing the right things at the right time.

---

## 1. Capturing things (Smart Capture)

**What the user does:** types anything into a single text box. For example:
> "call the dentist, Sarah's allergic to nuts, and her visit is Saturday"

No forms, no fields, no picking categories.

**What happens behind the scenes:**
1. **The raw text is saved first, always.** Nothing is ever lost, even if the AI misreads it.
2. An AI pass **splits the input by intent**. The example above becomes three items: a task, a fact and an event. "Buy milk, eggs, bread" stays as *one* item, because it's one action. When it isn't sure, it splits, since fusing two things together is the worse mistake.
3. Each item is **classified** and its details are worked out (see "Item types" below): dates, how firm a deadline is, whether it's optional, how much effort it takes and how important it seems.
4. Each item is **filed under one or more themes** (e.g. Home, Relationships).
5. Items show up **immediately** in a "Captured Today" area.

**What the user sees:** usually nothing extra. The item just appears. The app only nudges the user to take a look when:
- one input was split into several items,
- the AI wasn't confident, or
- it decided this was something already captured (see next section).

Any AI decision can be edited or rejected item by item. Reviewing is never required.

**Works without AI:** if no AI is configured, a simpler built-in parser handles captures, so the app still works.

---

## 2. Capturing something twice (Recapture-as-boost)

If the user enters something that's already in the app, Memory **doesn't create a duplicate**. Instead it:
- **raises that item's priority**, and
- **adds the new wording** to the item. The original text is never rewritten.

**What the user sees:** a small toast message: *"Bumped 'Sarah's soy milk' — Undo"*. Undo fully reverses it and turns the new text into a separate item.

**Why it matters:** the things you keep thinking about rise to the top on their own. Repeating something *is* the signal that it matters. The app is cautious here: if it's unsure two things are the same, it creates a new item rather than wrongly merging them.

Priority boosts **fade slowly** over time (roughly a three-week half-life), so priority reflects what's been on your mind *lately*. If the user sets a priority by hand, that always wins.

---

## 3. Item types and "flavours"

Internally, every item is one of three types, based on how it behaves over time:

| Internal type | Meaning | Example |
|---|---|---|
| **DO** | Something you do; it can be finished | "clean the house", "read 30 min/day" |
| **KNOW** | Something that's simply true; never "done" | "Sarah is allergic to nuts" |
| **HAPPEN** | Something that occurs at a time, then is past | "doctor Tuesday 3pm" |

The user **never sees these types**. They see friendlier labels called **flavours**, which the app works out from the item's details:

- **Note**: a KNOW
- **Event**: a HAPPEN
- **Reminder**: a quick nudge to do a small thing ("remind me to take the bins out")
- **Task**: something with a firm deadline, or a general to-do
- **Goal**: a recurring habit without a firm deadline ("exercise 3x a week")

The user can relabel an item's flavour. That only changes the label, not how the item behaves. To change behaviour, they edit the deadline or priority directly.

Each item also tracks things like:
- whether a deadline is **firm or soft**,
- whether it's **must-do or nice-to-do**,
- **effort** (quick / medium / large),
- **recurrence**,
- **emotional tone** tags taken from how it was phrased.

---

## 4. Themes (the filing system)

Themes are the shelves of the browse view, like Home, Health or Work.

- **Nobody sets them up in advance.** The AI acts as a "librarian": it creates, merges and renames themes as captures come in. Early on it's messy, and it settles down over time.
- An item can be in **several themes** at once.
- When the librarian reorganizes, it leaves a one-line note explaining why (e.g. "merged Errands into Home").
- The user can change an item's themes at any time.

---

## 5. The bubble map ("Now" view) and the Brain

This is the main screen and what makes the app different.

**What the user sees:** a map of bubbles.
- Each bubble is a **situation**, such as "Before Sarah visits", "Morning routine" or "At the computer". It is not a category.
- **Bubble size** shows how pressing it is.
- **Bubble colour** shows the theme.
- Each bubble shows a short summary sentence, with tappable chips for the items inside it. Some bubbles also suggest a first small step to get started.
- Tapping a bubble opens it, and the user can complete items from there.

**How it's built:** an AI process called **the Brain** rebuilds the whole map **once per day**. It runs at 5am local time, so the map is ready when the user first opens the app. If that scheduled run was missed, the map is built when the user first opens the app; the rest of the app stays usable while it builds.

The Brain:
- **Groups items by situation, not by theme.** One bubble can mix a chore, a fact about a person and an errand, as long as they belong to the same moment.
- **Ranks items** by urgency (how close the deadline is), importance (priority), effort (big jobs show up earlier because they need more lead time) and how likely they are to be forgotten.
- **Gives everything important a spot**, even if only a small one. A visitor four weeks away appears as a small dot; overdue taxes appear as a big bubble.
- **Starts fresh every day.** Yesterday's bubbles are only offered as "reuse if still relevant", so the map never goes stale. It does reuse yesterday's bubble *names* when they still fit, so the map feels familiar.
- **Keeps facts fresh in your mind.** KNOW items have no deadline, so they would never surface on urgency alone. The Brain shows them in two ways:
  - when a related event is coming up (Sarah's allergy before Sarah's visit), or
  - by quietly rotating a few into view now and then, so they stay in your head.

**During the day, no AI runs.** Completing an item updates the map straight away. New captures sit in "Captured Today" and get folded into real bubbles the next morning.

**If the AI fails**, the app builds a simpler map using fixed rules. A persistent banner tells the user, with a one-tap retry.

v1 doesn't let the user pin or dismiss bubbles. That's on purpose, to see whether the Brain's choices are good on their own. Users *can* snooze an individual item ("hide this for a month") or close it out: done, dismissed, or missed (for an event).

---

## 6. Browse, Calendar and Search

Three steadier ways to look at the same items:

- **Browse:** every item, organized by theme and filterable by flavour. Answers "where does my X live?"
- **Calendar:** a month or week view of events, deadlines and recurring items. Frequent routines (like daily chores) are hidden by default so they don't clutter it; this can be changed per item.
- **Search:** finds things by exact words *and* by meaning. For example, "Sarah's food thing" finds "Sarah is allergic to nuts". It's not curated by AI, so it's a reliable way to find something you know is in there.

---

## 7. Notifications

Memory reaches the user in two ways:

- **The daily overview is in-app.** Opening the app and seeing the map *is* the daily brief. There's no digest notification.
- **Push notifications are only for things you'd miss without them:**
  - **Events:** about 45 minutes before (adjustable per event).
  - **Firm-deadline tasks:** a warning ahead of the deadline, earlier for bigger jobs (quick: 2 hours, medium: 1 day, large: 5 days).
  - **Recurring items:** one notification per occurrence.

These are worked out from dates by fixed rules (no AI), checked every 5 minutes. The rule is that **a notification always means "this, now"**, so the user never learns to ignore them.

---

## 8. The app's own memory (history and profile)

There are three layers. Anything that must be reliable never depends on the AI:

1. **Event log:** a permanent, never-edited record of every change (created, completed, edited, re-themed…). Corrections are added as new entries, so mistakes and their fixes both stay visible.
2. **Counters:** exact per-item numbers such as last completed, number of completions, streak and how often the item has been shown. "You haven't done X in two weeks" is calculated from these, not guessed by AI.
3. **User profile:** a short note the AI writes once a day, based on the last 30 days of activity. For example: "checks in mornings; tends to skip Health items; re-files errands under Home." Both the Brain and Smart Capture read it, so the app slowly adapts to how the user files and ranks things. It's guidance only; it never makes hard decisions.

---

## Design principles that run through everything

- **Never lose what the user typed.** Raw text is saved first, and their wording is never rewritten.
- **No friction at capture.** Mistakes are fixed by undoing them afterwards, not by asking for approval first.
- **Rule-based where it must be reliable; AI where it's choosing what to show.** Notifications, dates, search and counters follow fixed rules. The AI only decides what's worth showing and how to group it.
- **Be visible and reversible.** Merges show an Undo, failures show a banner, and theme changes leave a note.
- **Hold back on interruptions.** Pushing too much would make the user tune the app out.

## Setup notes

- Memory is **single-user**: one database holds one person's memory. It can be locked with a password.
- It's a **phone-installable web app** that runs on Cloudflare. Fuller features (pin/dismiss bubbles, an activity feed, smarter notification timing, Google Calendar sync) are deliberately postponed until there's real usage to learn from.
