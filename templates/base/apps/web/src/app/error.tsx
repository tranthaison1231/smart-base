"use client"

import { Button } from "@/_shared/ui/button"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground">Please try again.</p>
      <Button className="mt-6 w-fit" onClick={reset}>
        Try again
      </Button>
    </main>
  )
}
