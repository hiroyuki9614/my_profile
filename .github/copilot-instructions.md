# Copilot repository instructions

- This repository is an Astro site. Preserve the existing architecture and keep changes focused on the assigned issue.
- For any Git write workflow, branch/commit/push/PR handling, or conflict resolution, read and follow `.agents/skills/git-safe-operations/SKILL.md` before making Git mutations.
- Never use force push, history rewrite, destructive reset/clean, or silent stash operations.
- Preserve unrelated pre-existing changes and do not mix them into the task.
- Before proposing completion, inspect the task diff and run the repository's relevant verification. For SEO/build changes, prefer `npm run verify:build`; also run `npm run build` when relevant.
- Do not invent missing external credentials, DNS settings, Search Console data, production behavior, or network results. If an external request is blocked by the Copilot firewall, report the blocked URL and leave that measurement explicitly unverified.
- One assigned issue should produce one focused pull request. Do not opportunistically fix unrelated issues.
