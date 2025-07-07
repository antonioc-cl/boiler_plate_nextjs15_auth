# Architecture Documentation

## Application Structure

### Route Organization
- **Public Routes**: Landing, auth pages
- **Protected Routes**: Dashboard, user settings
- **API Routes**: Health check, webhooks

### Data Flow
1. Client → Server Actions → Database
2. Authentication → Middleware → Route Protection
3. Email → React Email → Plunk → User

### Component Architecture
- **Layout Components**: Root layout, auth layout
- **UI Components**: Reusable button, input, etc.
- **Feature Components**: Auth forms, dashboard widgets
- **Server Components**: Data fetching, initial rendering

### State Management
- **Server State**: React Server Components + Server Actions
- **Client State**: React hooks for UI state
- **Auth State**: Better Auth session management
- **Form State**: React Hook Form (if needed)

## Security Implementation
- CSRF protection via Better Auth
- Content Security Policy headers
- Input validation on server actions
- SQL injection prevention via Drizzle ORM
- XSS protection via React's built-in escaping

## Performance Optimizations
- App Router for better performance
- Image optimization with Next.js Image
- Bundle optimization
- Database connection pooling
- CDN-ready static assets