export const FFContextProvider = ({
  options,
  fallback,
  children
}: {
  options?: unknown
  fallback?: unknown
  children?: unknown
}) => (
  <div data-options={JSON.stringify(options)}>
    {fallback as never}
    {children as never}
  </div>
)

export const FFContext = {}
export const useFeatureFlag = () => undefined
export const useFeatureFlags = () => ({})
export const useFeatureFlagsLoading = () => false
export const useFeatureFlagsClient = () => undefined
export const ifFeatureFlag = () => null
export const withFeatureFlags = (component: unknown) => component
export const withFeatureFlagsClient = (component: unknown) => component
