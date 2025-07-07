# Analyze Product Requirements Document

ARGUMENTS: PRD file path (e.g., /analyze-prd docs/prd-auth-system.md)

READ the PRD file completely and perform multi-agent analysis.

DEPLOY MAXIMUM sub-agents for comprehensive PRD analysis (6-10 agents):

**Agent 1 - Business Requirements Analyst:**
- Extract and analyze user stories and acceptance criteria
- Identify business goals, success metrics, and KPIs
- Assess priority levels and timeline requirements

**Agent 2 - Technical Feasibility Researcher:**
- Analyze current architecture compatibility
- Research required dependencies, tools, and frameworks
- Identify potential technical blockers and limitations

**Agent 3 - Implementation Scope Architect:**
- Break down requirements into technical components
- Design high-level system architecture
- Identify API requirements and data flow implications

**Agent 4 - Database & Backend Specialist:**
- Analyze database schema implications and requirements
- Plan backend services and server action needs
- Assess data modeling and migration complexity

**Agent 5 - Frontend & UX Analyst:**
- Research UI/UX patterns and component requirements
- Analyze user interaction flows and interface needs
- Plan frontend architecture and state management

**Agent 6 - Security & Compliance Auditor:**
- Identify security requirements and compliance needs
- Research authentication and authorization implications
- Assess data privacy and protection requirements

**Agent 7 - Performance & Scalability Planner:**
- Analyze performance requirements and constraints
- Research scalability implications and optimization needs
- Assess infrastructure and deployment considerations

**Agent 8 - Testing & Quality Assurance Strategist:**
- Plan comprehensive testing strategy for requirements
- Identify quality assurance and validation needs
- Design acceptance testing and user validation approaches

**Agent 9 - Integration & Third-party Service Researcher:**
- Research external service integrations and APIs
- Analyze third-party dependencies and requirements
- Assess vendor selection and integration complexity

**Agent 10 - Risk & Timeline Assessment Specialist:**
- Identify project risks and potential failure points
- Assess realistic timeline and resource requirements
- Develop contingency plans and mitigation strategies

WAIT for ALL agents to complete comprehensive analysis.

SYNTHESIZE all findings into unified technical analysis.

CREATE comprehensive analysis file:
`analysis/prd_analysis_$(date +%Y%m%d_%H%M)_[feature-name].md`

INCLUDE synthesis from all agent perspectives with detailed recommendations.

OUTPUT summary with confidence assessment and recommendation for PRP generation.