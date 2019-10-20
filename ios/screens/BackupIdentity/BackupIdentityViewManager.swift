//
//  BackupIdentityViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(BackupIdentityViewManager)
class BackupIdentityViewManager: RCTViewManager {
  var backupIdentityView: BackupIdentityView?
  
  @objc override func view() -> UIView! {
    self.backupIdentityView = BackupIdentityView.init()
    return self.backupIdentityView
  }
  
  @objc func submitFailed(_ message: String) {
    DispatchQueue.main.async {
      self.backupIdentityView?.submitFailed(message: message)
    }
  }
  
  @objc func submitSucceeded() {
    DispatchQueue.main.async {
      self.backupIdentityView?.submitSucceeded()
    }
  }
}
