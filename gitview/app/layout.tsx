import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "../components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GitHub Code Visualizer",
  description: "Visualize code relationships in your GitHub repositories",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

