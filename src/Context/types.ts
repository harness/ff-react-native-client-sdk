import type { FFContextProviderProps as ReactSDKProviderProps } from '@harnessio/ff-react-client-sdk'

export type FFContextProviderProps = ReactSDKProviderProps
export type Options = ReactSDKProviderProps['options']
export type CacheOptions = Exclude<Options, undefined>['cache']
