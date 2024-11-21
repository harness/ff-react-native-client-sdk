import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import {
  FFContextProvider,
  useFeatureFlag,
  useFeatureFlags
} from '@harnessio/ff-react-native-client-sdk'

export default function App() {
  return (
      <View style={styles.container}>
        <FFContextProvider
            apiKey="" // <- add your api key for the test environment
            target={{
              identifier: 'target1', // <- replace with an identifier unique to the user, e.g. email or UUID
              name: 'target1' // <- replace with a name unique t o the user
            }}
            asyncMode={true}
            options={{cache: true, debug: true, streamEnabled: false, pollingEnabled: true}}
        >

          { <MultipleFeatureFlags />}
        </FFContextProvider>

        <StatusBar style="auto" />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%'
  }
})

function SingleFeatureFlag() {
  const flagValue = useFeatureFlags(['harnessappdemodarkmode', 'harnessappdemodarkmode','harnessappdemodarkmode','harnessappdemodarkmode','harnessappdemodarkmode'])

  return (
      <Text>The value of "harnessappdemodarkmode" is {JSON.stringify(flagValue)}</Text>
  )
}

function MultipleFeatureFlags() {
  const flags = useFeatureFlags(['boolflagwith12groups', 'stringflagwith12groups','numberflagnogrouprule','jsonflagnogrouprule','numberflag'])

  return (
      <>
        <Text>Here are all our flags:</Text>
        <Text>{JSON.stringify(flags, null, 2)}</Text>
      </>
  )
}
