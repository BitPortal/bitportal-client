//
//  AuthorizeEOSAccountViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(AuthorizeEOSAccountViewManager)
class AuthorizeEOSAccountViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return AuthorizeEOSAccountView.init()
  }
}
