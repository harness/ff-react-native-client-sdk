//
//  ReactNativePlugin.m
//  clientSdk
//
//  Created by Dusan Juranovic on 26.3.21..
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativePlugin, RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString)apiKey
                  configuration:(NSDictionary)configuration
                  target:(NSDictionary)target
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerEventsListener:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stringVariation:(NSString *)evaluationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(stringVariationWithFallback:(NSString *)evaluationId defaultValue:(NSString *)defaultValue resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(boolVariation:(NSString *)evaluationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(boolVariationWithFallback:(NSString *)evaluationId defaultValue:(BOOL *)defaultValue resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(numberVariation:(NSString *)evaluationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(numberVariationWithFallback:(NSString *)evaluationId defaultValue:(NSInteger *)defaultValue resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(jsonVariation:(NSString *)evaluationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(jsonVariationWithFallback:(NSString *)evaluationId defaultValue:(NSDictionary *)defaultValue resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(destroy)
                  
@end
