import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"

import NotFound from "./not-found"

it("shows a not found message and a link home", () => {
  render(<NotFound />)

  expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/")
})
