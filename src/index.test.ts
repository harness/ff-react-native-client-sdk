import {
  FFContext,
  FFContextProvider,
  ifFeatureFlag,
  useFeatureFlag,
  useFeatureFlags,
  useFeatureFlagsClient,
  useFeatureFlagsLoading,
  withFeatureFlags,
  withFeatureFlagsClient
} from './index'

describe('public exports', () => {
  it('re-exports the provider and client helpers', () => {
    const Component = () => null

    expect(FFContext).toBeDefined()
    expect(FFContextProvider).toBeDefined()
    expect(useFeatureFlag()).toBeUndefined()
    expect(useFeatureFlags()).toEqual({})
    expect(useFeatureFlagsLoading()).toBe(false)
    expect(useFeatureFlagsClient()).toBeUndefined()
    expect(ifFeatureFlag()).toBeNull()
    expect(withFeatureFlags(Component)).toBe(Component)
    expect(withFeatureFlagsClient(Component)).toBe(Component)
  })
})
