//
//  HomeViewController.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/2.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class HomeViewController: UITabBarController {
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Do any additional setup after loading the view.
    if #available(iOS 13.0, *) {
      self.view.backgroundColor = .systemBackground
    }
    ReactNativeModule.shared().entryFile = "index"
    ReactNativeModule.shared().startReactNative {
      let bridge = ReactNativeModule.shared().bridge
      self.loadReactViews(with: bridge)
    }
  }
  
  func loadReactViews(with bridge: RCTBridge) {
    let walletViewController = ReactNativeViewController.init(moduleName: "Wallet")
    walletViewController.title = "钱包"
    let walletTabItem = UITabBarItem(title: "钱包", image: UIImage.init(named: "tabBarWalletIcon.png"), selectedImage: UIImage.init(named: "tabBarWalletIcon.png"))
    walletViewController.tabBarItem = walletTabItem
    if #available(iOS 13.0, *) {
      walletViewController.view.backgroundColor = .systemBackground
    }
    let walletNavigationController = UINavigationController.init(rootViewController: walletViewController)
    if #available(iOS 11.0, *) {
      walletNavigationController.navigationBar.prefersLargeTitles = true
    }
    
    let marketViewController = ReactNativeViewController.init(moduleName: "Market")
    marketViewController.title = "市场"
    let marketNavigationController = UINavigationController.init(rootViewController: marketViewController)
    let MarketTabItem = UITabBarItem(title: "市场", image: UIImage.init(named: "tabBarMarketIcon.png"), selectedImage: UIImage.init(named: "tabBarMarketIcon.png"))
    marketViewController.tabBarItem = MarketTabItem
    if #available(iOS 11.0, *) {
      marketNavigationController.navigationBar.prefersLargeTitles = true
      let searchController = UISearchController()
      searchController.searchBar.placeholder = "搜索"
      searchController.searchBar.autocapitalizationType = .none
      marketViewController.navigationItem.searchController = searchController
    }
    if #available(iOS 13.0, *) {
      marketViewController.view.backgroundColor = .systemBackground
    }

    let discoveryViewController = ReactNativeViewController.init(moduleName: "Discovery")
    discoveryViewController.title = "发现"
    let discoveryNavigationController = UINavigationController.init(rootViewController: discoveryViewController)
    let DiscoveryTabItem = UITabBarItem(title: "发现", image: UIImage.init(named: "tabBarDiscoveryIcon.png"), selectedImage: UIImage.init(named: "tabBarDiscoveryIcon.png"))
    discoveryViewController.tabBarItem = DiscoveryTabItem
    if #available(iOS 11.0, *) {
      discoveryNavigationController.navigationBar.prefersLargeTitles = true
      let searchController = UISearchController()
      searchController.searchBar.placeholder = "搜索或输入网址"
      searchController.searchBar.autocapitalizationType = .none
      discoveryViewController.navigationItem.searchController = searchController
      discoveryViewController.navigationItem.hidesSearchBarWhenScrolling = false
    }
    if #available(iOS 13.0, *) {
      discoveryViewController.view.backgroundColor = .systemBackground
    }

    let profileViewController = ReactNativeViewController.init(moduleName: "Profile")
    profileViewController.title = "我的"
    let profileNavigationController = UINavigationController.init(rootViewController: profileViewController)
    let ProfileTabItem = UITabBarItem(title: "我的", image: UIImage.init(named: "tabBarProfileIcon.png"), selectedImage: UIImage.init(named: "tabBarProfileIcon.png"))
    profileViewController.tabBarItem = ProfileTabItem
    if #available(iOS 11.0, *) {
      profileNavigationController.navigationBar.prefersLargeTitles = true
    }
    if #available(iOS 13.0, *) {
      profileViewController.view.backgroundColor = .systemBackground
    }
    
    self.viewControllers = [walletNavigationController, marketNavigationController, discoveryNavigationController, profileNavigationController]
  }
}
