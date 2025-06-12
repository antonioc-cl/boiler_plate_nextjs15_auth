'use server'

import { revalidatePath } from 'next/cache'

export async function exampleServerAction(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get('name') as string

    // Validate input
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: 'Name is required',
      }
    }

    // In a real app, you would perform database operations here
    // For example: await db.insert(users).values({ name })

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the path if needed
    revalidatePath('/dashboard')

    return {
      success: true,
      message: `Hello, ${name}!`,
    }
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
