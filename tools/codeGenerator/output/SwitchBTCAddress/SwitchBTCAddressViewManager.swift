//
//  SwitchBTCAddressViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(SwitchBTCAddressViewManager)
class SwitchBTCAddressViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return SwitchBTCAddressView.init()
  }
}
