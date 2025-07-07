# @generate-prp

Generate a detailed Precise Requirements Plan for a specific component or feature.

## Usage
```
@generate-prp "Component Name"
```

## Actions
1. Extract relevant requirements from PRD
2. Define precise technical specifications
3. Create implementation roadmap
4. Specify test criteria
5. Document in PRP format

## Template

Generating Precise Requirements Plan for: {COMPONENT_NAME}

# PRP: {COMPONENT_NAME}

## Overview
**Component**: {COMPONENT_NAME}
**Priority**: [High/Medium/Low]
**Estimated Effort**: [X days]
**Dependencies**: [List dependencies]

## Objectives
1. [Primary objective]
2. [Secondary objective]
3. [Success criteria]

## Technical Specifications

### Architecture
- **Pattern**: [MVC/Microservice/etc]
- **Technologies**: [Specific stack]
- **Integration Points**: [APIs/Services]

### Data Model
```typescript
interface {ModelName} {
  id: string;
  // ... fields
}
```

### API Endpoints (if applicable)
```
POST   /api/{resource}     - Create
GET    /api/{resource}     - List
GET    /api/{resource}/:id - Read
PUT    /api/{resource}/:id - Update
DELETE /api/{resource}/:id - Delete
```

### Component Structure
```
{component}/
├── index.ts
├── {component}.component.ts
├── {component}.service.ts
├── {component}.types.ts
└── {component}.test.ts
```

## Implementation Plan

### Step 1: Setup and Structure
- [ ] Create component directory
- [ ] Set up base files
- [ ] Define interfaces/types
- [ ] Configure routes

### Step 2: Core Implementation
- [ ] Implement service layer
- [ ] Create component logic
- [ ] Add state management
- [ ] Implement UI

### Step 3: Integration
- [ ] Connect to backend
- [ ] Add error handling
- [ ] Implement loading states
- [ ] Add validation

### Step 4: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E test scenarios
- [ ] Performance testing

## Acceptance Criteria
1. **Functional**
   - [ ] [Criterion 1]
   - [ ] [Criterion 2]
   
2. **Performance**
   - [ ] Loads within Xs
   - [ ] Handles N concurrent users
   
3. **Security**
   - [ ] Input validation
   - [ ] Authorization checks
   
4. **UX**
   - [ ] Responsive design
   - [ ] Accessibility compliance

## Test Scenarios
1. **Happy Path**
   - User performs expected action
   - System responds correctly
   
2. **Error Cases**
   - Invalid input handling
   - Network failure recovery
   
3. **Edge Cases**
   - Boundary conditions
   - Concurrent operations

## Documentation Requirements
- [ ] API documentation
- [ ] Component usage guide
- [ ] Configuration options
- [ ] Troubleshooting guide

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (>90% coverage)
- [ ] Code reviewed and approved
- [ ] Documentation complete
- [ ] Deployed to staging

---

PRP saved to: `prp/{component_name}_prp.md`

Ready to execute this PRP with @execute-prp.

## Notes
- Each PRP is self-contained
- Provides clear implementation path
- Enables accurate progress tracking