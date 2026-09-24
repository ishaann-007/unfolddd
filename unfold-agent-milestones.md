# Unfold — Low-Credit Agent Milestones

## Goal

Finish the existing Unfold project with the **minimum possible agent usage**.

## Agent Rules

* Do **not** rewrite the project.
* Do **not** introduce React, TypeScript, frameworks, or unnecessary packages.
* Do **not** refactor working code.
* Only modify files required by the current milestone.
* Do not inspect unrelated files.
* Do not generate long explanations.
* After each milestone, run only the specified validation.
* If the requested functionality already works, do not change it.
* Fix errors directly instead of investigating unrelated code.

---

## M0 — Install + Build

**Files:** `package.json`, project config only if required.

Run:

```bash
npm install
npm run build
```

Fix only errors preventing the build.

**Done:** `npm run build` succeeds.

---

## M1 — Auth

**Files:** `app.js`, `supabase.js`, `index.html` only if required.

Fix:

* Sign up
* Sign in
* Sign out
* Session restoration
* Auth overlay
* Auth error handling

Do not change the Supabase architecture.

**Done:** Sign in/out works without console-breaking errors.

---

## M2 — Check-in

**Files:** `app.js` only unless HTML is missing something.

Fix:

* Mood selection
* Energy selection
* Distortion selection
* Save
* Completion state
* Local persistence
* Streak calculation

Use the existing `save()` / `load()` helpers.

**Done:** Check-in survives page refresh.

---

## M3 — Journal

**Files:** `app.js`, `supabase.js` only if required.

Fix:

* Draft saving
* Journal insert
* Journal list
* Journal loading
* Current-user filtering
* Save/load errors

Use the existing `journal_entries` table.

Do not implement cloud sync.

**Done:** Authenticated user can save, list, and reopen their own journal entries.

---

## M4 — Daily Features

**Files:** `app.js` only unless required.

Fix only broken behavior in:

* Breathwork
* Rituals
* Affirmations
* Daily reflection

Preserve existing UI and local storage.

**Done:** All four features work after refresh.

---

## M5 — Trends

**Files:** `app.js`, `style.css` only if required.

Fix:

* Mood chart
* Energy chart
* Distortion data
* Empty state
* Streak/trend calculations

Do not replace the chart system.

**Done:** Trends work with zero and multiple check-ins.

---

## M6 — Date Bug

**Files:** `app.js`.

Replace inconsistent UTC daily-date handling with one consistent **local-calendar-date** implementation.

Update only code that depends on the daily date.

Affected behavior:

* Check-ins
* Reflections
* Daily writing
* Streaks
* Journal dates where applicable

**Done:** After local midnight, the app uses the new local calendar date.

---

## M7 — Security Fix

**Files:** `app.js`.

Find user-controlled values rendered through `innerHTML`.

Replace unsafe rendering with:

* `textContent`
* DOM APIs
* or proper escaping

Do not rewrite unrelated rendering.

Ensure journal queries remain restricted to the authenticated user.

**Done:** User-provided journal/content text cannot become executable HTML.

---

## M8 — UI Fixes

**Files:** `style.css`, `index.html`, `app.js` only when necessary.

Fix only obvious:

* Broken buttons
* Mobile navigation issues
* Overflow
* Theme issues
* Broken layouts
* Missing empty/error states

Do not redesign.

**Done:** Main flow works on desktop and mobile.

---

## M9 — Final Test

Run:

```bash
npm run build
```

Then test only:

```text
Sign in
→ Home
→ Check-in
→ Journal
→ Trends
→ Breathwork
→ Ritual
→ Affirmations
→ Reflection
→ Settings
→ Refresh
→ Sign out
```

Fix only failures found in this flow.

**Done:** Build succeeds and the main demo flow works.

---

# Agent Prompt

Send **one milestone at a time**.

Use this format:

> Execute M[X] from `unfold-agent-milestones.md`.
>
> Only modify the files specified by that milestone.
> Do not refactor or inspect unrelated functionality.
> Make the smallest change necessary.
> Run the specified validation.
> Reply with only: `DONE`, files changed, and any blocking issue.
