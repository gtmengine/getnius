import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
