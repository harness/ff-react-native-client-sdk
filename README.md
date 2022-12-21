React Native SDK For Harness Feature Flags
========================

## Table of Contents
**[Intro](#Intro)**<br>
**[Requirements](#Requirements)**<br>
**[Quickstart](#Quickstart)**<br>
**[Further Reading](docs/further_reading.md)**<br>
**[Build Instructions](docs/build.md)**<br>


## Intro

Use this README to get started with our Feature Flags (FF) SDK for React Native. This guide outlines the basics of getting started with the SDK and provides a full code sample for you to try out.
This sample doesn’t include configuration options, for in depth steps and configuring the SDK, for example, disabling streaming or using our Relay Proxy, see the  [React Native SDK Reference](https://ngdocs.harness.io/article/z2w6uj9mzb-react-native-sdk-reference).

![FeatureFlags](https://github.com/harness/ff-react-native-client-sdk/raw/main/docs/images/ff-gui.png)

## Requirements

[React 16](https://reactjs.org/) or newer<br>
[React Native 0.63](https://reactnative.dev/docs/environment-setup) or newer<br>

## Quickstart
To follow along with our test code sample, make sure you’ve:

- [Created a Feature Flag on the Harness Platform](https://ngdocs.harness.io/article/1j7pdkqh7j-create-a-feature-flag) called harnessappdemodarkmode
- [Created a Client SDK key and made a copy of it](https://ngdocs.harness.io/article/1j7pdkqh7j-create-a-feature-flag#step_3_create_an_sdk_key)

### Install the SDK
Install the React Native SDK by adding it to your project's `package.json` file:
```
"@harnessio/ff-react-native-client-sdk": "^1.0.2"
```

Or install using npm:
```shell
$ npm install --save @harnessio/ff-react-native-client-sdk
```

For iOS, run the following commands from project root folder
```shell
$ cd ios
$ pod install
```

### Code Sample
The following is a complete code example with a fresh React-Native project that you can use to test the `harnessappdemodarkmode` Flag you created on the Harness Platform. When you run the code it will:
- Connect to the FF service.
- Report the value of the Flag in the mobile simulator. 

Install expo.
```shell
npm install -g expo-cli
```

Using Expo, initialize a project. For the best experience, select `Minimal` as the template when prompted.
```shell
expo init SampleProject
cd SampleProject
```

Add the Harness React Native SDK to the `package.json` under the `dependencies` section.
```json
"@harnessio/ff-react-native-client-sdk": "^1.0.2"
```

Replace the code in `App.js` with the following Sample Code, and replace `apiKey` with your Client SDK Key.
```javascript
import cfClientInstance, {CfConfiguration, CfTarget} from '@harnessio/ff-react-native-client-sdk';

export default function App() {
  const flagName = 'harnessappdemodarkmode';

  const [client, setClient] = useState(null);
  const [flagValue, setFlagValue] = useState(null);

  async function initializeClient() {
    let cfClient = cfClientInstance;
    let cfConfig = new CfConfiguration();
    cfConfig.streamEnabled = true;

    const cfTarget = new CfTarget();
    cfTarget.identifier = 'Harness RN Sample App'

    const apiKey = "your-client-sdk-key";

    try {
      await cfClientInstance.initialize(apiKey, cfConfig, cfTarget);
    } catch (err) {
      console.log(err);
    }
    setClient(cfClient);
  }

  async function evalFlag() {
    let res = await client.boolVariation(flagName, false);
    setFlagValue(res.value);
  }

  useEffect(() => {
    if (client == null) {
      initializeClient();
    } else {
      evalFlag();
    }
  });

  return (
    <View style={styles.container}>
      <Text>
        Feature flag '{flagName}' is {JSON.stringify(flagValue)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Running the example

Start your desired simulator, either Android or iOS and run
```shell
yarn run ios
```
or
```shell
expo run:ios
```
Replace `ios` above with `android` if running on an Android simulator.

### Additional Reading

For further examples and config options, see the [React Native SDK Reference](https://ngdocs.harness.io/article/z2w6uj9mzb-react-native-sdk-reference).

For more information about Feature Flags, see our [Feature Flags documentation](https://ngdocs.harness.io/article/0a2u2ppp8s-getting-started-with-feature-flags).

-------------------------
[Harness](https://www.harness.io/) is a feature management platform that helps teams to build better software and to
test features quicker.

-------------------------
