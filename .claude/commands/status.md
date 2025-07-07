# Development Session Status

READ current session from `.claude/sessions/.current-session`.

IF no active session:
```
## No Active Session
No development session currently active.

**Start a new session with:** `/start [your goal description]`

**View previous sessions with:** `/memory`
```

IF active session exists:
READ session file and DISPLAY:
```
## Active Development Session

**Goal**: [session goal from file]
**Started**: [start time] ([duration so far])
**Session File**: [filename]

### Recent Progress
[Show last 2-3 progress updates from session file]

### Current Git State
[Run: git status --porcelain]

### Modified Files This Session
[Run: find . -newer [session file] -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json"]

### Next Steps
Use `/note [description]` to log progress or `/end` to finalize session
```
