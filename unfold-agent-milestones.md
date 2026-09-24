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
* Do **not** bypass, weaken, or fake authentication for testing.
* Do **not** hard-code test credentials into source code.
* Do **not** commit passwords, API secrets, or private credentials.
* Stop after completing the current milestone.

---

## M0 — Install + Build + Launch

**Files:** `package.json`, project config only if required.

Run:

```bash
npm install
npm run build
npm run dev
```

Fix only errors preventing the app from building or launching.

### Manual check

Open the Vite app and verify:

* Page loads.
* CSS loads.
* Auth UI appears.
* No fatal browser console errors.

**Done:** `npm run build` succeeds and the app opens.

---

## M1 — Test Accounts

**Files:** None unless Supabase configuration requires a documented setup change.

Set up **two dedicated Supabase test accounts** for manual testing.

Use the Supabase project/dashboard or another existing supported Supabase account-creation method.

Do **not**:

* Add automatic login.
* Add a test-auth bypass.
* Hard-code credentials.
* Commit passwords.
* Modify production authentication behavior.

Use:

* **Test Account A** for normal feature testing.
* **Test Account B** for user-data isolation testing.

### Manual check

Verify both accounts can authenticate through the existing application.

If account creation is blocked by Supabase email confirmation or project configuration, report the exact blocker.

**Done:** Two dedicated test accounts are available, or a specific Supabase configuration blocker is identified.

---

## M2 — Auth

**Files:** `app.js`, `supabase.js`, `index.html` only if required.

Fix:

* Sign up
* Sign in
* Sign out
* Session restoration
* Auth overlay
* Auth error handling

Do not change the Supabase architecture.

### Manual test

Using Test Account A:

```text
Sign In
→ Refresh
→ Sign Out
```

Verify:

* Sign in works.
* Auth overlay disappears after login.
* User/account display updates.
* Session survives refresh.
* Sign out returns to the auth UI.
* Invalid credentials produce an appropriate error.

**Done:** Test Account A can complete the authentication flow.

---

## M3 — Check-in

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

### Manual test

After signing in:

```text
Check-in
→ Select mood
→ Select energy
→ Select distortion
→ Save
→ Refresh
```

Verify:

* Check-in saves.
* Completion state appears.
* Data survives refresh.
* Streak updates correctly.

**Done:** Check-in survives page refresh.

---

## M4 — Journal

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

### Manual test

Using Test Account A:

```text
Journal
→ Write entry
→ Save
→ View history
→ Open saved entry
→ Refresh
```

Verify:

* Entry saves.
* Entry appears in history.
* Entry can be reopened.
* Entry survives refresh.

Then use Test Account B and verify:

* Account B cannot see Account A's journal entry.

**Done:** Authenticated users can save, list, and reopen their own journal entries without cross-user access.

---

## M5 — Daily Features

**Files:** `app.js` only unless required.

Fix only broken behavior in:

* Breathwork
* Rituals
* Affirmations
* Daily reflection

Preserve existing UI and local storage.

### Manual test

**Breathwork**

* Start works.
* Timer/phases progress.
* Stop works.

**Rituals**

* Steps render.
* Toggle works.
* Progress updates.
* Changes survive refresh.

**Affirmations**

* Affirmation renders.
* Save works.
* Saved list works.
* Unsave works.
* Changes survive refresh.

**Reflection**

* Prompt appears.
* Writing saves.
* Writing survives refresh.

**Done:** All four features work after refresh.

---

## M6 — Trends

**Files:** `app.js`, `style.css` only if required.

Fix:

* Mood chart
* Energy chart
* Distortion data
* Empty state
* Streak/trend calculations

Do not replace the chart system.

### Manual test

Use the check-ins created during M3.

Verify:

* Trends page opens.
* Chart renders.
* Check-in data appears.
* Distortion data appears.
* Empty state works when no data exists.

**Done:** Trends work with zero and multiple check-ins.

---

## M7 — Date Bug

**Files:** `app.js`.

Replace inconsistent UTC daily-date handling with one consistent **local-calendar-date** implementation.

Update only code that depends on the daily date.

Affected behavior:

* Check-ins
* Reflections
* Daily writing
* Streaks
* Journal dates where applicable

### Manual check

Verify the app's daily date matches the computer's local calendar date.

Do not change unrelated date/time behavior.

**Done:** Daily features use the user's local calendar date consistently.

---

## M8 — Security Fix

**Files:** `app.js`.

Find user-controlled values rendered through `innerHTML`.

Replace unsafe rendering with:

* `textContent`
* DOM APIs
* or proper escaping

Do not rewrite unrelated rendering.

Ensure journal queries remain restricted to the authenticated user.

### Validation

Verify:

* User-provided journal/content text is rendered as text.
* Journal queries use the authenticated user.
* Test Account B cannot access Test Account A's journal entries.

**Done:** User-provided journal/content text cannot become executable HTML and journal data remains user-isolated.

---

## M9 — UI Fixes

**Files:** `style.css`, `index.html`, `app.js` only when necessary.

Fix only obvious:

* Broken buttons
* Mobile navigation issues
* Overflow
* Theme issues
* Broken layouts
* Missing empty/error states

Do not redesign.

### Manual test

Check the main flow at:

* Desktop viewport
* Mobile viewport

Verify navigation, themes, buttons, and page layout.

**Done:** Main flow works on desktop and mobile.

---

## M10 — Final Test

Run:

```bash
npm run build
```

Then test:

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

Use Test Account A for the main flow.

Also verify:

```text
Test Account A
→ Create journal entry

Test Account B
→ Sign in
→ Verify A's entry is not visible
```

### Final checks

* Build succeeds.
* Authentication works.
* Session survives refresh.
* Check-in works.
* Journal works.
* Journal isolation works.
* Trends work.
* Daily features work.
* Settings/themes work.
* Mobile navigation works.
* No critical console errors.

**Done:** Build succeeds and the main demo flow works.

---

# Agent Prompt

Send **one milestone at a time**.

Use this format:

> Execute M[X] from `unfold-agent-milestones.md`.
>
> Only modify the files specified by that milestone.
>
> Do not refactor or inspect unrelated functionality.
>
> Make the smallest change necessary.
>
> Run the specified validation.
>
> Stop when the milestone is complete.
>
> Reply with only: `DONE/BLOCKED`, files changed, validation result, and any blocker.
