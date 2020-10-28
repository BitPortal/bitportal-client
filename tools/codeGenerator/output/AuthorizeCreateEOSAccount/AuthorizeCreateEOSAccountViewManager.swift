//
//  AuthorizeCreateEOSAccountViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(AuthorizeCreateEOSAccountViewManager)
class AuthorizeCreateEOSAccountViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return AuthorizeCreateEOSAccountView.init()
  }
}