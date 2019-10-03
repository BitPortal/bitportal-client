//
//  ProfileViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/2.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(ProfileViewManager)
class ProfileViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return ProfileView.init()
  }
}
