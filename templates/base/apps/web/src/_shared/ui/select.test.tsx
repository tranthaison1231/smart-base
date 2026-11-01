import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"

it("selects an option using the keyboard", async () => {
  const user = userEvent.setup()
  render(
    <Select
      items={[
        { label: "Hà Nội", value: "hanoi" },
        { label: "Đà Nẵng", value: "danang" },
      ]}
    >
      <SelectTrigger aria-label="Location">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cities</SelectLabel>
          <SelectItem value="hanoi">Hà Nội</SelectItem>
          <SelectSeparator />
          <SelectItem value="danang">Đà Nẵng</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>,
  )
  await user.tab()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("listbox")).toBeInTheDocument()
  await user.keyboard("{ArrowDown}{Enter}")
  expect(screen.getByRole("combobox", { name: "Location" })).not.toHaveTextContent("Choose")
})
