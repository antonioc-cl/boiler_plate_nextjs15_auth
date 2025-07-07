
# Clear Current Session Context

READ current session from `.claude/sessions/.current-session`.

IF active session exists:
WARN: "Active session detected. Session goal: [goal from file]"
CONFIRM: "This will clear current session context but preserve session file. Continue? (Sessions can be restored with /memory command)"

WRITE empty content to `.claude/sessions/.current-session`

CONFIRM: "Session context cleared. Session file preserved in sessions/ directory."
SUGGEST: "Use `/start [goal]` to begin new session or `/memory` to review previous sessions."