import { requireAuth } from '@/lib/auth/middleware-helpers'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if not authenticated
  const { user } = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Link href="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <Link href="/settings" className="hover:text-primary">
                Settings
              </Link>
              <LogoutButton />
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
