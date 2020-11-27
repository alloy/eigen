import { navigate } from "lib/navigation/navigate"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { About } from "../About"

describe("About", () => {
  it("renders Terms and conditions", () => {
    const tree = renderWithWrappers(<About />)

    expect(tree.root.findAllByProps({ title: "Terms of Use" })).toBeTruthy()
    tree.root.findByProps({ title: "Terms of Use" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/terms", { modal: true })
  })

  it("renders Privacy policy", () => {
    const tree = renderWithWrappers(<About />)

    expect(tree.root.findAllByProps({ title: "Privacy Policy" })).toBeTruthy()
    tree.root.findByProps({ title: "Privacy Policy" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/privacy", { modal: true })
  })

  it("renders Version", () => {
    const tree = renderWithWrappers(<About />)

    expect(tree.root.findAllByProps({ title: "Version" })).toBeTruthy()
  })
})
