//
//  SelectEOSAccountViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(SelectEOSAccountViewManager)
class SelectEOSAccountViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return SelectEOSAccountView.init()
  }
}
