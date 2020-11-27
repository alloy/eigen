// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount, shallow } from "enzyme"
import { Sans } from "palette"
import React from "react"
import { Header } from "../OtherWorks/Header"
import { OtherWorksFragmentContainer as OtherWorks } from "../OtherWorks/OtherWorks"

import { navigate } from "lib/navigation/navigate"
import { TouchableWithoutFeedback } from "react-native"

describe("OtherWorks", () => {
  it("renders no grids if there are none provided", () => {
    const noGridsArtworkProps = {
      contextGrids: null,
      " $fragmentRefs": null,
    }
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const component = shallow(<OtherWorks artwork={noGridsArtworkProps} />)
    expect(component.find(Header).length).toEqual(0)
  })

  it("renders no grids if an empty array is provided", () => {
    const noGridsArtworkProps = { contextGrids: [], " $fragmentRefs": null }
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const component = shallow(<OtherWorks artwork={noGridsArtworkProps} />)
    expect(component.find(Header).length).toEqual(0)
  })

  it("renders the grid if one is provided", () => {
    const oneGridArtworkProps = {
      contextGrids: [
        {
          title: "Other works by Andy Warhol",
          ctaTitle: "View all works by Andy Warhol",
          ctaHref: "/artist/andy-warhol",
          artworks: {
            edges: [
              {
                node: {
                  id: "artwork1",
                },
              },
            ],
          },
        },
      ],
      " $fragmentRefs": null,
    }
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const component = mount(<OtherWorks artwork={oneGridArtworkProps} />)
    expect(component.find(Header).length).toEqual(1)
    expect(component.find(Sans).first().text()).toEqual("Other works by Andy Warhol")
    component.find(TouchableWithoutFeedback).props().onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("renders the grids if multiple are provided", () => {
    const oneGridArtworkProps = {
      contextGrids: [
        {
          title: "Other works by Andy Warhol",
          ctaTitle: "View all works by Andy Warhol",
          ctaHref: "/artist/andy-warhol",
          artworks: { edges: [{ node: { id: "artwork1" } }] },
        },
        {
          title: "Other works from Gagosian Gallery",
          ctaTitle: "View all works from Gagosian Gallery",
          ctaHref: "/gagosian-gallery",
          artworks: { edges: [{ node: { id: "artwork1" } }] },
        },
      ],
      " $fragmentRefs": null,
    }
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const component = mount(<OtherWorks artwork={oneGridArtworkProps} />)
    expect(component.find(Header).length).toEqual(2)
    expect(component.find(Sans).first().text()).toEqual("Other works by Andy Warhol")
    expect(component.find(Sans).last().text()).toEqual("View all works from Gagosian Gallery")

    component.find(TouchableWithoutFeedback).first().props().onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")

    component.find(TouchableWithoutFeedback).last().props().onPress()
    expect(navigate).toHaveBeenCalledWith("/gagosian-gallery")
  })

  it("renders only grids with artworks", () => {
    const oneGridArtworkProps = {
      contextGrids: [
        {
          title: "Other works by Andy Warhol",
          ctaTitle: "View all works by Andy Warhol",
          ctaHref: "/artist/andy-warhol",
          artworks: { edges: [{ node: { id: "artwork1" } }] },
        },
        {
          title: "Other works from Gagosian Gallery",
          ctaTitle: "View all works from Gagosian Gallery",
          ctaHref: "/gagosian-gallery",
          artworks: null,
        },
        {
          title: "Other works from Gagosian Gallery at Art Basel 2019",
          ctaTitle: "View all works from the booth",
          ctaHref: "/show/gagosian-gallery-at-art-basel-2019",
          artworks: { edges: [] },
        },
      ],
      " $fragmentRefs": null,
    }
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const component = mount(<OtherWorks artwork={oneGridArtworkProps} />)
    expect(component.find(Header).length).toEqual(1)
    expect(component.find(Sans).first().text()).toEqual("Other works by Andy Warhol")
  })
})
