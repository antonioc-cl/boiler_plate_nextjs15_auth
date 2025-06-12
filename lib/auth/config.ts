// Authentication configuration placeholder
// This file will contain your auth setup (e.g., Lucia Auth configuration)

export const authConfig = {
  sessionCookieName: process.env.AUTH_SESSION_COOKIE_NAME || 'auth-session',
  sessionExpiryDays: parseInt(process.env.AUTH_SESSION_EXPIRY_DAYS || '30'),
  secret: process.env.AUTH_SECRET!,
}

// Example: Export your auth instance
// export const lucia = new Lucia(...);
