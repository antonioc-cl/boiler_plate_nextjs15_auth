# @note

Add timestamped progress notes to track development decisions and progress.

## Usage
```
@note "Note content"
```

## Actions
1. Add timestamped entry to PROJECT_STATUS.md
2. Update .claude_session with latest status
3. Optionally trigger a git commit for significant milestones

## Template

Adding progress note to PROJECT_STATUS.md:

**[TIMESTAMP]**: {NOTE_CONTENT}

## Context
- Current task: [Current active task]
- Impact: [How this affects the project]
- Next action: [What happens next]

Note added successfully.

## Notes
- Use for documenting important decisions
- Helps maintain context across sessions
- Creates audit trail of development process