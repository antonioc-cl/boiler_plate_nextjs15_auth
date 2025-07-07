# @generate-context

Generate integration context for adding features to existing project.

## Usage
```
@generate-context
```

## Actions
1. Create integration guidelines
2. Document existing patterns to follow
3. Identify modification points
4. Generate compatibility checklist
5. Create integration plan

## Template

Generating integration context for the existing project.

## Integration Context Document

### Project Integration Guidelines

#### Code Style Guide
```typescript
// Follow these patterns:

// 1. Component Structure
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Existing pattern
};

// 2. Service Pattern
export class ServiceName {
  constructor(private dependency: Dependency) {}
  
  async methodName(): Promise<ReturnType> {
    // Existing pattern
  }
}

// 3. API Route Pattern
router.post('/resource', authenticate, async (req, res) => {
  // Existing pattern
});
```

#### File Naming Conventions
- Components: `ComponentName.tsx`
- Services: `service-name.service.ts`
- Tests: `*.test.ts` or `*.spec.ts`
- Styles: `*.module.css` or `*.styled.ts`

### Integration Points Map

#### 1. Adding New Features
```
src/features/{feature-name}/
├── index.ts              # Public exports
├── {Feature}.tsx         # Main component
├── {Feature}.service.ts  # Business logic
├── {Feature}.types.ts    # Type definitions
├── {Feature}.test.tsx    # Tests
└── styles.module.css     # Styles
```

#### 2. Extending Existing Features
- Locate feature in: `src/features/[existing-feature]/`
- Add new functionality following existing patterns
- Update tests in same directory
- Maintain backwards compatibility

#### 3. API Integration
```typescript
// Add to src/api/endpoints.ts
export const featureEndpoints = {
  getItems: () => api.get('/items'),
  createItem: (data: Item) => api.post('/items', data),
};
```

### State Management Integration
```typescript
// If using Redux/Context
// Add to store/slices/{feature}Slice.ts
export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Actions
  },
});

// If using local state
// Follow existing useState patterns
```

### Database/Model Integration
```typescript
// Add to models/{Feature}.model.ts
export interface FeatureModel {
  id: string;
  // Match existing model patterns
}

// Add migrations if needed
// migrations/YYYYMMDD-add-feature.ts
```

### Testing Integration
```typescript
// Match existing test patterns
describe('Feature', () => {
  // Setup following existing patterns
  beforeEach(() => {
    // Existing setup pattern
  });

  it('should follow existing test style', () => {
    // Test implementation
  });
});
```

### Build System Integration
1. **Import Paths**: Use existing alias patterns
2. **Environment Variables**: Add to `.env.example`
3. **Build Config**: Update if adding new file types
4. **Dependencies**: Add to correct section in package.json

### Git Workflow
1. Branch naming: `feature/description` or `fix/description`
2. Commit style: [Conventional/Custom]
3. PR template: Use existing if available

### Compatibility Checklist
- [ ] Follows existing code patterns
- [ ] Uses established naming conventions
- [ ] Integrates with current state management
- [ ] Maintains existing API contracts
- [ ] Includes tests matching current style
- [ ] Updates relevant documentation
- [ ] No breaking changes to existing features
- [ ] Performance impact assessed

### Common Pitfalls to Avoid
1. **Don't**: Create new patterns without discussion
2. **Don't**: Break existing API contracts
3. **Don't**: Ignore existing test patterns
4. **Don't**: Add conflicting dependencies
5. **Don't**: Bypass existing middleware/guards

### Integration Workflow
1. Create feature branch
2. Follow existing patterns
3. Add to existing structure
4. Maintain compatibility
5. Test with existing features
6. Update documentation
7. Submit PR following guidelines

Context generated. Ready to adapt workflow for this project.

## Notes
- Ensures seamless integration
- Prevents architecture conflicts
- Maintains code consistency