import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import RootLayout from "../app/_layout"
import Home from "../app/index"

vi.mock("react-native", () => ({ View: "div", Text: "span" }))
vi.mock("expo-router", () => ({ Slot: () => createElement("main", null, "Route content") }))

describe("mobile starter", () => {
  it("shows the starter screen", () => {
    expect(renderToStaticMarkup(createElement(Home))).toContain("Your mobile app is ready.")
  })

  it("renders its route outlet", () => {
    expect(renderToStaticMarkup(createElement(RootLayout))).toContain("Route content")
  })
})
