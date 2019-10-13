//
//  AddIdentityViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(AddIdentityViewManager)
class AddIdentityViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return AddIdentityView.init(frame: CGRect.zero)
  }
}
