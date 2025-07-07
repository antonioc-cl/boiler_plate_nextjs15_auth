# Start Development Session

ARGUMENTS: Goal description (required)

FIRST, check if sessions/ directory exists:
- If not, CREATE sessions/ directory

THEN, create session file:
`sessions/session_$(date +%Y%m%d_%H%M)_[goal-slug].md`

WRITE to session file:
```markdown
# Development Session - $(date)

## Session Goal
$ARGUMENTS

## Multi-Agent Analysis
[Comprehensive sub-agent analysis will be added here]

## Session Started
- Date: $(date)
- Time: $(date +%H:%M)

## Progress Log
[Updates from /note commands will be added here]

## Development Notes
[Important observations and decisions]
```

DEPLOY MAXIMUM sub-agents for comprehensive analysis (5-8 agents minimum):

**Agent 1 - Current State Deep Analyzer:**
- Analyze project version, dependencies, and configuration
- Review recent git history and current branch status
- Assess current architecture and identify technical debt

**Agent 2 - Goal Research Specialist:**
- Research best practices for the stated goal
- Investigate multiple implementation approaches
- Find relevant documentation and case studies

**Agent 3 - Compatibility & Integration Analyst:**
- Analyze code base compatibility with goal requirements
- Identify potential breaking changes and integration points
- Assess scope, complexity, and potential blockers

**Agent 4 - Performance & Security Auditor:**
- Evaluate performance implications of the goal
- Identify security considerations and requirements
- Assess scalability and optimization opportunities

**Agent 5 - Testing & Quality Strategist:**
- Plan comprehensive testing approach for the goal
- Identify test coverage gaps and quality assurance needs
- Design validation and verification strategies

**Agent 6 - User Experience & Accessibility Researcher:**
- Analyze UX implications and user journey impact
- Research accessibility requirements and best practices
- Evaluate user interface and interaction patterns

**Agent 7 - Documentation & Knowledge Transfer Specialist:**
- Identify documentation needs and knowledge gaps
- Plan communication and handoff requirements
- Assess learning and training implications

**Agent 8 - Risk Assessment & Mitigation Planner:**
- Identify potential risks and failure points
- Develop contingency plans and fallback strategies
- Assess timeline and resource implications

WAIT for ALL sub-agents to complete their specialized analysis.

SYNTHESIZE findings from all agents into comprehensive project overview.

APPEND synthesis results to session file under "## Multi-Agent Analysis"

UPDATE `.claude/sessions/.current-session` with session file path.

PROVIDE comprehensive summary from all agent perspectives and readiness assessment.
