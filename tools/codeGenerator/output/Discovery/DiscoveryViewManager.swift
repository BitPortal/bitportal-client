//
//  DiscoveryViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(DiscoveryViewManager)
class DiscoveryViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return DiscoveryView.init()
  }
}
