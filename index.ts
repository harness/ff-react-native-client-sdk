/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import {NativeModules,NativeEventEmitter} from 'react-native';

 //Model class used for evaluation's data returned via events listeners.
 export class EvaluationResponse {
 
   constructor(flag, value){
     this.flag = flag;
     this.value = value
   }
 
   flag: string
   value: any
 }
 
 //Model class for SDK client confiuration
 export class CfConfiguration {
   configUrl?: string
   eventUrl?: string
   streamEnabled?: boolean
   pollingInterval?: number
 }
 
 //Model class to describe a target for features evaluations
 export class CfTarget {
   identifier: string
   name?: string
   anonymous?: boolean
   analyticsEnabled?: boolean
   attributes?: any
 }
 
 
 class CfClient {
   eventEmitter = new NativeEventEmitter(NativeModules.ReactNativePlugin)
   listeners = [];
 
   //Passes events from the Native side to the RN side
   private sendEvent(eventType, data) {
     this.listeners.forEach(element => element(eventType, data));
   }
 
   static cfClientInstance = new CfClient();
 
   private constructor() {}
 
   private resolve(type, result) {
     if (type == 'evaluation_polling') {
       this.sendEvent(type, result.map((element) => new EvaluationResponse(element.flag, element.value)))
     } else if (type == 'evaluation_change') {
       this.sendEvent(type, new EvaluationResponse(result.flag, result.value))
     } else if (type == 'start') {
       this.sendEvent(type, null)
     } else if (type == 'end') {
       this.sendEvent(type, null)
     }
   }
 
   //Add Event Emitter Listeners, that match those on the native plugin side
   private addEventEmitterListeners() {
     this.eventEmitter.addListener("start", res => this.resolve("start", res));
     this.eventEmitter.addListener("end", res => this.resolve("end", res));
     this.eventEmitter.addListener("evaluation_polling", res => this.resolve("evaluation_polling", res));
     this.eventEmitter.addListener("evaluation_change", res => this.resolve("evaluation_change", res));
     console.log('EventEmitter Listeners added')
     NativeModules.ReactNativePlugin.registerEventsListener()
   }
 
   //Remove currently registered Event Emitter Listeners, if any
   private removeEventEmitterListeners() {
     this.eventEmitter.removeAllListeners("start")
     this.eventEmitter.removeAllListeners("end")
     this.eventEmitter.removeAllListeners("evaluation_polling")
     this.eventEmitter.removeAllListeners("evaluation_change")
     console.log('Current EventEmitter Listeners removed')
   }
 
   //This method needs to be run first, to initiate authorization.
   // - apiKey: `YOUR_API_KEY`
   // - configuration: `CfConfiguration` to be used for Evaluation fetching
   // - target: `CfTarget` describing target for Evaluation fetching
   async initialize(apiKey: string, configuration: CfConfiguration, target: CfTarget) {
     console.log('running init')
     return await NativeModules.ReactNativePlugin.initialize(apiKey, configuration, target)
   }
 
   //Completion block of this method will be called on each SSE response event.
   //This method needs to be called in order to get SSE events. Make sure to call initialize() prior to calling this method.
   registerEventsListener(listener: (type: string, flags: any) => void) {
     this.removeEventEmitterListeners()
     this.addEventEmitterListeners()
 
     if (typeof listener !== "function" || this.listeners.some(element => element == listener)) {
       return;
     }
     this.listeners.push(listener)
   }
 
   //Unregister SSE event listener
   unregisterListener(listener: (type: string, flags: any) => void) {
     for (var i = 0; i < this.listeners.length; i++) {
 
       if (this.listeners[i] == listener) {
         this.listeners.splice(i, 1);
         i--;
       }
     }
   }
 
   private unregisterAll() {
     this.listeners = []
   }
 
   //Fetch String variation for a specified key from cache, with default value if a given key does not exist.
   //Make sure to call intialize() prior to calling this method.
   //If called prior to calling intialize(), `defaultValue` will be returned or `null` if `defaultValue` was not specified.
   stringVariation(evalutionId: string, defaultValue?:string) {
     if (defaultValue == undefined) {
       return NativeModules.ReactNativePlugin.stringVariation(evalutionId)
     } else {
       return NativeModules.ReactNativePlugin.stringVariationWithFallback(evalutionId, defaultValue)
     }
   }
 
   //Fetch Boolean variation for a specified key from cache, with default value, if a given key does not exist.
   //Make sure to call intialize() prior to calling this method.
   //If called prior to calling intialize(), `defaultValue` will be returned or `null`, if `defaultValue` was not specified.
   boolVariation(evalutionId: string, defaultValue?: boolean) {
     if (defaultValue == undefined) {
       return NativeModules.ReactNativePlugin.boolVariation(evalutionId)
     } else {
       return NativeModules.ReactNativePlugin.boolVariationWithFallback(evalutionId, true)
     }
   }
 
   //Fetch Number variation for a specified key from cache, with default value, if a given key does not exist.
   //Make sure to call intialize() prior to calling this method.
   //If called prior to calling intialize(), `defaultValue` will be returned or `null`, if `defaultValue` was not specified.
   numberVariation(evalutionId: string, defaultValue?:number) {
     if (defaultValue == undefined) {
       return NativeModules.ReactNativePlugin.numberVariation(evalutionId)
     } else {
       return NativeModules.ReactNativePlugin.numberVariationWithFallback(evalutionId, defaultValue)
     }
   }
 
   //Fetch JSON (Map) variation for a specified key from cache, with default value, if a given key does not exist.
   //Make sure to call intialize() prior to calling this method.
   //If called prior to calling intialize(), `defaultValue` will be returned or `null`, if `defaultValue` was not specified.
   jsonVariation(evalutionId: string, defaultValue?: any) {
     if (defaultValue == undefined) {
       return NativeModules.ReactNativePlugin.jsonVariation(evalutionId)
     } else {
       return NativeModules.ReactNativePlugin.jsonVariationWithFallback(evalutionId, defaultValue)
     }
   }
 
   //Clears the occupied resources and shuts down the sdk.
   //After calling this method, the intialize() must be called again. It will also
   //remove any registered event listeners.
   destroy() {
     NativeModules.ReactNativePlugin.destroy()
     this.unregisterAll()
   }
 }
 
 export default CfClient.cfClientInstance
 