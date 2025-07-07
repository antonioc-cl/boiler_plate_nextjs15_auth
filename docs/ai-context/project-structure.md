# Project Structure & Technology Stack

## Technology Stack

### Frontend
- **Framework**: [To be configured - React/Vue/Angular]
- **State Management**: [To be configured - Redux/MobX/Vuex/Context]
- **Styling**: [To be configured - CSS Modules/Styled Components/Tailwind]
- **Build Tool**: [To be configured - Vite/Webpack/Parcel]
- **Testing**: [To be configured - Jest/Vitest/Cypress]

### Backend
- **Runtime**: [To be configured - Node.js/Python/Java/.NET]
- **Framework**: [To be configured - Express/FastAPI/Spring/ASP.NET]
- **Database**: [To be configured - PostgreSQL/MySQL/MongoDB]
- **Caching**: [To be configured - Redis/Memcached]
- **Queue**: [To be configured - RabbitMQ/Kafka/SQS]

### Infrastructure
- **Hosting**: [To be configured - AWS/GCP/Azure/Vercel]
- **Container**: [To be configured - Docker/Kubernetes]
- **CI/CD**: [To be configured - GitHub Actions/GitLab CI/Jenkins]
- **Monitoring**: [To be configured - DataDog/New Relic/Prometheus]

## Directory Structure

```
project-root/
├── .claude/                    # Claude AI development system
│   ├── commands/              # AI command definitions
│   ├── analytics/             # Development metrics and insights
│   └── learning/              # Pattern library and learnings
├── docs/                      # Documentation
│   ├── ai-context/           # AI-specific context docs
│   ├── components/           # Component documentation
│   └── features/             # Feature documentation
├── src/                      # Source code
│   ├── frontend/             # Frontend application
│   ├── backend/              # Backend services
│   ├── shared/               # Shared utilities
│   └── tests/                # Test suites
├── infrastructure/           # Infrastructure as code
│   ├── terraform/            # Terraform configurations
│   ├── kubernetes/           # K8s manifests
│   └── docker/               # Dockerfiles
├── scripts/                  # Utility scripts
├── sessions/                 # AI session tracking
├── plans/                    # Development plans
├── PRPS/                     # Product requirement prompts
├── .cache/                   # Intelligent caching
└── CLAUDE.md                 # Master AI context
```

## Coding Standards

### General Principles
- **Clean Code**: Readable, maintainable, testable
- **SOLID Principles**: Single responsibility, open/closed, etc.
- **DRY**: Don't repeat yourself
- **KISS**: Keep it simple, stupid

### Naming Conventions
- **Files**: kebab-case for files (user-service.ts)
- **Classes**: PascalCase (UserService)
- **Functions**: camelCase (getUserById)
- **Constants**: UPPER_SNAKE_CASE (MAX_RETRY_COUNT)
- **Interfaces**: PascalCase with 'I' prefix (IUserService)

### Code Organization
- **Module Structure**: Feature-based organization
- **Import Order**: External → Internal → Local
- **File Length**: Max 300 lines per file
- **Function Length**: Max 50 lines per function

## Testing Strategy

### Test Types
1. **Unit Tests**: Individual components/functions
2. **Integration Tests**: Component interactions
3. **E2E Tests**: User workflows
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Vulnerability scanning

### Coverage Requirements
- **Minimum Coverage**: 85%
- **Critical Paths**: 95%
- **New Code**: 90%

### Test Organization
```
src/
├── component/
│   ├── component.ts
│   ├── component.test.ts    # Unit tests
│   └── component.e2e.ts     # E2E tests
```

## Development Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: New features
- **bugfix/***: Bug fixes
- **hotfix/***: Emergency fixes

### Commit Convention
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

### Code Review Process
1. Self-review checklist
2. Automated checks (lint, test, security)
3. Peer review (min 1 approval)
4. AI-assisted review (patterns, security)

## Security Standards

### Authentication
- JWT with refresh tokens
- MFA for sensitive operations
- Session management
- Rate limiting

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII handling compliance
- Secure secret management

### API Security
- Input validation
- Output sanitization
- CORS configuration
- Security headers

## Performance Standards

### Response Times
- API endpoints: < 200ms (p95)
- Page load: < 3s
- Time to interactive: < 5s

### Resource Limits
- Memory usage: < 512MB per service
- CPU usage: < 80% sustained
- Database connections: Pool of 20

## Monitoring & Observability

### Metrics
- Application metrics (custom)
- Infrastructure metrics (system)
- Business metrics (KPIs)

### Logging
- Structured logging (JSON)
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation

### Tracing
- Distributed tracing
- Request correlation IDs
- Performance profiling

---

*This document should be updated whenever the technology stack or project structure changes significantly.*