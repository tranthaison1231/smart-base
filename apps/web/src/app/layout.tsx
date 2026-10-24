import type { Metadata } from "next"
import type { ReactNode } from "react"

import { AppProviders } from "@/_app/providers"

import "./globals.css"

export const metadata: Metadata = {
  title: "Smart Base",
  description: "Starter repository for product applications.",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className="dark">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
