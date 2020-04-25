//
//  ImportBTCWalletViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(ImportBTCWalletViewManager)
class ImportBTCWalletViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return ImportBTCWalletView.init()
  }
}
