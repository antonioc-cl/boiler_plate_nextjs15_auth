# @memory

Save important context and decisions for future sessions.

## Usage
```
@memory "Context to save"
```

## Actions
1. Append to .claude_memory with timestamp
2. Categorize information (decision, context, learning)
3. Update session state
4. Create searchable index

## Template

Saving to .claude_memory:

### [TIMESTAMP] - {CATEGORY}
{MEMORY_CONTENT}

**Tags**: [Relevant tags for searching]
**Related**: [Related files or decisions]

## Saved Context Categories
- **Decision**: Architectural or design choices
- **Context**: Project-specific knowledge
- **Learning**: Patterns or solutions discovered
- **Warning**: Issues to remember

Memory saved successfully.

## Notes
- Preserves knowledge across sessions
- Searchable for future reference
- Critical for long-term projects