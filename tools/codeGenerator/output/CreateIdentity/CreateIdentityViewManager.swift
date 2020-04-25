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
  @objc override func view() -> UIView! {
    return CreateIdentityView.init()
  }
}
