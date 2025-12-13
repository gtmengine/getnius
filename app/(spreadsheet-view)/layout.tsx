import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Data Grid - Market Research Platform',
  description: 'Search and analyze market data with spreadsheet view',
}

export default function SpreadsheetLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      {/* Custom Layout Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Market Research Spreadsheet</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Search, filter, and analyze market data in real-time
              </p>
            </div>
            <nav className="flex items-center gap-4">
              <a 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto py-4">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          Market Research Platform © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

