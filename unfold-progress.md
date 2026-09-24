# Unfold Progress Tracker

Project: Unfold
Overall goal: complete the existing project with minimal unnecessary changes

## Milestones

- M0 — DONE
  - Installed dependencies and validated the project builds successfully.
- M1 — DONE
  - Added a local demo-auth path with deterministic demo accounts while preserving the existing Supabase auth integration.
- M2 — DONE
  - Normalized demo auth to an explicit session state and validated auth flow consistency (sign in, sign out, session restore, overlay, user display, invalid credentials).
- M3 — DONE
  - Verified the check-in flow already exists and persists check-in data; build passes without requiring code changes.
- M4 — DONE
  - Added demo-only local journal persistence keyed by the active demo user, kept the Supabase journal path intact for real users, and validated that demo A and demo B stay isolated without writing to the real Supabase table.
- M5 — DONE
  - Validated the existing Breathwork, Rituals, Affirmations, and Reflection implementations and confirmed the project still builds successfully without any required code changes.
- M6 — DONE
  - Validated the existing Trends implementation: 14-day mood/energy chart, totals and averages, best-day calculation, distortion frequency bars, empty state handling, and check-in-derived trend data all exist and the project still builds successfully.
- M7 — DONE
  - Replaced UTC-based daily date keys with a single local-calendar-date helper for check-ins, streaks, reflection daily keys, daily writing, and 14-day trend grouping; validated with a successful build and targeted date checks.
- M8 — DONE
  - Replaced unsafe innerHTML interpolation for user-controlled journal, ritual, and saved affirmation content with DOM/textContent rendering, and validated the build plus a focused security check proving user text is treated as plain text while demo A/B isolation and Supabase user filtering remain intact.
- M9 — DONE
  - Added the missing mobile bottom-nav items for Ritual and Trends using the existing navigateTo() data-page flow, and validated the build plus a focused check confirming the mobile navigation entries are present and the app still compiles cleanly.
- M10 — NOT STARTED
