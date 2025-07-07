# Development Session Memory

List recent development sessions for context and reference.

RUN: `ls -t sessions/session_*.md | head -15`

FOR each session file, extract:
- Date and time from filename
- Goal from session file
- Completion status from file
- Key achievements if session was completed

FORMAT as readable table:
```
## Recent Development Sessions

| Date | Time | Goal | Status | Key Outcomes |
|------|------|------|--------|--------------|
[Parse each session file for summary information]
```

HIGHLIGHT any sessions that might be relevant to current work.

SUGGEST which previous sessions to review for context:
- Sessions with similar goals
- Sessions that encountered problems you might face
- Recent sessions with relevant technical decisions

**Usage**: Open any session file to provide Claude with detailed context about previous work.