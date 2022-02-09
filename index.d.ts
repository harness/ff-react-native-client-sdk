declare module '@harnessio/ff-react-native-client-sdk' {
    //Model class to describe a target for features evaluations
    export class CfTarget {
        identifier: string
        name?: string
        anonymous?: boolean
        analyticsEnabled?: boolean
        attributes?: any
    }
    export class CfConfiguration {
        configUrl?: string
        eventUrl?: string
        streamEnabled?: boolean
        pollingInterval?: number
    }

    export default CfClient.cfClientInstance

    export class CfClient {

        constructor()

        private sendEvent(eventType, data)

        static cfClientInstance: CfClient;

        //This method needs to be run first, to initiate authorization.
        // - apiKey: `YOUR_API_KEY`
        // - configuration: `CfConfiguration` to be used for Evaluation fetching
        // - target: `CfTarget` describing target for Evaluation fetching
        initialize(apiKey: string, configuration: CfConfiguration, target: CfTarget): Promise<Boolean>

        //Registering for SSE events is done inside this function.
        //Events registered are "start", "end", "evaluation_polling", "evaluation_change".
        //These events will be forwarded to the listener, passed-in as an argument.
        //This method needs to be called in order to get SSE events. Make sure to call initialize() prior to calling this method.
        // - type: Type of event received through listener.
        //   - possible values: "start", "end", "evaluation_polling", "evaluation_change"
        // - flags: An array or a single evaluation flag received, depending on a received event
        registerEventsListener(listener: (type: string, flags: any) => void) : void

        //Unregister SSE event listener.
        unregisterListener(listener: (type: string, flags: any) => void): void
        private unregisterAll()

        //Fetch String variation for a specified key from cache, with default value if a given key does not exist.
        //Make sure to call intialize() prior to calling this method.
        //If called prior to calling intialize(), `defaultValue` will be returned or `null` if `defaultValue` was not specified.
        stringVariation(evalutionId: string, defaultValue?: string) : Promise<String>

        //Fetch Boolean variation for a specified key from cache, with default value, if a given key does not exist.
        //Make sure to call intialize() prior to calling this method.
        //If called prior to calling intialize(), `defaultValue` will be returned or `null`, if `defaultValue` was not specified.
        boolVariation(evalutionId: string, defaultValue?: boolean) : Promise<boolean>

        //Fetch Number variation for a specified key from cache, with default value, if a given key does not exist.
        //Make sure to call intialize() prior to calling this method.
        //If called prior to calling intialize(), `defaultValue` will be returned or `null`, if `defaultValue` was not specified.
        numberVariation(evalutionId: string, defaultValue?: number) : Promise<number>

        //Fetch JSON (Map) variation for a specified key from cache, with default value, if a given key does not exist.
        //Make sure to call intialize() prior to calling this method.
        //If called prior to calling intialize(), `defaultValue` will be returned or `null`, if `defaultValue` was not specified.
        jsonVariation(evalutionId: string, defaultValue?: any) : Promise<any>

        //Clears the occupied resources and shuts down the sdk.
        //After calling this method, the intialize() must be called again. It will also
        //remove any registered event listeners.
        destroy() : any
    }



}
