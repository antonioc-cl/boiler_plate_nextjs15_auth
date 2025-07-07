# @track-progress

Track and report progress on current PRP execution.

## Usage
```
@track-progress
```

## Actions
1. Calculate completion percentage
2. Update PROJECT_STATUS.md
3. Identify blockers or delays
4. Estimate remaining time
5. Generate progress report

## Template

## Progress Report: {COMPONENT_NAME}

### Summary
- **Component**: {COMPONENT_NAME}
- **Started**: [Start date/time]
- **Elapsed**: [Time spent]
- **Completion**: [X]% complete

### Detailed Progress

#### Completed Tasks ✓
1. **Setup and Structure** (100%)
   - Created directory structure
   - Set up base files
   - Defined interfaces
   
2. **Service Layer** (100%)
   - Implemented core service
   - Added error handling
   - Created unit tests

#### In Progress 🔄
3. **Component Implementation** (60%)
   - ✓ Basic component structure
   - ✓ State management
   - ⏳ UI implementation
   - ⏳ Event handlers

#### Pending ⏸️
4. **Integration** (0%)
   - Connect to backend
   - Add real-time updates
   - Implement caching

5. **Testing** (0%)
   - Component tests
   - Integration tests
   - E2E scenarios

### Velocity Analysis
- **Planned**: 5 days
- **Spent**: 2 days
- **Remaining**: ~2 days (on track)
- **Average velocity**: 2.5 tasks/day

### Quality Metrics
- **Test Coverage**: 85%
- **Linting Issues**: 0
- **Type Errors**: 0
- **Code Review Status**: Pending

### Blockers & Risks
1. **Current Blockers**: None
2. **Potential Risks**: 
   - API changes may affect integration
   - Performance requirements tight

### Updated Timeline
- Today: Complete UI implementation
- Tomorrow: Integration and testing
- Day 3: Final testing and documentation

### Next Immediate Tasks
1. Complete UI event handlers
2. Add form validation
3. Implement loading states

### Git Status
- Branch: feature/{component-name}
- Commits: 12
- Files changed: 18
- Last commit: "Add state management"

Progress tracked. PROJECT_STATUS.md updated.

## Notes
- Regular tracking prevents surprises
- Helps identify when to adjust approach
- Provides transparency on progress