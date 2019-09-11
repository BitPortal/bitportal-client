//
//  NavBarManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/9/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(NavBarManager)
class NavBarManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return NavBar()
  }
}
