# Generate Product Requirements Prompt

ARGUMENTS: Analysis file from /analyze-prd (e.g., /generate-prp analysis/prd_analysis_auth.md)

READ:
- Analysis file for comprehensive technical research
- CLAUDE.md for project context and maximum sub-agent guidelines
- docs/ directory for architecture patterns
- examples/ for existing code patterns

DEPLOY MAXIMUM sub-agents for detailed implementation planning (8-12 agents):

**Agent 1 - API Design & Backend Architecture Specialist:**
- Design comprehensive API structure and endpoints
- Research authentication and authorization patterns
- Plan server actions and backend service architecture

**Agent 2 - Database Design & Migration Specialist:**
- Design detailed database schema and relationships
- Plan migration strategy and data modeling
- Research performance optimization and indexing

**Agent 3 - Frontend Architecture & Component Specialist:**
- Design component hierarchy and reusable patterns
- Plan state management and data flow architecture
- Research UI frameworks and interaction patterns

**Agent 4 - Authentication & Security Implementation Specialist:**
- Research advanced security patterns and implementation
- Plan authentication flows and session management
- Design authorization and permission systems

**Agent 5 - Testing & Quality Assurance Implementation Specialist:**
- Design comprehensive testing strategy (unit, integration, E2E)
- Plan test data management and mocking strategies
- Research testing frameworks and quality metrics

**Agent 6 - Performance & Optimization Implementation Specialist:**
- Plan performance optimization strategies
- Research caching, bundling, and load optimization
- Design monitoring and performance measurement

**Agent 7 - User Experience & Accessibility Implementation Specialist:**
- Design detailed user flows and interaction patterns
- Plan accessibility compliance and inclusive design
- Research responsive design and mobile optimization

**Agent 8 - Documentation & Developer Experience Specialist:**
- Plan comprehensive documentation strategy
- Design API documentation and code examples
- Plan developer onboarding and knowledge transfer

**Agent 9 - DevOps & Deployment Specialist:**
- Plan deployment strategy and CI/CD pipeline
- Research infrastructure requirements and scaling
- Design monitoring, logging, and error tracking

**Agent 10 - Integration & Third-party Implementation Specialist:**
- Plan detailed third-party service integrations
- Research API client implementations and error handling
- Design webhook handling and event processing

**Agent 11 - Error Handling & Resilience Specialist:**
- Design comprehensive error handling strategies
- Plan fallback mechanisms and graceful degradation
- Research monitoring and alerting systems

**Agent 12 - Business Logic & Domain Implementation Specialist:**
- Plan complex business logic implementation
- Design domain models and business rules
- Research workflow automation and business processes

WAIT for ALL agents to complete detailed research and planning.

SYNTHESIZE all agent findings into comprehensive implementation roadmap.

CREATE detailed PRP file in `PRPS/`:
`PRPS/prp_$(date +%Y%m%d_%H%M)_[feature-name].md`

**PRP Structure:**
```markdown
# Product Requirements Prompt - [Feature Name]

## Executive Summary
[High-level feature description and business value from all agent perspectives]

## Multi-Agent Research Summary
### Technology Stack Analysis
- [Current stack compatibility findings from all agents]
- [Required new dependencies identified by specialists]
- [Performance implications from optimization agent]

### API Research
- [External APIs needed per integration specialist]
- [Authentication requirements from security agent]
- [Rate limiting considerations from performance agent]

### Database Analysis
- [Schema changes from database specialist]
- [Migration complexity assessment]
- [Data relationships and optimization strategies]

## Implementation Architecture

### Backend Components
- [Server actions from backend architect]
- [API routes from API design specialist]
- [Database models from data specialist]
- [Authentication integration from security specialist]

### Frontend Components
- [Pages to create/modify from frontend specialist]
- [Components from component architect]
- [State management from frontend specialist]
- [Form handling from UX specialist]

### Integration Points
- [Third-party services from integration specialist]
- [Email system integration details]
- [File upload handling specifications]
- [Webhook and event processing plans]

## Detailed Technical Specifications

### Database Schema
[Comprehensive schema from database specialist with performance considerations]

### API Endpoints
[Detailed specifications from API architect with security annotations]

### Component Specifications
[Component architecture from frontend specialist with accessibility notes]

## Implementation Plan

### Phase 1: Foundation
- [ ] Database schema setup (Database specialist plan)
- [ ] Basic API structure (API architect plan)
- [ ] Authentication integration (Security specialist plan)

### Phase 2: Core Features
- [ ] Main functionality implementation (Domain specialist plan)
- [ ] Frontend components (Frontend specialist plan)
- [ ] Form validation (UX specialist plan)

### Phase 3: Integration & Testing
- [ ] End-to-end integration (Integration specialist plan)
- [ ] Comprehensive testing (QA specialist plan)
- [ ] Error handling (Resilience specialist plan)

### Phase 4: Optimization & Deployment
- [ ] Performance optimization (Performance specialist plan)
- [ ] Deployment setup (DevOps specialist plan)
- [ ] Documentation (Documentation specialist plan)

## Success Criteria
- [ ] [Specific measurable outcomes from all specialists]
- [ ] [Performance requirements from optimization agent]
- [ ] [User experience goals from UX specialist]
- [ ] [Security compliance from security agent]

## Testing Strategy
- [ ] Unit tests for utilities (QA specialist)
- [ ] Integration tests for API (Backend specialist)
- [ ] E2E tests for user flows (QA specialist)
- [ ] Performance testing (Performance specialist)
- [ ] Security testing (Security specialist)

## Documentation Requirements
- [ ] API documentation (Documentation specialist)
- [ ] Component documentation (Frontend specialist)
- [ ] User guide updates (UX specialist)
- [ ] Developer onboarding (Documentation specialist)

## Risk Mitigation
[Comprehensive risk analysis from all specialist perspectives]

## Potential Risks & Mitigation
- [Technical risks from all agents]
- [Timeline risks from project planning]
- [Integration risks from integration specialist]
- [Security risks from security agent]
- [Performance risks from optimization specialist]
```

INCLUDE comprehensive synthesis from all specialist perspectives.

LOG PRP creation with multi-agent approach summary to current session.