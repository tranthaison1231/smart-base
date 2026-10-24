import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import RootLayout, { metadata } from "./layout"

describe("RootLayout", () => {
  it("exports starter metadata and renders the document shell with providers", () => {
    expect(metadata).toEqual({
      title: "Smart Base",
      description: "Starter repository for product applications.",
    })

    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Starter route content</main>
      </RootLayout>,
    )

    expect(markup).toContain('<html lang="vi" class="dark">')
    expect(markup).toContain("<body>")
    expect(markup).toContain("Starter route content")
    expect(markup).toContain('aria-label="Thông báo alt+T"')
  })
})
