//
//  ReactNativePlugin.swift
//  clientSdk
//
//  Created by Dusan Juranovic on 26.3.21..
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation
import ff_ios_client_sdk

@objc(ReactNativePlugin)
class ReactNativePlugin: RCTEventEmitter {

  enum EventTypeId: String {
		case start
    case end
    case evaluationPolling = "evaluation_polling"
    case evaluationChange  = "evaluation_change"
    case error
	}

  @objc func initialize(_ apiKey: String, configuration: [String:Any], target: [String:Any], resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    print("Passed apiKey: \(apiKey)")
    let config = configFrom(dict: configuration)
    let target = targetFrom(dict: target)

    CfClient.sharedInstance.initialize(apiKey: apiKey, configuration: config, target: target) { [weak self] result in
      switch result {
        case .failure(let e):
          reject("\(e.errorData.statusCode ?? 200)","Could not initialize", e)
        case .success:
          resolve(true)
          self?.registerEventsListener()
      }
    }
  }

  private func registerEventsListener() {
    CfClient.sharedInstance.registerEventsListener {[weak self] result in
      switch result {
        case .failure(let error):
          self?.sendEvent(withName: EventTypeId.error.rawValue, body: "Could not register Events Listener")
        case .success(let eventType):
          switch eventType {
            case .onOpen: self?.sendEvent(withName: EventTypeId.start.rawValue, body: "SSE opened")
            case .onComplete: self?.sendEvent(withName: EventTypeId.end.rawValue, body: "SSE completed")
            case .onPolling(let evaluations):
              let data = try? JSONEncoder().encode(evaluations)
              guard let validData = data else {
                let error = CFError.noDataError
                self?.sendEvent(withName: EventTypeId.error.rawValue, body: "No data available on evaluation_polling")
                return
              }
              let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments) as? [[String:Any]]
              self?.sendEvent(withName: EventTypeId.evaluationPolling.rawValue, body: json)
            case .onEventListener(let evaluation):
              let data = try? JSONEncoder().encode(evaluation)
              guard let validData = data else {
                let error = CFError.noDataError
                self?.sendEvent(withName: EventTypeId.error.rawValue, body: "No data available on evaluation_polling")
                return
              }
              let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments) as? [String:Any]
              self?.sendEvent(withName: EventTypeId.evaluationChange.rawValue, body: json)
            case.onMessage(_): print("Generic Message received")
          }
      }
    }
  }

  @objc func stringVariationWithFallback(_ evaluationId: String, defaultValue: String, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.stringVariation(evaluationId: evaluationId, defaultValue: defaultValue) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get stringVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func stringVariation(_ evaluationId: String, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.stringVariation(evaluationId: evaluationId) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get stringVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func boolVariationWithFallback(_ evaluationId: String, defaultValue: Bool, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.boolVariation(evaluationId: evaluationId, defaultValue: defaultValue) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get boolVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func boolVariation(_ evaluationId: String, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.boolVariation(evaluationId: evaluationId) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get boolVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func numberVariationWithFallback(_ evaluationId: String, defaultValue: Int, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.numberVariation(evaluationId: evaluationId, defaultValue: defaultValue) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get numberVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func numberVariation(_ evaluationId: String, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.numberVariation(evaluationId: evaluationId) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get numberVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func jsonVariationWithFallback(_ evaluationId: String, defaultValue: [String:Any], resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let key = defaultValue.keys.first!
    let value = defaultValue[key]
    let valueType: ValueType = determineType(value)

    CfClient.sharedInstance.jsonVariation(evaluationId: evaluationId, defaultValue: [key:valueType]) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get jsonVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }
  @objc func jsonVariation(_ evaluationId: String, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    CfClient.sharedInstance.jsonVariation(evaluationId: evaluationId) { (evaluation) in
      let data = try? JSONEncoder().encode(evaluation)
      guard let validData = data else {
        let error = CFError.noDataError
        reject("\(error.errorData.statusCode ?? 200)", "Could not get jsonVariation", error)
        return
      }
      let json = try? JSONSerialization.jsonObject(with: validData, options: .allowFragments)
      resolve(json)
    }
  }

  @objc func destroy() {
    CfClient.sharedInstance.destroy()
  }

  override func supportedEvents() -> [String]! {
    return [EventTypeId.start.rawValue,
            EventTypeId.end.rawValue,
            EventTypeId.evaluationPolling.rawValue,
            EventTypeId.evaluationChange.rawValue,
            EventTypeId.error.rawValue]
  }

  override class func requiresMainQueueSetup() -> Bool {
    return true
  }
}

extension ReactNativePlugin {
  func determineType(_ value: Any?) -> ValueType {
    if value is String {
      return ValueType.string(value as! String)
    } else if value is Bool {
      return ValueType.bool(value as! Bool)
    } else if value is Int {
      return ValueType.int(value as! Int)
    } else {
      let subObj = value as! [String:Any]
      let key = subObj.keys.first!
      let subVal = subObj[key]
      let valueType = determineType(subVal)
      return ValueType.object([key:valueType])
    }
  }
}

extension ReactNativePlugin {
  //Extract CfConfiguration from dictionary
  func configFrom(dict: Dictionary<String, Any?>) -> CfConfiguration {

    let configBuilder = CfConfiguration.builder()

    if let configUrl = dict["baseURL"] as? String {
      
      _ = configBuilder.setConfigUrl(configUrl)
    }

    if let eventUrl = dict["eventURL"] as? String {
      
      _ = configBuilder.setEventUrl(eventUrl)
    }
    
    if let streamUrl = dict["streamURL"] as? String {
      
      _ = configBuilder.setStreamUrl(streamUrl)
    }

    if let streamEnabled = dict["streamEnabled"] as? Bool {
      
      _ = configBuilder.setStreamEnabled(streamEnabled)
    }

    if let analyticsEnabled = dict["analyticsEnabled"] as? Bool {
      
      _ = configBuilder.setAnalyticsEnabled(analyticsEnabled)
    }

    if let pollingInterval = dict["pollingInterval"] as? TimeInterval {
      
      _ = configBuilder.setPollingInterval(pollingInterval)
    }

    return configBuilder.build()
  }

  //Extract CfTarget from dictionary
  func targetFrom(dict: Dictionary<String, Any?>) -> CfTarget {
    let targetBuilder = CfTarget.builder()
    if let identifier = dict["identifier"] as? String {
      _ = targetBuilder.setIdentifier(identifier)
    }
    if let name = dict["name"] as? String {
      _ = targetBuilder.setName(name)
    }
    if let anonymous = dict["anonymous"] as? Bool {
      _ = targetBuilder.setAnonymous(anonymous)
    }
    if let attributes = dict["attributes"] as? [String:String] {
      _ = targetBuilder.setAttributes(attributes)
    }
    return targetBuilder.build()
  }
}
