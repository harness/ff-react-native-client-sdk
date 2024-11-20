# React Native Client SDK For Harness Feature Flags

[![React version][react-badge]][reactjs]
[![React Native version][react-native-badge]][reactnative]
[![TypeScript version][ts-badge]][typescript-4-7]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]

Use this README to get started with our Feature Flags (FF) Client SDK for React Native. This guide outlines the basics
of getting started with the SDK and provides a full code sample for you to try out.

This sample doesn't include configuration options, for in depth steps and configuring the SDK, see
the [React Native Client SDK Reference](https://developer.harness.io/docs/feature-flags/ff-sdks/client-sdks/react-native-client).

## Requirements

To use this SDK, make sure you’ve:

- Installed Node.js v16 or a newer version
- Installed React.js v17 or a newer version

To follow along with our test code sample, make sure you’ve:

- [Created a Feature Flag on the Harness Platform](https://developer.harness.io/docs/feature-flags/ff-creating-flag/create-a-feature-flag/)
  called `harnessappdemodarkmode`
- [Created a client SDK key](https://developer.harness.io/docs/feature-flags/ff-creating-flag/create-a-project#create-an-sdk-key)
  and made a copy of it
- Created a project using [Expo](https://expo.dev/tools#cli)

```shell
npx create-expo-app my-demo-app
cd my-demo-app
npm install
```

## Installing the SDK

The first step is to install the FF SDK as a dependency in your application. To install using npm, use:

```shell
npm install @harnessio/ff-react-native-client-sdk
```

Or to install with yarn, use:

```shell
yarn add @harnessio/ff-react-native-client-sdk
```

## Code Sample

The following is a complete code example using Expo that you can use to test the `harnessappdemodarkmode` flag you
created on the Harness Platform. When you run the code it will:

- Render a loading screen
- Connect to the FF service
- Retrieve all flags
- Access a flag using the `useFeatureFlag` hook
- Access several flags using the `useFeatureFlags` hook

The following code can be placed in the `src/App.js` file.

```typescript jsx
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
        apiKey="YOUR_API_KEY"
        target={{
          identifier: 'YOUR_TARGET_IDENTIFIER', // <- replace with an identifier unique to the user, e.g. email or UUID
          name: 'YOUR TARGET NAME' // <- replace with a name unique to the user
        }}
      >
        <SingleFeatureFlag />
        <MultipleFeatureFlags />
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
  const flagValue = useFeatureFlag('harnessappdemodarkmode')

  return (
    <Text>The value of "harnessappdemodarkmode" is {JSON.stringify(flagValue)}</Text>
  )
}

function MultipleFeatureFlags() {
  const flags = useFeatureFlags()

  return (
    <>
      <Text>Here are all our flags:</Text>
      <Text>{JSON.stringify(flags, null, 2)}</Text>
    </>
  )
}
```

## Async mode

By default, the React Native Client SDK will block rendering of children until the initial load of feature flags has
completed. This ensures that children have immediate access to all flags when they are rendered. However, in some
circumstances it may be beneficial to immediately render the application and handle display of loading on a
component-by-component basis. The React Native Client SDK's asynchronous mode allows this by passing the
optional `asyncMode` prop when connecting with the `FFContextProvider`.

## Streaming and polling

By default, the React Native Client SDK will set up a stream to keep the feature flag values up-to-date when things
change in your Harness project. When a change is made in the Harness project, Harness will send an event to the SDK and
the SDK will serve the changed value. This is great when your application needs to change in near-real-time when a
feature flag changes (for example, your application might need to display a maintenance screen when the backend APIs are
being updated). However, in some circumstances, polling might be a better option. When streaming is disabled and polling
is enabled, the SDK will periodically poll for current feature flag values and keep your application up-to-date. By
default, the interval for polling is 60 seconds and can be adjusted to suit your application.

### Streaming

Streaming is enabled by default and can be disabled using the `streamEnabled` option and passing `false`. In the event
that the stream is interrupted, the SDK will attempt to reconnect automatically. If after a number of attempts the
stream cannot be re-established, the SDK will switch to polling unless specifically disabled using the `pollingEnabled`
option.

### Polling

Polling is disabled by default and can be enabled using the `pollingEnabled` option and passing `true`. When enabled,
the SDK will poll for feature flag value changes every 60 seconds, this can be adjusted using the `pollingInterval`
option and passing the number of milliseconds you want the SDK to wait between polling.

## Caching evaluations

In practice flags rarely change and so it can be useful to cache the last received evaluations from the server to allow
your application to get started as fast as possible. Setting the `cache` option as `true` or as an object (see interface
below) will allow the SDK to store its evaluations to `localStorage` and retrieve at startup. This lets the SDK get
started near instantly and begin serving flags, while it carries on authenticating and fetching up-to-date evaluations
from the server behind the scenes.

```typescript jsx
<FFContextProvider
  apiKey="YOUR_API_KEY"
  target={{
    identifier: 'YOUR_TARGET_IDENTIFIER',
    name: 'YOUR TARGET NAME'
  }}
  options={{
    cache: true
  }}
>
  <MyApp />
</FFContextProvider>
```

The `cache` option can also be passed as an object with the following options.

```typescript
interface CacheOptions {
  // maximum age of stored cache, in ms, before it is considered stale
  ttl?: number
  // storage mechanism to use, conforming to the Web Storage API standard, can be either synchronous or asynchronous
  // defaults to localStorage
  storage?: AsyncStorage | SyncStorage
}

interface SyncStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}
```

## Overriding the internal logger

By default, the React Client SDK will log errors and debug messages using the `console` object. In some cases, it
can be useful to instead log to a service or silently fail without logging errors.

```typescript jsx
const myLogger = {
  debug: (...data) => {
    // do something with the logged debug message
  },
  info: (...data) => {
    // do something with the logged info message
  },
  error: (...data) => {
    // do something with the logged error message
  },
  warn: (...data) => {
    // do something with the logged warning message
  }
}

return (
  <FFContextProvider
    apiKey="YOUR_API_KEY"
    target={{
      identifier: 'YOUR_TARGET_IDENTIFIER',
      name: 'YOUR TARGET NAME'
    }}
    options={{
      logger: myLogger
    }}
  >
    <MyApp />
  </FFContextProvider>
)
```

## Fast startup

By default, the React Native Client SDK will connect to the Harness Feature Flags service to get the current feature
flag values and then render your application. Using a combination of the `cache` option
(see [Caching evaluations](#caching-evaluations) above) and Async mode (see [Async mode](#async-mode) above), you can
instruct the SDK to instead render immediately using previously cached values (in the case of a returning user) or
default values (in the case of new users). The SDK will immediately render your application and asynchronously connect
to the Harness Feature Flags service to make sure the cached feature flag values are kept up-to-date.

```typescript jsx
<FFContextProvider
  asyncMode
  apiKey="YOUR_API_KEY"
  target={{
    identifier: 'YOUR_TARGET_IDENTIFIER',
    name: 'YOUR TARGET NAME'
  }}
  options={{
    cache: true
  }}
>
  <MyApp />
</FFContextProvider>
```

## API

### `FFContextProvider`

The `FFContextProvider` component is used to set up the React context to allow your application to access feature flags
using the `useFeatureFlag` and `useFeatureFlags` hooks
and `withFeatureFlags` [HOC](https://reactjs.org/docs/higher-order-components.html). At minimum, it requires
the `apiKey` you have set up in your Harness Feature Flags account, and the `target`. You can think of a `target` as a
user.

The `FFContextProvider` component also accepts an `options` object, a `fallback` component, an array
of `initialEvaluations`, an `onError` handler, and can be placed in [Async mode](#Async-mode) using the `asyncM` prop.
The `fallback` component will be displayed while the SDK is connecting and fetching your flags. The `initialEvaluations`
prop allows you pass an array of evaluations to use immediately as the SDK is authenticating and fetching flags.
The `onError` prop allows you to pass an event handler which will be called whenever a network error occurs.

```typescript jsx
import { Text } from 'react-native'
import { FFContextProvider } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  return (
    <FFContextProvider
      asyncMode={false} // OPTIONAL: whether or not to use async mode
      apiKey="YOUR_API_KEY" // your SDK API key
      target={{
        identifier: 'YOUR_TARGET_IDENTIFIER', // replace with a unique ID for the Target 
        name: 'YOUR TARGET NAME',  // replace with the unique name of the Target
        attributes: { // OPTIONAL: key/value pairs of attributes of the Target
          customAttribute: 'this is a custom attribute',
          anotherCustomAttribute: 'this is something else'
        }
      }}
      fallback={<Text>Loading...</Text>} // OPTIONAL: component to display when the SDK is connecting
      options={{ // OPTIONAL: advanced configuration options
        cache: false,
        baseUrl: 'https://url-to-access-flags.com',
        eventUrl: 'https://url-for-events.com',
        streamEnabled: true,
        debug: false,
        eventsSyncInterval: 60000,
        pollingEnabled: false,
        pollingInterval: 60000
      }}
      initialEvaluations={evals} // OPTIONAL: array of evaluations to use while fetching
      onError={handler} // OPTIONAL: event handler to be called on network error
    >
      <CompontToDisplayAfterLoad /> <!-- component to display when Flags are available -->
    </FFContextProvider>
  )
}
```

### `useFeatureFlag`

The `useFeatureFlag` hook returns a single named flag value. An optional second argument allows you to set what value
will be returned if the flag does not have a value. By default `useFeatureFlag` will return `undefined` if the flag
cannot be found.

> N.B. when rendered in [Async mode](#Async-mode), the default value will be returned until the flags are retrieved.
> Consider using the [useFeatureFlagsLoading hook](#usefeatureflagsloading) to determine when the SDK has finished
> loading.

```typescript jsx
import { Text } from 'react-native'
import { useFeatureFlag } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  const myFlagValue = useFeatureFlag('flagIdentifier', 'default value')

  return <Text>My flag value is: {myFlagValue}</Text>
}
```

### `useFeatureFlags`

The `useFeatureFlags` hook returns an object of flag identifier/flag value pairs. You can pass an array of flag
identifiers or an object of flag identifier/default value pairs. If an array is used and a flag cannot be found, the
returned value for the flag will be `undefined`. If no arguments are passed, all flags will be returned.

> N.B. when rendered in [Async mode](#Async-mode), the default value will be returned until the flags are retrieved.
> Consider using the [useFeatureFlagsLoading hook](#usefeatureflagsloading) to determine when the SDK has finished
> loading.

```typescript jsx
import { Text } from 'react-native'
import { useFeatureFlag } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  const myFlagValues = useFeatureFlags()

  return (
    <>
      <Text>My flag values are:</Text>
      <Text>{JSON.stringify(myFlagValues, null, 2)}</Text>
    </>
  )
}
```

#### Get a subset of Flags

```typescript jsx
const myFlagValues = useFeatureFlags(['flag1', 'flag2'])
```

#### Get a subset of Flags with custom default values

```typescript jsx
const myFlagValues = useFeatureFlags({
  flag1: 'defaultForFlag1',
  flag2: 'defaultForFlag2'
})
```

### `useFeatureFlagsLoading`

The `useFeatureFlagsLoading` hook returns a boolean value indicating whether the SDK is currently loading flags from the
server.

```typescript jsx
import { Text } from 'react-native'
import {
  useFeatureFlagsLoading,
  useFeatureFlags
} from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  const isLoading = useFeatureFlagsLoading()
  const flags = useFeatureFlags()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <>
      <Text>My flag values are:</Text>
      <Text>{JSON.stringify(flags, null, 2)}</Text>
    </>
  )
}
```

### `useFeatureFlagsClient`

The React Native Client SDK internally uses the Javascript Client SDK to communicate with Harness. Sometimes it can be
useful to be able to access the instance of the Javascript Client SDK rather than use the existing hooks or higher-order
components (HOCs). The `useFeatureFlagsClient` hook returns the current Javascript Client SDK instance that the React
Native Client SDK is using. This instance will be configured, initialized and have been hooked up to the various events
the Javascript Client SDK provides.

```typescript jsx
import { Text } from 'react-native'
import {
  useFeatureFlagsClient,
  useFeatureFlagsLoading
} from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  const client = useFeatureFlagsClient()
  const loading = useFeatureFlagsLoading()

  if (loading || !client) {
    return <Text>Loading...</Text>
  }

  return (
    <Text>
      My flag value is: {client.variation('flagIdentifier', 'default value')}
    </Text>
  )
}
```

### `ifFeatureFlag`

The `ifFeatureFlag` higher-order component (HOC) wraps your component and conditionally renders only when the named flag
is enabled or matches a specific value.

```typescript jsx
import { Text } from 'react-native'
import { ifFeatureFlag } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  return <Text>This should render if the flag is on</Text>
}

const MyConditionalComponent = ifFeatureFlag('flag1')(MyComponent)
```

You can then use `MyConditionalComponent` as a normal component, and only render if `flag1`'s value is truthy.

#### Conditionally with a specific value

```typescript jsx
import { Text } from 'react-native'
import { ifFeatureFlag } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  return <Text>This should render if the flag evaluates to 'ABC123'</Text>
}

const MyConditionalComponent = ifFeatureFlag('flag1', { matchValue: 'ABC123' })(
  MyComponent
)
```

You can then use `MyConditionalComponent` as a normal component, and only render if `flag1`'s value matches the passed
condition.

#### Loading fallback when in async mode

If [Async mode](#Async-mode) is used, by default the component will wait for flags to be retrieved before showing. This
behaviour can be overridden by passing an element as `loadingFallback`; when loading the `loadingFallback` will be
displayed until the flags are retrieved, at which point the component will either show or hide as normal.

```typescript jsx
import { Text } from 'react-native'
import { ifFeatureFlag } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent() {
  return <Text>This should render if the flag is on</Text>
}

const MyConditionalComponent = ifFeatureFlag('flag1', {
  loadingFallback: <Text>Loading...</Text>
})(MyComponent)
```

### `withFeatureFlags`

The `withFeatureFlags` higher-order component (HOC) wraps your component and adds `flags` and `loading` as additional
props. `flags` contains the evaluations for all known flags and `loading` indicates whether the SDK is actively fetching
flags.

```typescript jsx
import { Text } from 'react-native'
import { withFeatureFlags } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent({ flags }) {
  return <Text>Flag1's value is {flags.flag1}</Text>
}

const MyComponentWithFlags = withFeatureFlags(MyComponent)
```

#### Loading in async mode

If [Async mode](#Async-mode) is used, the `loading` prop will indicate whether the SDK has completed loading the flags.
When loading completes, the `loading` prop will be `false` and the `flags` prop will contain all known flags.

```typescript jsx
import { Text } from 'react-native'
import { withFeatureFlags } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent({ flags, loading }) {
  if (loading) {
    return <Text>Loading...</Text>
  }

  return <Text>Flag1's value is {flags.flag1}</Text>
}

const MyComponentWithFlags = withFeatureFlags(MyComponent)
```

### `withFeatureFlagsClient`

The React Native Client SDK internally uses the Javascript Client SDK to communicate with Harness. Sometimes it can be
useful to be able to access the instance of the Javascript Client SDK rather than use the existing hooks or higher-order
components (HOCs). The `withFeatureFlagsClient` HOC wraps your component and adds `featureFlagsClient` as additional
prop. `featureFlagsClient` is the current Javascript Client SDK instance that the React Native Client SDK is using. This
instance will be configured, initialized and have been hooked up to the various events the Javascript Client SDK
provides.

```typescript jsx
import { Text } from 'react-native'
import { withFeatureFlagsClient } from '@harnessio/ff-react-native-client-sdk'

// ...

function MyComponent({ featureFlagsClient }) {
  if (featureFlagsClient) {
    return (
      <Text>
        Flag1's value is {featureFlagsClient.variation('flag1', 'no value')}
      </Text>
    )
  }

  return <Text>The Feature Flags client is not currently available</Text>
}

const MyComponentWithClient = withFeatureFlagsClient(MyComponent)
```

## Additional Reading

For further examples and config options, see
the [React Native Client SDK Reference](https://developer.harness.io/docs/feature-flags/ff-sdks/client-sdks/react-native-sdk-reference/)
For more information about Feature Flags, see
our [Feature Flags documentation](https://developer.harness.io/docs/feature-flags/ff-onboarding/getting-started-with-feature-flags/).

[ts-badge]: https://img.shields.io/badge/TypeScript-4.7-blue.svg

[react-badge]: https://img.shields.io/badge/React.js->=%2016.7-blue.svg

[react-native-badge]: https://img.shields.io/badge/React%20Native->=%200.70.0-blue.svg

[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2012-blue.svg

[nodejs]: https://nodejs.org/dist/latest/docs/api/

[reactjs]: https://reactjs.org

[reactnative]: https://reactnative.dev

[typescript-4-7]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html

[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg

[license]: https://github.com/drone/ff-nodejs-server-sdk/blob/main/LICENSE

[jest]: https://facebook.github.io/jest/

[eslint]: https://github.com/eslint/eslint

[prettier]: https://prettier.io
