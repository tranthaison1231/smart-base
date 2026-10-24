import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

describe("ToggleGroup", () => {
  it("uses vertical arrow-key navigation when orientation is vertical", async () => {
    const user = userEvent.setup()

    render(
      <ToggleGroup aria-label="Display mode" orientation="vertical">
        <ToggleGroupItem value="first">First</ToggleGroupItem>
        <ToggleGroupItem value="second">Second</ToggleGroupItem>
      </ToggleGroup>,
    )

    const first = screen.getByRole("button", { name: "First" })
    const second = screen.getByRole("button", { name: "Second" })
    first.focus()

    await user.keyboard("{ArrowDown}")

    expect(second).toHaveFocus()
  })
})
