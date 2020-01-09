//
//  AppDelegate.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import IQKeyboardManagerSwift

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    IQKeyboardManager.shared.enable = true
    IQKeyboardManager.shared.shouldResignOnTouchOutside = true
    IQKeyboardManager.shared.toolbarDoneBarButtonItemText = "完成"
    if #available(iOS 13.0, *) {
      IQKeyboardManager.shared.toolbarTintColor = .label
    }

    self.window = UIWindow(frame: UIScreen.main.bounds)
    let homeViewController = HomeViewController()
    self.window?.rootViewController = homeViewController
    self.window?.makeKeyAndVisible()

    return true
  }
}
