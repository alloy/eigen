import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

export type RelayMockEnvironment = ReturnType<typeof createMockEnvironment>

export const mockEnvironmentPayload = (mockEnvironment: RelayMockEnvironment, mockResolvers?: MockResolvers) => {
  mockEnvironment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, mockResolvers)
  )
}
