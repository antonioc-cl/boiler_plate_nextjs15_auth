import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '@/lib/db'
import { sessions, users, type User } from '@/lib/db/schema'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { eq } from 'drizzle-orm'

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'session',
    expires: false, // Session cookies expire when browser closes
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      username: attributes.username,
      emailVerified: attributes.emailVerified,
    }
  },
})

// IMPORTANT: Declare module augmentation
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  email: string
  username: string | null
  emailVerified: boolean
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null
    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const result = await lucia.validateSession(sessionId)
    // Next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        ;(await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        ;(await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
    } catch {}
    if (result.user && result.session) {
      // Fetch full user data from database
      const [fullUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, result.user.id))
        .limit(1)
      if (!fullUser) {
        return { user: null, session: null }
      }
      return {
        user: fullUser,
        session: result.session as Session,
      }
    }
    return { user: null, session: null }
  }
)

export type Session = {
  id: string
  userId: string
  expiresAt: Date
  fresh: boolean
}
