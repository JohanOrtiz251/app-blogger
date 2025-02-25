import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"  // 🔹 Importando Toaster desde sonner

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Content Automation Platform",
  description: "RSS to Blog Automation with AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" richColors /> {/* 🔹 Toaster de Sonner */}
        </ThemeProvider>
      </body>
    </html>
  )
}
