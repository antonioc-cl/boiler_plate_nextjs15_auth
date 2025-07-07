# AI-Powered Debugging with Historical Context

---
description: "Intelligent debugging assistant that leverages error patterns and historical solutions"
allowed-tools: Bash(git:*), Bash(grep:*), Bash(find:*), Bash(npm:*), Bash(test:*)
---

## Debug Command Initialization
Target: $ARGUMENTS

### Context Intelligence Loading
- **Error Pattern History**: !test -f docs/features/errors/PATTERNS.md && echo "✓ Error patterns available" || echo "Creating error pattern database"
- **Recent Changes**: !git log --oneline -10
- **Current Branch**: !git branch --show-current
- **Test Status**: !npm test 2>/dev/null && echo "✓ Tests passing" || echo "⚠ Test failures detected"

### Debugging Intelligence Analysis
- **Similar Errors**: !grep -i "$ARGUMENTS" docs/features/errors/PATTERNS.md 2>/dev/null | head -5
- **Recent Issues**: !git log --grep="fix" --oneline -10
- **Common Patterns**: !find .claude/learning/failures -name "*.json" 2>/dev/null | head -5

## Multi-Expert Debugging Analysis

### 1. Error Pattern Recognition Expert
**Perspective: Debugging Specialist with ML Pattern Matching**

Analyzing error patterns and historical solutions:
- **Pattern Matching**: Comparing current error against historical error database
- **Root Cause Prediction**: Using ML to predict most likely root causes
- **Solution Ranking**: Ranking potential solutions by historical success rate
- **Impact Analysis**: Predicting impact of potential fixes on system

### 2. System State Analysis Expert
**Perspective: System Diagnostics Specialist**

Comprehensive system state evaluation:
- **Dependency Analysis**: Checking for version conflicts and missing dependencies
- **Configuration Validation**: Verifying all configuration files and environment variables
- **State Consistency**: Checking database state, cache validity, and session integrity
- **Resource Analysis**: Memory usage, CPU patterns, and resource exhaustion

### 3. Code Change Impact Expert
**Perspective: Git History Analyst**

Analyzing recent changes and their potential impact:
- **Change Correlation**: Identifying code changes that correlate with error appearance
- **Dependency Impact**: Tracking how changes affect dependent components
- **Regression Detection**: Identifying potential regression from previous fixes
- **Author Pattern Analysis**: Learning from how similar issues were fixed by team

### 4. Performance Debugging Expert
**Perspective: Performance Engineer**

Performance-related debugging analysis:
- **Performance Regression**: Identifying performance degradation patterns
- **Bottleneck Detection**: Locating performance bottlenecks in code execution
- **Resource Leaks**: Detecting memory leaks and resource exhaustion
- **Optimization Opportunities**: Suggesting performance improvements

### 5. Security Vulnerability Expert
**Perspective: Security Analyst**

Security-focused debugging analysis:
- **Vulnerability Patterns**: Checking if error indicates security vulnerability
- **Injection Detection**: Identifying potential injection attack vectors
- **Authentication Issues**: Debugging authentication and authorization problems
- **Data Exposure**: Checking for unintended data exposure in errors

## Intelligent Debugging Features

### Time-Travel Debugging
```bash
# Compare system state before and after issue appeared
!git diff HEAD~10 HEAD -- "*.js" "*.ts" | grep -A5 -B5 "$ARGUMENTS"

# Identify exact commit that introduced issue
!git bisect start
!git bisect bad HEAD
!git bisect good HEAD~20
```

### Error Pattern Learning
```json
{
  "error_signature": "$ARGUMENTS",
  "root_causes": [
    {
      "cause": "dependency_version_mismatch",
      "probability": 0.82,
      "solution": "npm install && npm audit fix",
      "success_rate": 0.91
    },
    {
      "cause": "configuration_error",
      "probability": 0.65,
      "solution": "check .env variables",
      "success_rate": 0.88
    }
  ],
  "similar_errors": [
    {
      "error": "similar_error_pattern",
      "solution": "previous_successful_fix",
      "date": "2025-06-15",
      "fixed_by": "team_member"
    }
  ]
}
```

