import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"

import ErrorPage from "./error"

it("shows a safe message and retries the failed route", async () => {
  const reset = vi.fn()
  const user = userEvent.setup()
  render(<ErrorPage error={new Error("sensitive detail")} reset={reset} />)

  expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument()
  expect(screen.queryByText("sensitive detail")).not.toBeInTheDocument()
  await user.click(screen.getByRole("button", { name: "Try again" }))
  expect(reset).toHaveBeenCalledOnce()
})
