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
- M5 — NOT STARTED
- M6 — NOT STARTED
- M7 — NOT STARTED
- M8 — NOT STARTED
- M9 — NOT STARTED
- M10 — NOT STARTED
