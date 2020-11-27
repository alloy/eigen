import { FairBooth_show } from "__generated__/FairBooth_show.graphql"
import { navigate } from "lib/navigation/navigate"
import { Schema, screenTrack } from "lib/utils/track"
import { Box, Separator, Theme } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { FairBoothQuery } from "__generated__/FairBoothQuery.graphql"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "lib/Components/Show/ShowArtistsPreview"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "lib/Components/Show/ShowArtworksPreview"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { FairBoothHeaderContainer as FairBoothHeader } from "../Components/FairBoothHeader"

type Item =
  | {
      type: "artworks"
      data: { show: FairBooth_show; onViewAllArtworksPressed: () => void }
    }
  | {
      type: "artists"
      data: { show: FairBooth_show; onViewAllArtistsPressed: () => void }
    }

interface State {
  sections: Item[]
}

interface Props {
  show: FairBooth_show
}

@screenTrack<Props>((props) => ({
  context_screen: Schema.PageNames.FairBoothPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.show.slug,
  context_screen_owner_id: props.show.internalID,
}))
export class FairBooth extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  onViewFairBoothArtworksPressed() {
    navigate(`/show/${this.props.show.slug}/artworks`)
  }

  onViewFairBoothArtistsPressed() {
    navigate(`/show/${this.props.show.slug}/artists`)
  }

  componentDidMount() {
    const { show } = this.props
    const sections = []

    sections.push({
      type: "artworks",
      data: {
        show,
        onViewAllArtworksPressed: this.onViewFairBoothArtworksPressed.bind(this),
      },
    })

    sections.push({
      type: "artists",
      data: {
        show,
        onViewAllArtistsPressed: this.onViewFairBoothArtistsPressed.bind(this),
      },
    })
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.setState({ sections })
  }

  renderItem = ({ item }: { item: Item }) => {
    switch (item.type) {
      case "artworks":
        return <ShowArtworksPreview {...item.data} />
      case "artists":
        return <ShowArtistsPreview {...item.data} />
      default:
        return null
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  onTitlePressed = (partnerId) => {
    navigate(partnerId)
  }

  render() {
    const { sections } = this.state
    const { show } = this.props

    return (
      <Theme>
        <FlatList
          data={sections}
          ListHeaderComponent={<FairBoothHeader show={show} onTitlePressed={this.onTitlePressed} />}
          renderItem={(item) => (
            <Box px={2} py={2}>
              {this.renderItem(item)}
            </Box>
          )}
          ItemSeparatorComponent={() => {
            return (
              <Box px={2} pb={2} mt={2}>
                <Separator />
              </Box>
            )
          }}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Theme>
    )
  }
}

export const FairBoothContainer = createFragmentContainer(FairBooth, {
  show: graphql`
    fragment FairBooth_show on Show {
      slug
      internalID
      ...FairBoothHeader_show
      ...ShowArtworksPreview_show
      ...ShowArtistsPreview_show
    }
  `,
})

export const FairBoothQueryRenderer: React.FC<{ showID: string }> = ({ showID }) => (
  <QueryRenderer<FairBoothQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairBoothQuery($showID: String!) {
        show(id: $showID) {
          ...FairBooth_show
        }
      }
    `}
    variables={{ showID }}
    render={renderWithLoadProgress(FairBoothContainer)}
  />
)
