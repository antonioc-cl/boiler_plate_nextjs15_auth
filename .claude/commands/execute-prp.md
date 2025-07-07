# Execute Product Requirements Prompt

ARGUMENTS: PRP file path (e.g., /execute-prp PRPS/prp_auth_system.md)

READ PRP file completely for full context.

**EXECUTION PHASES:**

**Phase 1: Pre-execution Validation**
- Verify all requirements are clear
- Check environment setup
- Validate dependencies are available
- Confirm database connectivity

**Phase 2: Foundation Setup**
- Install new dependencies
- Run database migrations
- Create basic file structure
- Set up configuration

**Phase 3: Systematic Implementation**
Follow PRP implementation plan step by step:

1. **Database Layer**
   - Create/modify schemas
   - Set up relationships
   - Create seed data if needed

2. **Backend Implementation**
   - Create server actions
   - Set up API routes
   - Implement business logic
   - Add authentication integration

3. **Frontend Implementation**
   - Create/modify pages
   - Build components
   - Implement forms and validation
   - Set up state management

4. **Integration**
   - Connect frontend to backend
   - Test data flow
   - Implement error handling

**Phase 4: Testing & Validation**
- Run unit tests (create if needed)
- Run integration tests
- Manual testing of user flows
- Performance testing

**Phase 5: Documentation**
- Update API documentation
- Document new components
- Update README if needed

**CONTINUOUS VALIDATION:**
After each major step:
- Run tests to ensure nothing breaks
- Check code follows project conventions
- Verify performance isn't degraded
- Log progress with /note command

**PROGRESS TRACKING:**
- Log completion of each phase
- Document any deviations from plan
- Record problems encountered and solutions
- Update session with key decisions

**FINAL VERIFICATION:**
- All success criteria from PRP met
- Full test suite passes
- Code follows project standards
- Documentation is complete

PROVIDE comprehensive summary of implementation with any recommendations for follow-up work.