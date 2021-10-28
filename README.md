Harness CF React Native SDK
========================
## Overview

-------------------------
[Harness](https://www.harness.io/) is a feature management platform that helps teams to build better software and to test features quicker.

# Before you Begin
Harness Feature Flags (FF) is a feature management solution that enables users to change the software’s functionality, without deploying new code. FF uses feature flags to hide code or behaviours without having to ship new versions of the software. A feature flag is like a powerful if statement.

For more information, see https://harness.io/products/feature-flags/

To read more, see https://ngdocs.harness.io/category/vjolt35atg-feature-flags

To sign up, https://app.harness.io/auth/#/signup/


-------------------------

## _Setup_

To install SDK, declare a dependency to project's `package.json` file:
```
"ff-react-native-client-sdk": "1.0.0"
```

Or using npm install: 
```shell
$ npm install --save ff-react-native-client-sdk
```

For iOS, run the following commands from project root folder
```shell
$ cd ios
$ pod install
```

Then, you may import package to your project. The SDK is used via single instance exported from `index.d.ts` module
```Javascript
import cfClientInstance from 'ff-react-native-client-sdk';
```
## **_Initialization_**
`cfClientInstance` is base instance that provides all the features of SDK. It is initialized with instances of `CfConfiguration` and `CfTarget`. All configuration fields are optional and if omitted they will be populated with default values by SDK.

```JavaScript
import cfClientInstance, {CfConfiguration, CfTarget} from 'ff-react-native-client-sdk';

const client = cfClientInstance;

const cfConfiguration = new CfConfiguration();
cfConfiguration.streamEnabled = true;

const cfTarget = new CfTarget();
cfTarget.identifier = 'Harness'

const apiKey = "YOUR_API_KEY";

const result = await cfClientInstance.initialize(apiKey, cfConfiguration, cfTarget);
```
`cfTarget` represents a desired target for which we want features to be evaluated. `identifier` is mandatory field.

`"YOUR_API_KEY"` is an authentication key, needed for access to Harness services.

**Your Harness SDK is now initialized. Congratulations!!!**
<br><br>
### **_Public API Methods_** ###
The Public API exposes a few methods that you can utilize:


* `async initialize(apiKey: string, config: CfConfiguration, target:CfTarget)`

* `boolVariation(evalutionId: string, defaultValue?: boolean)`

* `stringVariation(evalutionId: string, defaultValue?:string)`

* `numberVariation(evalutionId: string, defaultValue?:number)`

* `jsonVariation(evalutionId: string, defaultValue: any)`

* `registerListener(listener: (type: string, flags: any) => void) `

* `unregisterListener(listener: (type: string, flags: any) => void)`

* `destroy()`
<br><br>


## Fetch evaluation's value
It is possible to fetch a value for a given evaluation. Evaluation is performed based on different type. In case there is no evaluation with provided id, the default value is returned.

Use appropriate method to fetch the desired Evaluation of a certain type.
### <u>_boolVariation(evaluationId: string, defaultValue?: boolean)_</u>

```JavaScript
//get boolean evaluation
let evaluation = await client.boolVariation("demo_bool_evaluation", false)
```
### <u>_numberVariation(evaluationId: string, defaultValue?:number)_</u>
```JavaScript
//get number evaluation
let numberEvaluation = await client.numberVariation("demo_number_evaluation", 0)
```

### <u>_stringVariation(evaluationId: string, defaultValue?:string)_</u>
```JavaScript
//get string evaluaation
let stringEvaluation = await client.stringVariation("demo_string_evaluation", "default");
```
### <u>_jsonVariation(evaluationId: string, defaultValue?: any)_</u>
```JavaScript
//get json evaluation
let jsonEvaluation = await client.jsonVariation("demo_json_evaluation", {});

```

## _Register for events_
This method provides a way to register a listener for different events that might be triggered by SDK, indicating specific change in SDK itself.

```JavaScript
    client.registerListener((type, flags) => {

    });
```

Each type will return a corresponding value as shown in the table below.
<br><br>

| event type                 | returns                    |
| :--------------------------| :-------------------------:|
| "start"                    | null                       |
| "end"                      | null                       |
| "evaluation_polling"       | List<EvaluationResponse>   |
| "evaluation_change"        | EvaluationResponse         |
<br><br>

Visit documentation for complete list of possible types and values they provide.

To avoid unexpected behaviour, when listener is not needed anymore, a caller should call 
`client.unregisterListener(eventsListener)`
This way the sdk will remove desired listener from internal list.

## _Shutting down the SDK_
To avoid potential memory leak, when SDK is no longer needed (when the app is closed, for example), a caller should call this method
```JavaScript
client.destroy()
```
