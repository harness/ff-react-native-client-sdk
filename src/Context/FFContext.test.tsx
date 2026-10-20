import { render, screen } from '@testing-library/react'
import { Platform } from 'react-native'
import { FFContextProvider } from './FFContext'

describe('FFContextProvider', () => {
  it('passes processed options to the React SDK provider', () => {
    Platform.OS = 'ios'

    render(<FFContextProvider apiKey="sdk-key" />)

    expect(screen.getByText('Loading...')).toBeTruthy()
    expect(
      JSON.parse(document.querySelector('[data-options]')?.getAttribute('data-options') || '{}')
    ).toEqual({ cache: false })
  })
})
