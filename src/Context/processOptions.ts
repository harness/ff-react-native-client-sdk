import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import type { CacheOptions, Options } from './types'

export function processOptions(options: Options): Options {
  return {
    ...processStreamingOptions(options),
    cache: processCacheOptions(options?.cache)
  }
}

function processStreamingOptions(options: Options): Options {
  if (
    (typeof options?.streamEnabled === 'undefined' || options.streamEnabled) &&
    Platform.OS === 'android'
  ) {
    const logger = options?.logger?.info ? options.logger : console
    logger.info(
      'SDKCODE:1007 Android React Native detected - streaming will be disabled and polling enabled'
    )

    return {
      ...options,
      streamEnabled: false,
      pollingEnabled: options?.pollingEnabled !== false
    }
  }

  return options
}

function processCacheOptions(cache: CacheOptions): CacheOptions {
  if (!cache) return false

  if (typeof cache === 'boolean') {
    return {
      storage: AsyncStorage
    }
  }

  if (!cache.storage) {
    return {
      ...cache,
      storage: AsyncStorage
    }
  }
}
