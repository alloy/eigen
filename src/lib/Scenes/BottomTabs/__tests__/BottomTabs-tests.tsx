import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "lib/store/GlobalStore"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { useInterval } from "lib/utils/useInterval"
import React from "react"
import { NativeModules } from "react-native"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { BottomTabs } from "../BottomTabs"
import { BottomTabsButton } from "../BottomTabsButton"

jest.mock("lib/utils/useInterval")
jest.unmock("react-relay")
jest.mock("lib/relay/createEnvironment", () => {
  return { defaultEnvironment: require("relay-test-utils").createMockEnvironment() }
})
let mockRelayEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
beforeEach(() => {
  mockRelayEnvironment = require("lib/relay/createEnvironment").defaultEnvironment = createMockEnvironment()
})

function resolveUnreadConversationCountQuery(unreadConversationCount: number) {
  expect(mockRelayEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
    "BottomTabsModelFetchCurrentUnreadConversationCountQuery"
  )
  mockRelayEnvironment.mock.resolveMostRecentOperation((op) =>
    MockPayloadGenerator.generate(op, {
      Me() {
        return {
          unreadConversationCount,
        }
      },
    })
  )
}

const TestWrapper: React.FC<{}> = ({}) => {
  return (
    <GlobalStoreProvider>
      <BottomTabs />
    </GlobalStoreProvider>
  )
}

type ButtonProps = React.ComponentProps<typeof BottomTabsButton>

describe(BottomTabs, () => {
  it(`displays the current unread notifications count`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { unreadConversationCount: 4 } },
    })
    const tree = renderWithWrappers(<TestWrapper />)

    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")
    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(4)

    // need to prevent this test's requests from leaking into the next test
    await flushPromiseQueue()
  })

  it(`fetches the current unread conversation count on mount`, async () => {
    const tree = renderWithWrappers(<TestWrapper />)

    await flushPromiseQueue()

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)
    resolveUnreadConversationCountQuery(5)

    await flushPromiseQueue()

    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")

    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(5)
  })

  it(`sets the application icon badge count`, async () => {
    renderWithWrappers(<TestWrapper />)

    await flushPromiseQueue()

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)
    resolveUnreadConversationCountQuery(9)

    await flushPromiseQueue()

    expect(NativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber).toHaveBeenCalledWith(9)
  })

  it(`fetches the current unread conversation count once in a while`, async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    expect(useInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number))
    await flushPromiseQueue()

    resolveUnreadConversationCountQuery(1)

    const intervalCallback = (useInterval as jest.Mock).mock.calls[0][0]

    await flushPromiseQueue()
    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(0)
    intervalCallback()
    await flushPromiseQueue()
    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)

    resolveUnreadConversationCountQuery(3)

    await flushPromiseQueue()
    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")

    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(3)
  })
})
