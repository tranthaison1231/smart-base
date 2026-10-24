import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import Page from "./page"

describe("starter home page", () => {
  it("renders the starter heading", () => {
    render(<Page />)

    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 1, name: "Smart Base" }),
    ).toBeInTheDocument()
  })
})
