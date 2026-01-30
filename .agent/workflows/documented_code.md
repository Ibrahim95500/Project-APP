---
description: Update the project backlog (task.md) and documentation based on recent code changes and project status.
---

1. **Analyze Current State**
   - Read `task.md` to identify the current plan.
   - Read `walkthrough.md` to see recently completed features.
   - Run `git status` or `git log -n 5` to see the latest changes.

2. **Identify Gaps & New Tasks**
   - Scan the codebase for `TODO`, `FIXME`, or `NOTE` comments that should be tracked.
   - Identify implicit tasks (e.g., if a feature was added but lacks tests, add a "Test" task).
   - Check for missing documentation updates (README, API docs).

3. **Update Backlog (`task.md`)**
   - Mark completed tasks as `[x]`.
   - Add new tasks found in step 2 to the appropriate phase or a new "Backlog" section.
   - Re-prioritize tasks if necessary based on the current context.

4. **Update Documentation**
   - If architectural changes occurred, update `README.md` or `implementation_plan.md`.
   - Ensure `walkthrough.md` accurately reflects the latest deliverable state.

5. **Report**
   - Summarize the updates made to the backlog and documentation for the user.
