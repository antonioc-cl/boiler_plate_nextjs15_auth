# Project Status Check

RUN:

- `git branch --show-current`
- `git status --porcelain`
- `git log -1 --pretty=format:"%h - %s (%cr)"`
- `wc -l .claude/sessions/.current-session 2>/dev/null || echo 0`

Provide a concise status update including:

- Current branch and git state
- Number of uncommitted changes
- Last commit info
- Session notes count
- Any immediate issues that need attention

Keep it brief and actionable.
