import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { CityGuideCTA } from "../CityGuideCTA"

describe("Search page empty state", () => {
  it(`renders correctly`, async () => {
    const tree = renderWithWrappers(<CityGuideCTA />)
    expect(extractText(tree.root)).toContain("Explore art on view")
    expect(tree.root.findAllByType(Image)).toHaveLength(2)
  })

  it(`navigates to cityGuide link`, () => {
    const tree = renderWithWrappers(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/local-discovery")
  })
})
