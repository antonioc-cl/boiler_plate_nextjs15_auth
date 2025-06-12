export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Next.js 15 Production Boilerplate
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          A production-ready starter template with TypeScript, authentication,
          and best practices.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 text-sm">
              <li>✓ Next.js 15 with App Router</li>
              <li>✓ TypeScript with strict mode</li>
              <li>✓ ESLint + Prettier configured</li>
              <li>✓ Production-ready structure</li>
              <li>✓ Security headers configured</li>
            </ul>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <ol className="space-y-2 text-sm">
              <li>1. Copy .env.example to .env</li>
              <li>2. Install dependencies: pnpm install</li>
              <li>3. Run development server: pnpm dev</li>
              <li>4. Start building your app!</li>
            </ol>
          </div>
        </div>
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
