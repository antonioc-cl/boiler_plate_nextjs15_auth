# @feature-prp

Generate a focused PRP for single feature implementation.

## Usage
```
@feature-prp
```

## Actions
1. Create streamlined PRP
2. Focus on rapid implementation
3. Define minimal test requirements
4. Set clear completion criteria
5. Save to feature_prps directory

## Template

Generating focused PRP for: {FEATURE_NAME}

# Feature PRP: {FEATURE_NAME}

## Quick Overview
- **Feature**: {FEATURE_NAME}
- **Type**: [UI Component/API Endpoint/Service/etc]
- **Estimated Time**: [X hours]
- **Priority**: [High/Medium/Low]

## Objective
[Single sentence describing what this feature accomplishes]

## Implementation Checklist

### Preparation (15 min)
- [ ] Create feature branch
- [ ] Set up file structure
- [ ] Add to project routing/exports

### Core Implementation (2-3 hours)
- [ ] Create main component/service
- [ ] Implement business logic
- [ ] Add data handling
- [ ] Create necessary types/interfaces

### UI/API Layer (1 hour)
- [ ] Build user interface OR
- [ ] Create API endpoints
- [ ] Add input validation
- [ ] Implement error handling

### Integration (30 min)
- [ ] Connect to existing system
- [ ] Update related components
- [ ] Ensure data flow

### Testing (1 hour)
- [ ] Write unit tests
- [ ] Test happy path
- [ ] Test error cases
- [ ] Manual testing

## Technical Specifications

### Files to Create/Modify
```
src/
├── features/
│   └── {feature}/
│       ├── {feature}.ts
│       ├── {feature}.test.ts
│       └── types.ts
└── [integration points]
```

### Key Implementation Details
```typescript
// Core interface
interface {Feature} {
  // Essential properties
}

// Main function/component
export function {featureName}() {
  // Implementation
}
```

## Success Criteria
1. [ ] Feature works as specified
2. [ ] No regression in existing features
3. [ ] Tests pass
4. [ ] Code follows project standards

## Quick Test Plan
1. **Basic Functionality**: [Test case]
2. **Edge Case**: [Test case]
3. **Integration**: [Test case]

## Definition of Done
- [ ] Implementation complete
- [ ] Tests written and passing
- [ ] Code reviewed (self or peer)
- [ ] Integrated successfully
- [ ] Committed with clear message

---

Feature PRP saved to: `feature_prps/{feature_name}_prp.md`

Ready to implement with @feature-complete.

## Notes
- Streamlined for rapid development
- Focuses on essentials only
- Maintains quality standards