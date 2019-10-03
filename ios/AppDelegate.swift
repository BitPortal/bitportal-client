//
//  AppDelegate.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    self.window = UIWindow(frame: UIScreen.main.bounds)
    if #available(iOS 13.0, *) {
      self.window?.backgroundColor = .systemBackground
    }
    let homeViewController = HomeViewController()
    self.window?.rootViewController = homeViewController
    self.window?.makeKeyAndVisible()
    
    return true
  }
}

