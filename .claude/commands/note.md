# Development Progress Note

ARGUMENTS: Progress description (required)

READ current session from `.claude/sessions/.current-session`.

APPEND to active session file under "## Progress Log":
```
### Progress Update - $(date +%H:%M)
$ARGUMENTS

#### Current Status
[Brief analysis of current development state]

#### Files Modified Since Last Update
[Run: git diff --name-only]

#### Key Decisions Made
[Important architectural or implementation decisions]

#### Next Immediate Steps
[What needs to be done next in this session]
```

ANALYZE current git state:
- Show unstaged changes if any
- Note any new files created
- Check for any errors or warnings

CONFIRM progress has been logged to active session.
