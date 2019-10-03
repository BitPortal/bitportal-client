//
//  SPAlertViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/8/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(SPAlertViewManager)
class SPAlertViewManager: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func presentDone(_ title: NSString) {
    DispatchQueue.main.async {
      SPAlert.present(title: title as String, preset: SPAlertPreset.done)
    }
  }
  
  @objc func presentHeart(_ title: NSString) {
    DispatchQueue.main.async {
      SPAlert.present(title: title as String, preset: SPAlertPreset.heart)
    }
  }
  
  @objc func presentMessage(_ message: NSString) {
    DispatchQueue.main.async {
      SPAlert.present(message: message as String)
    }
  }
  
  @objc func presentTitle(_ title: NSString) {
    DispatchQueue.main.async {
      SPAlert.present(title: title as String)
    }
  }
}
