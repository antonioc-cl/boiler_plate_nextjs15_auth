import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hash, verify } from '@node-rs/argon2'
import { auth } from './better-auth'
import { headers } from 'next/headers'
import { nanoid } from 'nanoid'

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
  const userId = nanoid(15)

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
  const result = await auth.api.signInEmail({
    body: {
      email: email.toLowerCase(),
      password,
    },
    headers: await headers(),
  })

  if (!result) {
    throw new Error('Invalid email or password')
  }

  return result
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  })

  return redirect('/sign-in')
}

// Generate a unique ID (Better Auth compatible)
export function generateId(length: number = 15): string {
  return nanoid(length)
}
