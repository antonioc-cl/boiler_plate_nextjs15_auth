import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmailVerificationBanner } from './email-verification-banner'

export default async function DashboardPage() {
  const userResult = await getCurrentUser()

  if (!userResult.success || !userResult.user) {
    redirect('/login')
  }

  const user = userResult.user

  return (
    <div className="container mx-auto py-8">
      {!user.emailVerified &&
        process.env.EMAIL_VERIFICATION_REQUIRED === 'true' && (
          <EmailVerificationBanner />
        )}

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>{user.username || user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email:</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email Verified:</dt>
                <dd>{user.emailVerified ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-1">Active users</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-2">Growth</h3>
          <p className="text-3xl font-bold">0%</p>
          <p className="text-sm text-muted-foreground mt-1">Since last month</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg border">
          <div className="p-6">
            <p className="text-muted-foreground">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
