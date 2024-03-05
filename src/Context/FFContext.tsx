import { FC } from 'react'
import { Text } from 'react-native'
import { FFContextProvider as FFReactContextProvider } from '@harnessio/ff-react-client-sdk'
import type { FFContextProviderProps } from './types'
import { processOptions } from './processOptions'

export const FFContextProvider: FC<FFContextProviderProps> = ({
  options = {},
  ...props
}) => {
  const processedOptions = processOptions(options)

  return (
    <FFReactContextProvider
      options={processedOptions}
      fallback={<Text>Loading...</Text>}
      {...props}
    />
  )
}
