import type { Metadata } from 'next'
import './globals.css'
import SessionProviderWrapper from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'Getnius',
  description: 'Getnius — a market research intelligence platform'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}
