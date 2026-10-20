import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { processOptions } from './processOptions'

describe('processOptions', () => {
  const originalOS = Platform.OS

  afterEach(() => {
    Platform.OS = originalOS
  })

  it('disables streaming on Android and keeps polling', () => {
    Platform.OS = 'android'
    const info = jest.fn()

    expect(
      processOptions({ streamEnabled: true, pollingEnabled: false, logger: { info } })
    ).toEqual({
      streamEnabled: false,
      pollingEnabled: false,
      logger: { info },
      cache: false
    })
    expect(info).toHaveBeenCalled()
  })

  it('uses console when Android has no logger', () => {
    Platform.OS = 'android'
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined)

    expect(processOptions({})).toMatchObject({
      streamEnabled: false,
      pollingEnabled: true,
      cache: false
    })

    info.mockRestore()
  })

  it('leaves streaming unchanged when it is already disabled', () => {
    Platform.OS = 'android'

    expect(processOptions({ streamEnabled: false })).toEqual({
      streamEnabled: false,
      cache: false
    })
  })

  it('leaves non-Android options unchanged', () => {
    Platform.OS = 'ios'

    expect(processOptions({ streamEnabled: true })).toEqual({
      streamEnabled: true,
      cache: false
    })
  })

  it('uses AsyncStorage when cache is enabled without storage', () => {
    expect(processOptions({ cache: true }).cache).toEqual({ storage: AsyncStorage })
    expect(processOptions({ cache: { ttl: 10 } }).cache).toEqual({
      ttl: 10,
      storage: AsyncStorage
    })
  })

  it('keeps a caller-supplied cache storage', () => {
    const storage = { getItem: jest.fn() }

    expect(processOptions({ cache: { storage } }).cache).toEqual({ storage })
  })
})
