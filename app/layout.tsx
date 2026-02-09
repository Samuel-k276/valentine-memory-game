import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lora } from 'next/font/google'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'Patootie Valentine',
  description: 'A Valentine\'s Day memory game',
  icons: {
    icon: '/Screenshot 2026-02-09 214544.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#c23a6b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} font-serif antialiased`}>{children}</body>
    </html>
  )
}
