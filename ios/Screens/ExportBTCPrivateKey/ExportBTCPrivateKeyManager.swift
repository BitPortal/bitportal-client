//
//  ExportBTCPrivateKeyViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(ExportBTCPrivateKeyViewManager)
class ExportBTCPrivateKeyViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return ExportBTCPrivateKeyView.init()
  }
}
