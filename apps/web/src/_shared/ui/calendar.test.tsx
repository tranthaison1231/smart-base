import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Calendar } from "./calendar"

describe("Calendar", () => {
  it("moves DOM focus to the next day with ArrowRight", async () => {
    const user = userEvent.setup()
    const firstDate = new Date(2025, 9, 1)
    const secondDate = new Date(2025, 9, 2)
    const dayButton = (date: Date) =>
      document.querySelector<HTMLButtonElement>(
        `button[data-day="${date.toLocaleDateString()}"]`,
      )

    render(<Calendar mode="single" defaultMonth={firstDate} today={firstDate} />)

    const first = dayButton(firstDate)
    const second = dayButton(secondDate)
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()

    await user.click(first!)
    await user.keyboard("{ArrowRight}")

    expect(second).toHaveFocus()
  })
})
