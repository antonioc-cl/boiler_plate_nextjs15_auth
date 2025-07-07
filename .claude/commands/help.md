# Development Session Help

This system provides comprehensive session management for development work.

## Available Commands:

### `/start [goal description]`
- Starts new development session with specific goal
- Deploys sub-agents for project analysis
- Creates timestamped session file
- Example: `/start upgrade Next.js to version 15`

### `/note [progress description]`
- Updates current session with detailed progress
- Logs what has been accomplished
- Tracks files modified and decisions made

### `/status`
- Shows current session status and progress
- Displays goal and recent updates
- Quick project state check

### `/end`
- Finalizes session with comprehensive summary
- Documents problems encountered and solutions
- Creates detailed report for future sessions

### `/memory`
- Lists previous sessions for context
- Helps locate relevant development history
- Shows session summaries

### `/analyze-prd [prd-file]`
- Analyzes Product Requirements Document
- Research technical feasibility
- Creates technical analysis with sub-agents

### `/generate-prp [analysis-file]`
- Generates Product Requirements Prompt from analysis
- Deep technical research and implementation planning
- Creates comprehensive implementation roadmap

### `/execute-prp [prp-file]`
- Executes PRP end-to-end implementation
- Systematic development with testing and validation
- Complete feature implementation

## Benefits:
- **Memory between sessions**: Previous session files provide context
- **Problem/Solution tracking**: Never repeat the same mistakes  
- **Progress documentation**: Clear record of all work
- **Context continuity**: Each session builds on previous knowledge
- **PRD to Code pipeline**: Complete business requirement to implementation flow