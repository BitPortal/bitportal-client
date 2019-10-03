//
//  TGAddressBarManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/9/6.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(TGAddressBarManager)
class TGAddressBarManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return AddressBar.init(style: .stork)
  }
}
