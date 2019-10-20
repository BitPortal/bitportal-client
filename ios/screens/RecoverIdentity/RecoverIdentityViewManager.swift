//
//  RecoverIdentityViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(RecoverIdentityViewManager)
class RecoverIdentityViewManager: RCTViewManager {
  var recoverIdentityView: RecoverIdentityView?
  
  @objc override func view() -> UIView! {
    self.recoverIdentityView = RecoverIdentityView.init()
    return self.recoverIdentityView
  }
  
  @objc func submitFailed(_ message: String) {
    DispatchQueue.main.async {
      self.recoverIdentityView?.submitFailed(message: message)
    }
  }
  
  @objc func submitSucceeded() {
    DispatchQueue.main.async {
      self.recoverIdentityView?.submitSucceeded()
    }
  }
}
