# @execute-prp

Execute the current PRP with systematic implementation.

## Usage
```
@execute-prp
```

## Actions
1. Load current PRP
2. Set up implementation environment
3. Execute step-by-step implementation
4. Run tests after each step
5. Update progress tracking

## Template

Executing PRP: {COMPONENT_NAME}

## Implementation Progress

### Current Status
- PRP: {component_name}_prp.md
- Step: [Current step]
- Progress: [X/Y tasks completed]

### Step Execution

#### Step 1: Setup and Structure ✓
```bash
# Created directory structure
mkdir -p src/components/{component}
```

Created files:
- `index.ts` - Component exports
- `{component}.component.ts` - Main component
- `{component}.types.ts` - Type definitions

#### Step 2: Core Implementation (In Progress)
Implementing service layer...

```typescript
// {component}.service.ts
export class {Component}Service {
  // Implementation
}
```

**Test Results**:
- ✓ Service instantiation
- ✓ Data fetching
- ⏳ Error handling

### Code Quality Checks
- [ ] Linting passed
- [ ] Type checking passed
- [ ] Unit tests passed
- [ ] Integration tests passed

### Implementation Notes
- Decision: Used [pattern] for [reason]
- Challenge: [Issue encountered]
- Solution: [How resolved]

### Next Actions
1. Complete error handling
2. Add loading states
3. Implement UI components

### Blockers
- None currently

## Progress Update
Updated PROJECT_STATUS.md with current progress.
Current completion: 60%

Continue with next step...

## Notes
- Systematic execution ensures quality
- Regular testing catches issues early
- Progress tracking maintains visibility