### Predictive Fix Suggestions
Based on error analysis and historical patterns:

1. **Most Likely Fix** (85% confidence)
   - Root cause: [Predicted cause]
   - Solution: [Specific fix steps]
   - Validation: [How to verify fix works]

2. **Alternative Fix** (65% confidence)
   - Root cause: [Alternative cause]
   - Solution: [Alternative approach]
   - Risk: [Potential side effects]

3. **Preventive Measures**
   - Add test: [Specific test to prevent recurrence]
   - Monitor: [Metrics to watch]
   - Document: [Pattern to add to knowledge base]

## Debug Execution Plan

### Phase 1: Immediate Diagnosis
```bash
# Collect error context
!echo "=== Error Context Collection ==="
!grep -r "$ARGUMENTS" . --include="*.log" --include="*.txt" 2>/dev/null | head -20

# Check recent changes
!echo "=== Recent Changes Analysis ==="
!git log --oneline --since="2 days ago" --grep="$ARGUMENTS"

# Verify dependencies
!echo "=== Dependency Check ==="
!npm ls 2>&1 | grep -i "error\|warning" | head -10
```

### Phase 2: Pattern Matching & Analysis
```bash
# Search error pattern database
!echo "=== Historical Pattern Matching ==="
!test -f docs/features/errors/PATTERNS.md && grep -A10 -B5 "$ARGUMENTS" docs/features/errors/PATTERNS.md

# Check learning module for similar issues
!echo "=== Learning Module Analysis ==="
!find .claude/learning/failures -name "*.json" -exec grep -l "$ARGUMENTS" {} \; 2>/dev/null
```

### Phase 3: Solution Implementation
```bash
# Apply most likely fix
!echo "=== Applying Predicted Fix ==="
# [Automated fix implementation based on pattern matching]

# Validate fix
!echo "=== Fix Validation ==="
!npm test 2>/dev/null || echo "Tests still failing - trying alternative fix"

# Update pattern database
!echo "=== Pattern Database Update ==="
!echo "\n### $(date): $ARGUMENTS\n- Root Cause: [identified cause]\n- Solution: [applied fix]\n- Success: [yes/no]\n" >> docs/features/errors/PATTERNS.md
```

## Debug Intelligence Dashboard

### Current Error Analysis
- **Error Type**: [Classification of error type]
- **Severity**: [Critical/High/Medium/Low]
- **Frequency**: [How often this error occurs]
- **Impact**: [Number of affected components]

### Historical Context
- **Previous Occurrences**: [Times this error appeared before]
- **Success Rate**: [Historical fix success rate]
- **Average Fix Time**: [Historical time to resolution]
- **Common Causes**: [Top 3 historical causes]

### Predictive Insights
- **Recurrence Probability**: [Likelihood of error recurring]
- **Related Issues**: [Other issues that might appear]
- **Prevention Strategy**: [How to prevent future occurrences]
- **Testing Recommendations**: [Tests to add]

## Learning Integration

### Outcome Tracking
```bash
# Track debugging outcome
/project:feedback --debug-session --error="$ARGUMENTS" --solution="[applied fix]" --success=true

# Update team knowledge
/project:share --debug-pattern --error="$ARGUMENTS" --solution="[successful fix]"
```

### Pattern Evolution
- **Success Patterns**: Solutions that consistently work
- **Failure Patterns**: Approaches that don't work
- **Team Patterns**: How different team members solve similar issues
- **Technology Patterns**: Framework-specific debugging approaches

---

**Debug Session Ready!** Intelligent debugging with pattern recognition, predictive solutions, and continuous learning enabled. The system will learn from this debugging session to improve future error resolution.