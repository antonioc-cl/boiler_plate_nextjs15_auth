# Claude Code Development System

This directory contains a comprehensive development workflow system designed to work with Claude Code for AI-assisted development.

## 🎯 System Overview

This system provides:
- **Session Management**: Track development work with memory between sessions
- **Sub-agent Research**: Automated analysis and research for complex tasks
- **PRD to Code Pipeline**: Complete workflow from business requirements to implementation
- **Context Engineering**: Rich context for Claude to understand your project deeply

## 📁 Directory Structure

```
.claude/
├── commands/           # Claude Code commands
│   ├── help.md        # System documentation
│   ├── start.md       # Start development session
│   ├── note.md        # Log progress during development
│   ├── status.md      # Check current session status
│   ├── end.md         # Finalize session with summary
│   ├── memory.md      # View session history
│   ├── cleanup.md     # Clear session context
│   ├── analyze-prd.md # Analyze Product Requirements
│   ├── generate-prp.md # Generate implementation plan
│   └── execute-prp.md # Execute implementation
└── sessions/
    └── .current-session # Tracks active session
```

## 🚀 Quick Start

### 1. Basic Development Session
```bash
/start implement user dashboard
# ... develop with regular Claude Code commands ...
/note added user profile component with avatar upload
/status  # Check progress
/end     # Create comprehensive session summary
```

### 2. PRD to Implementation Pipeline
```bash
# Step 1: Analyze business requirements
/analyze-prd docs/prd-user-auth.md

# Step 2: Generate technical implementation plan
/generate-prp analysis/prd_analysis_20250706_auth.md

# Step 3: Execute complete implementation
/execute-prp PRPS/prp_20250706_auth_system.md
```

### 3. Session Memory and Context
```bash
/memory  # View previous sessions
# Open relevant session files for context
/start continue authentication work from yesterday
```

## 🧠 Key Features

### Session Management
- **Memory Between Sessions**: Each session is documented and can provide context for future work
- **Problem/Solution Tracking**: Never repeat the same mistakes - solutions are documented
- **Progress Documentation**: Clear timeline of what was accomplished
- **Context Continuity**: Build on previous work seamlessly

### Sub-agent Research
- **Current State Analysis**: Understand project status and architecture
- **Goal Research**: Deep dive into requirements and best practices
- **Compatibility Analysis**: Assess impact and integration complexity
- **Automated Investigation**: Let AI agents research while you focus on development

### PRD Pipeline
- **Business to Technical Translation**: Convert product requirements to implementation plans
- **Comprehensive Research**: Deep technical analysis before coding begins
- **Systematic Implementation**: Step-by-step execution with validation
- **End-to-end Delivery**: From concept to tested, documented code

## 📋 Command Reference

### Core Session Commands
| Command | Purpose | Example |
|---------|---------|---------||
| `/start [goal]` | Begin new development session | `/start add payment integration` |
| `/note [progress]` | Log progress and decisions | `/note implemented Stripe webhook handling` |
| `/status` | Check current session state | `/status` |
| `/end` | Finalize with comprehensive summary | `/end` |
| `/memory` | View session history | `/memory` |
| `/cleanup` | Clear session context | `/cleanup` |

### PRD Pipeline Commands
| Command | Purpose | Example |
|---------|---------|---------||
| `/analyze-prd [file]` | Analyze business requirements | `/analyze-prd docs/prd-checkout.md` |
| `/generate-prp [analysis]` | Create implementation plan | `/generate-prp analysis/prd_analysis_checkout.md` |
| `/execute-prp [prp]` | Execute implementation | `/execute-prp PRPS/prp_checkout_system.md` |

## 🎓 Best Practices

### 1. Start Every Work Session
Always begin with `/start [clear goal]` to get:
- Current project analysis
- Research relevant to your goal
- Documented session tracking

### 2. Use Progressive Notes
Document progress with `/note` as you work:
- Key decisions made
- Problems encountered and solved
- Architecture choices and reasoning

### 3. End Sessions Properly
Always use `/end` to create:
- Comprehensive summary of work done
- Problems and solutions for future reference
- Recommendations for next session

### 4. Leverage Session Memory
Before starting work:
- Use `/memory` to see previous sessions
- Open relevant session files for context
- Build on previous learnings and solutions

### 5. Use PRD Pipeline for Complex Features
For substantial new features:
1. Start with business requirements (PRD)
2. Analyze technical feasibility
3. Generate detailed implementation plan
4. Execute with systematic validation

## 🔧 Customization

### Adding New Commands
Create new `.md` files in the `commands/` directory following the existing pattern:

```markdown
# Command Description

ARGUMENTS: [expected arguments]

[Command logic and instructions for Claude]
```

### Modifying Existing Commands
Edit the command files to match your specific workflow needs. The system is designed to be flexible and adaptable.

## 🤝 Integration with Your Workflow

This system integrates seamlessly with:
- **Git workflows**: Automatic analysis of changes and commits
- **Testing frameworks**: Built-in test execution and validation
- **Documentation**: Automatic updates to project docs
- **CI/CD**: Hooks for automated validation and deployment

## 📚 Learning Resources

- Use `/help` within Claude Code for full command documentation
- Review session files in `sessions/` for examples of comprehensive documentation
- Check `PRPS/` directory for examples of detailed implementation plans

---

*This system transforms Claude Code from a coding assistant into a comprehensive development partner with memory, research capabilities, and systematic workflow management.*