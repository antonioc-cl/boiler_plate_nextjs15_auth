import { signOut } from '@/lib/auth/middleware-helpers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await signOut()

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch {
    // Logout error occurred

    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    )
  }
}
