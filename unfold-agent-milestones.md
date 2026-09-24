# Unfold — Low-Credit Agent Milestones

## Goal

Finish the existing Unfold project with the **minimum possible agent usage**.

Keep the existing Supabase integration available for later. For the current demo/testing flow, use **local development seed accounts** so the app can be tested without Supabase credentials.

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
* Keep the existing Supabase integration available for later.
* Do **not** remove or replace existing Supabase code unnecessarily.
* Do **not** hard-code real credentials, API keys, or secrets.
* Seed accounts must be clearly limited to local/demo development.
* Do **not** create an authentication bypass for production.
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

## M1 — Local Demo Seed Accounts

**Files:** `app.js`, `supabase.js`, `index.html` only if required.

Add a **development/demo-only local authentication path** with two deterministic seed accounts.

Requirements:

* Account A for normal testing.
* Account B for user-isolation testing.
* Login must work without Supabase.
* Logout must work.
* Demo session must survive page refresh.
* Demo account identity must be available to the existing application.
* Keep the existing Supabase authentication code intact for later use.
* Do not remove Supabase dependencies or configuration.
* Do not add a production authentication bypass.
* Do not expose real credentials or secrets.
* Keep the implementation minimal.

Use clearly marked demo credentials/configuration appropriate for local development only.

### Manual test

Test Account A:

```text
Login
→ Refresh
→ Verify still logged in
→ Logout
```

Test Account B:

```text
Login
→ Verify Account B is a separate user
→ Logout
```

Verify:

* Both accounts can enter the application.
* Sessions survive refresh.
* Logout works.
* Account identity changes correctly.

**Done:** Both local demo accounts can reliably authenticate without Supabase, while the existing Supabase integration remains available.

---

## M2 — Auth

**Files:** `app.js`, `supabase.js`, `index.html` only if required.

Fix the existing authentication UI/session behavior so it works correctly with the current demo authentication path.

Fix only:

* Sign in
* Sign out
* Session restoration
* Auth overlay
* User/account display
* Auth error handling

Do not redesign authentication.

### Manual test

Using Test Account A:

```text
Sign In
→ Home
→ Refresh
→ Sign Out
```

Verify:

* Sign in works.
* Auth overlay disappears.
* User/account display updates.
* Session survives refresh.
* Sign out returns to auth UI.
* Invalid credentials show an error.

**Done:** Test Account A completes the full local demo auth flow.

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

For the current demo, make journal functionality usable with the local demo accounts without removing the existing Supabase journal implementation.

Fix:

* Draft saving
* Journal insert/save
* Journal list
* Journal loading
* Current-user separation
* Save/load errors

Keep the existing Supabase journal path available for later integration.

Do not implement general cloud sync.

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

Then use Test Account B:

```text
Login as B
→ Open Journal
```

Verify Account A's entry is not visible to B.

**Done:** Both demo users have isolated journal data.

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

Ensure demo-user data remains separated and the existing Supabase journal queries remain restricted to the authenticated user when Supabase mode is used.

### Validation

Verify:

* User-provided journal/content text is rendered as text.
* Account A cannot see Account B's local journal data.
* Account B cannot see Account A's local journal data.
* Existing Supabase queries retain user filtering.

**Done:** User-provided content cannot become executable HTML and user data remains isolated.

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

Then test with **Test Account A**:

```text
Login
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
→ Logout
```

Then test isolation:

```text
Test Account A
→ Create journal entry
→ Logout

Test Account B
→ Login
→ Open Journal
→ Verify A's entry is not visible
```

### Final checks

* Build succeeds.
* Local demo authentication works.
* Session survives refresh.
* Check-in works.
* Journal works.
* User data is isolated.
* Trends work.
* Daily features work.
* Settings/themes work.
* Mobile navigation works.
* No critical console errors.
* Supabase integration remains available in the codebase.

**Done:** Build succeeds and the complete demo flow works without requiring live Supabase authentication.

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
> Keep existing Supabase integration intact unless the milestone explicitly requires changing it.
>
> Run the specified validation.
>
> Stop when the milestone is complete.
>
> Reply with only: `DONE/BLOCKED`, files changed, validation result, and any blocker.
