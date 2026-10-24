import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  it("exposes its label and disabled state to assistive technology", () => {
    render(
      <>
        <Button>Save changes</Button>
        <Button disabled>Saving</Button>
      </>,
    )

    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled()
    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled()
  })
})
