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
  title: 'A Special Game For You',
  description: 'A Valentine\'s Day memory game made with love',
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
