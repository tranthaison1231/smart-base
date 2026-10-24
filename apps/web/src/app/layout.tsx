import type { Metadata } from "next"
import type { ReactNode } from "react"

import { ThemeProvider } from "@/_shared/ui/theme-provider"
import { Toaster } from "@/_shared/ui/sonner"
import { TooltipProvider } from "@/_shared/ui/tooltip"

import "./globals.css"

export const metadata: Metadata = {
  title: "Smart Base",
  description: "Starter repository for product applications.",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className="dark">
      <body>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
