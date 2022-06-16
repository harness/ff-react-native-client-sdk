# Further Reading

Covers advanced topics (different config options and scenarios)

## Configuration Options
The following configuration options are available to control the behaviour of the SDK.
You can pass the configuration in as options when the SDK client is created.
```javascript
    # Create a Feature Flag Client
    const client = cfClientInstance;

    # Create a Feature Flag Configuration
    const cfConfiguration = new CfConfiguration();
    cfConfiguration.baseUrl = "http://localhost:7000";
    cfConfiguration.eventUrl = "http://localhost:7000";
    cfConfiguration.streamEnabled = true;
    cfConfiguration.analyticsEnabled = true;

    # Initialize the Client
    const result = await client.initialize(
        apiKey,
        cfConfiguration,
        newTarget,
    );
    
```

| Name            | Description                                                                                                                                      | default                              |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| baseUrl         | the URL used to fetch feature flag evaluations. You should change this when using the Feature Flag proxy to http://localhost:7000                | https://config.ff.harness.io/api/1.0 |
| eventUrl       | the URL used to post metrics data to the feature flag service. You should change this when using the Feature Flag proxy to http://localhost:7000 | https://events.ff.harness.io/api/1.0 |
| pollInterval    | when running in stream mode, the interval in seconds that we poll for changes.                                                                   | 60                                   |
| streamEnabled    | Enable streaming mode.                                                                                                                           | true                                 |
| analyticsEnabled | Enable analytics.  Metrics data is posted every 60s                                                                                              | true                                 |
| pollInterval    | When running in stream mode, the interval in seconds that we poll for changes.                                                                   | 60                                   |

## Recommended reading

[Feature Flag Concepts](https://ngdocs.harness.io/article/7n9433hkc0-cf-feature-flag-overview)

[Feature Flag SDK Concepts](https://ngdocs.harness.io/article/rvqprvbq8f-client-side-and-server-side-sdks)

## Setting up your Feature Flags

[Feature Flags Getting Started](https://ngdocs.harness.io/article/0a2u2ppp8s-getting-started-with-feature-flags)

## Other Variation Types

### String Variation 
```javascript
client.stringVariation('identifier_of_your_string_flag', "default")
```

### Number Variation
```javascript
client.numberVariation('identifier_of_your_number_flag', 0)
```

### JSON Variation
```javascript
client.jsonVariation('identifier_of_your_json_flag', {})
```
## Register for Events
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

## Cleanup
Call the close function on the client 

```javascript
client.destroy()
```

## Change default URL

When using your Feature Flag SDKs with a [Harness Relay Proxy](https://ngdocs.harness.io/article/q0kvq8nd2o-relay-proxy) you need to change the default URL.

To do this you import the url helper functions 

```javascript
from featureflags.config import with_base_url
from featureflags.config import with_events_url

```

Then pass them with the new URLs when creating your client.

```javascript
    client = CfClient(api_key,
                      with_base_url("https://config.feature-flags.uat.harness.io/api/1.0"),
                      with_events_url("https://event.feature-flags.uat.harness.io/api/1.0"))
```