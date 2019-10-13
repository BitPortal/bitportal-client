//
//  CreateIdentityViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(CreateIdentityViewManager)
class CreateIdentityViewManager: RCTViewManager {
  var createIdentityView: CreateIdentityView?
  
  @objc override func view() -> UIView! {
    self.createIdentityView = CreateIdentityView.init()
    return self.createIdentityView
  }
  
  @objc func submitFailed(_ message: String) {
    DispatchQueue.main.async {
      self.createIdentityView?.submitFailed(message: message)
    }
  }
  
  @objc func submitSucceeded(_ mnemonics: String) {
    DispatchQueue.main.async {
      self.createIdentityView?.submitSucceeded(mnemonics: mnemonics)
    }
  }
}
