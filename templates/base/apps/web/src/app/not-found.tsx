import Link from "next/link"

import { buttonVariants } from "@/_shared/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted-foreground">The page you are looking for could not be found.</p>
      <Link className={buttonVariants({ className: "mt-6 w-fit" })} href="/">
        Back to home
      </Link>
    </main>
  )
}
