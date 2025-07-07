# @adapt-workflow

Adapt the Claude Code workflow to fit the existing project's patterns and requirements.

## Usage
```
@adapt-workflow
```

## Actions
1. Customize workflow for project
2. Create project-specific commands
3. Adapt PRP format to project needs
4. Establish integration checkpoints
5. Define success metrics

## Template

Adapting Claude Code workflow for this project.

## Adapted Workflow for {PROJECT_NAME}

### Workflow Customization

#### Modified Flow Structure
Based on the project analysis, here's the adapted workflow:

1. **Initial Setup**
   ```bash
   @start "{Feature Name}"
   @analyze-existing  # Already completed
   ```

2. **Feature Planning**
   ```bash
   @quick-analyze     # For existing project features
   # OR
   @generate-prp      # For larger additions
   ```

3. **Implementation**
   ```bash
   # Follow project-specific patterns
   @execute-with-patterns
   ```

4. **Integration & Testing**
   ```bash
   @integrate-feature
   @run-project-tests
   ```

5. **Completion**
   ```bash
   @cleanup
   @end
   ```

### Project-Specific Commands

#### @execute-with-patterns
Implements features following detected patterns:
- Uses existing component structure
- Follows service layer patterns
- Maintains consistent styling
- Integrates with current state management

#### @integrate-feature
Ensures proper integration:
- Updates route definitions
- Adds to feature exports
- Updates API endpoints
- Modifies store/context

#### @run-project-tests
Runs project-specific test suites:
```bash
npm test -- --coverage
npm run test:e2e
npm run lint
```

### Adapted PRP Format

```markdown
# Feature: {Name} - {Project} Integration

## Integration Requirements
- Must follow {Framework} patterns
- Use existing {StateManagement} system
- Match current {Styling} approach
- Integrate with {ExistingFeatures}

## Implementation Checklist
### Project-Specific Setup
- [ ] Create feature in correct location
- [ ] Follow naming conventions
- [ ] Set up according to project structure

### Implementation
- [ ] Use existing service patterns
- [ ] Follow component templates
- [ ] Integrate with current auth
- [ ] Use established API patterns

### Testing
- [ ] Match existing test style
- [ ] Meet coverage requirements
- [ ] Pass linting rules
- [ ] E2E tests if applicable
```

### Integration Checkpoints

1. **Pre-Implementation**
   - Verify understanding of patterns
   - Check for conflicts
   - Review dependencies

2. **Mid-Implementation**
   - Validate pattern adherence
   - Test integration points
   - Check performance impact

3. **Post-Implementation**
   - Full integration testing
   - Regression testing
   - Documentation update

### Success Metrics

#### Code Quality
- [ ] Follows all existing patterns
- [ ] Passes all linting rules
- [ ] Meets test coverage threshold
- [ ] No performance regression

#### Integration Quality
- [ ] Seamlessly integrates with existing features
- [ ] No breaking changes
- [ ] Maintains consistent UX
- [ ] Documentation updated

#### Project-Specific
- [ ] Meets accessibility standards
- [ ] Follows security guidelines
- [ ] Maintains bundle size limits
- [ ] Compatible with supported browsers

### Quick Reference Card

```bash
# Start new feature in existing project
@start "Add User Preferences"
@quick-analyze
@execute-with-patterns
@integrate-feature
@run-project-tests
@end

# Major addition to existing project
@start "Payment System Integration"
@analyze-existing
@generate-context
@generate-prp "Payment Module"
@execute-with-patterns
@integrate-feature
@run-project-tests
@cleanup
@end
```

### Do's and Don'ts

#### Do's
- ✓ Follow existing patterns religiously
- ✓ Test integration continuously
- ✓ Update docs as you code
- ✓ Communicate breaking changes
- ✓ Preserve existing functionality

#### Don'ts
- ✗ Create new patterns without discussion
- ✗ Skip integration tests
- ✗ Ignore linting warnings
- ✗ Break existing APIs
- ✗ Add incompatible dependencies

### Emergency Procedures

If integration fails:
1. Rollback changes
2. Analyze conflict
3. Consult existing examples
4. Modify approach
5. Re-attempt integration

Workflow adapted for {PROJECT_NAME}. Ready to begin feature development.

## Notes
- Customized for specific project needs
- Ensures smooth integration
- Maintains project standards