# Documentation Overview - AI Context Routing Map

## Purpose
This file serves as the primary routing map for the AI assistant to understand the documentation structure and locate relevant information efficiently.

## Documentation Tiers

### Tier 1: Foundation Documentation (Current Directory)
- **docs-overview.md** (this file) - Documentation routing map
- **project-structure.md** - Complete tech stack and file organization
- **system-integration.md** - Cross-component communication patterns
- **deployment-infrastructure.md** - Infrastructure and deployment context
- **compliance-standards.md** - Security and regulatory requirements
- **handoff.md** - Session continuity and handoff procedures

### Tier 2: Component Documentation (`../components/`)
- **backend/CLAUDE.md** - Backend architecture, APIs, services
- **frontend/CLAUDE.md** - Frontend framework, UI components, state management
- **database/CLAUDE.md** - Database schema, queries, optimization
- **security/CLAUDE.md** - Security implementations, auth flows, encryption

### Tier 3: Feature Documentation (`../features/`)
- **auth/CLAUDE.md** - Authentication feature implementation details
- **payment/CLAUDE.md** - Payment processing feature details
- **analytics/CLAUDE.md** - Analytics and reporting feature details
- **errors/PATTERNS.md** - Common error patterns and solutions

## Navigation Rules

### When to Use Each Tier
1. **Start with Tier 1** for:
   - Project overview and architecture decisions
   - Cross-cutting concerns
   - Infrastructure and deployment
   - Compliance and security standards

2. **Move to Tier 2** for:
   - Component-specific implementation details
   - Technology-specific patterns
   - Component interactions

3. **Use Tier 3** for:
   - Feature-specific business logic
   - User-facing functionality
   - Feature-level error patterns

## Quick Reference

### Project Information
- Tech Stack: `project-structure.md`
- Architecture: `system-integration.md`
- Deployment: `deployment-infrastructure.md`

### Development Standards
- Security: `compliance-standards.md` + `components/security/CLAUDE.md`
- Code Style: `project-structure.md#coding-standards`
- Testing: `project-structure.md#testing-strategy`

### Feature Implementation
- New Feature: Start with relevant Tier 3 doc
- Component Integration: Check Tier 2 docs
- Cross-Feature: Review `system-integration.md`

## Documentation Maintenance
- Tier 1: Updated with major architectural changes
- Tier 2: Updated with component refactoring
- Tier 3: Updated with each feature implementation

---

*This documentation structure enables efficient context loading and reduces cognitive overhead for both AI and human developers.*