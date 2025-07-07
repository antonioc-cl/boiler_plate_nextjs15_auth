# @analyze-existing

Analyze an existing codebase to understand structure, patterns, and integration points.

## Usage
```
@analyze-existing
```

## Actions
1. Scan project structure
2. Identify architecture patterns
3. Analyze dependencies
4. Understand coding standards
5. Find integration points

## Template

I'll analyze the existing project structure and codebase.

## Existing Project Analysis

### Project Overview
- **Name**: [Project name from package.json/config]
- **Type**: [Web app/API/Library/etc]
- **Language**: [Primary language]
- **Framework**: [Main framework]

### Directory Structure
```
project/
├── src/               # Main source code
│   ├── components/    # UI components
│   ├── services/      # Business logic
│   ├── models/        # Data models
│   └── utils/         # Helper functions
├── tests/             # Test files
├── config/            # Configuration
└── docs/              # Documentation
```

### Technology Stack
1. **Frontend**
   - Framework: [React/Vue/Angular/etc]
   - State Management: [Redux/Vuex/etc]
   - Styling: [CSS/SCSS/Styled-components]
   
2. **Backend**
   - Runtime: [Node.js/Python/etc]
   - Framework: [Express/Django/etc]
   - Database: [PostgreSQL/MongoDB/etc]

### Code Patterns Detected
1. **Architecture**: [MVC/MVVM/Microservices/etc]
2. **Design Patterns**:
   - [Pattern 1]: Used in [location]
   - [Pattern 2]: Used in [location]
3. **Naming Conventions**:
   - Files: [camelCase/kebab-case/etc]
   - Classes: [PascalCase/etc]
   - Functions: [camelCase/etc]

### Dependencies Analysis
```json
Key Dependencies:
- Framework: version
- Major Library 1: version
- Major Library 2: version
```

Development Dependencies:
- Testing: [Jest/Mocha/etc]
- Building: [Webpack/Vite/etc]
- Linting: [ESLint/Prettier/etc]

### Current Features
1. **Authentication**: [Implemented/Not found]
2. **API Layer**: [REST/GraphQL/None]
3. **Data Management**: [State pattern]
4. **UI Components**: [Component library]

### Integration Points
1. **For New Features**:
   - Add to: `src/features/`
   - Register in: `src/routes`
   - Update: `src/index`

2. **For API Endpoints**:
   - Add to: `src/api/`
   - Middleware: `src/middleware/`
   - Routes: `src/routes/`

3. **For UI Components**:
   - Add to: `src/components/`
   - Styles: `src/styles/`
   - Tests: `tests/components/`

### Code Quality Observations
- **Test Coverage**: [X%]
- **Documentation**: [Good/Needs work]
- **Type Safety**: [TypeScript/PropTypes/None]
- **Code Style**: [Consistent/Inconsistent]

### Potential Challenges
1. **Legacy Code**: [Areas that need refactoring]
2. **Technical Debt**: [Known issues]
3. **Missing Features**: [Gaps identified]

### Recommended Approach
1. Follow existing patterns for consistency
2. Add new features in designated directories
3. Maintain current naming conventions
4. Use established testing patterns
5. Update documentation as you go

Analysis complete. Ready to generate integration context.

## Notes
- Understanding existing patterns prevents conflicts
- Identifies best integration approach
- Maintains codebase consistency