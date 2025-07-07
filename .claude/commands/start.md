# @start

Initialize a new development session with proper context and tracking.

## Usage
```
@start "Project/Feature Name"
```

## Actions
1. Create session tracking file (.claude_session)
2. Initialize PROJECT_STATUS.md
3. Set up working directory structure
4. Create initial git branch (if in git repo)
5. Load any existing .claude_memory

## Template

I'm starting a new development session for "{PROJECT_NAME}".

Let me initialize the session:

1. **Session Setup**
   - Creating .claude_session for state tracking
   - Initializing PROJECT_STATUS.md
   - Setting up working directory

2. **Context Loading**
   - Checking for existing .claude_memory
   - Loading previous context if available

3. **Git Setup** (if applicable)
   - Creating feature branch
   - Setting up commit conventions

Session initialized. Ready to begin development.

## Notes
- Always run this before starting any development work
- Creates necessary tracking infrastructure
- Preserves context across sessions