import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Projeto C3 - Prisma e Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
