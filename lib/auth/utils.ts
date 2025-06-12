import { lucia } from './index'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { hash, verify } from '@node-rs/argon2'

// Password hashing configuration
const hashingConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, hashingConfig)
}

export async function verifyPassword(
  hashedPassword: string,
  password: string
): Promise<boolean> {
  return verify(hashedPassword, password, hashingConfig)
}

export async function createUser(
  email: string,
  password: string,
  username?: string
) {
  const hashedPassword = await hashPassword(password)
  const userId = generateId(15)

  try {
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: email.toLowerCase(),
        username,
        hashedPassword,
      })
      .returning()

    return user
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      // Unique constraint violation
      throw new Error('Email or username already exists')
    }
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const validPassword = await verifyPassword(user.hashedPassword, password)
  if (!validPassword) {
    throw new Error('Invalid email or password')
  }

  const session = await lucia.createSession(user.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  ;(await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return { user, session }
}

export async function signOut() {
  const { session } = await lucia.validateSession(
    (await cookies()).get(lucia.sessionCookieName)?.value ?? ''
  )
  if (!session) {
    return redirect('/login')
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  ;(await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return redirect('/login')
}
