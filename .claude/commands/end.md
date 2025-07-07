# Finalize Development Session

READ current session file from `.claude/sessions/.current-session`.

IF no active session:
DISPLAY: "No active session to end. Use `/start [goal]` to begin a session."
EXIT.

ANALYZE complete session work:
- Calculate session duration from start time
- Run `git log --oneline --since="[session start time]"` for commits
- Run `git status` for current state
- Identify all files modified during session
- Check if session goal was achieved

APPEND comprehensive summary to session file:
```markdown
## Session Completion Summary

### Duration & Timing
- Started: [from session file]
- Ended: $(date +%H:%M)
- Total Duration: [calculated duration]

### Goal Achievement
**Original Goal**: [session goal]
**Status**: [Completed/Partially Completed/Blocked]
**Achievement Details**: [specific accomplishments toward goal]

### Changes Made
#### Files Modified
[Git analysis of changed files with brief description of changes]

#### Files Added
[List new files created during session]

#### Files Deleted
[List any files removed]

#### Key Code Changes
[Summarize major modifications, new features, refactors]

### Git Activity
#### Commits Made This Session
[Git log output with descriptions]

#### Current Repository State
- Staged changes: [git status analysis]
- Unstaged changes: [analysis]
- Untracked files: [analysis]

### Development Progress
#### Tasks Completed
[List major accomplishments from session]

#### Features Implemented
[New functionality added]

#### Bugs Fixed
[Issues resolved]

### Problems Encountered & Solutions
**[CRITICAL LEARNING SECTION]**
[Document specific errors, compatibility issues, dependency conflicts]
[Include exact error messages and step-by-step solutions]
[Note any gotchas or unexpected behaviors discovered]

### Technical Learnings
[Important insights about the codebase, framework, or tools]
[Best practices discovered or confirmed]
[Architecture decisions made and reasoning]

### Next Session Recommendations
#### Immediate Next Steps
[What should be tackled in the next session]

#### Potential Issues to Watch
[Known problems or areas that need careful attention]

#### Suggested Goal for Next Session
[Logical next objective based on current progress]

### Project State Assessment
- **Build Status**: [Does project build successfully?]
- **Test Status**: [Do tests pass?]
- **Development Ready**: [Ready for local development?]
- **Production Ready**: [Ready for deployment?]
- **Blockers**: [Any issues preventing progress?]
```

CLEAR `.claude/sessions/.current-session` file.

PROVIDE session completion confirmation with key achievements.
