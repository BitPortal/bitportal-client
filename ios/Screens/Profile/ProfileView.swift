//
//  ProfileView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/2.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import SafariServices

class ProfileView: UITableView, UITableViewDelegate, UITableViewDataSource {
  private var data: [[[String : String]]] = []

  @objc(setData:)
  public func setData(data: NSArray) {
    self.data = data as! [[[String : String]]]
    self.reloadData()
  }
  
  func setupView() {
    if #available(iOS 13.0, *) {
      self.backgroundColor = .systemGroupedBackground
    }
    self.register(SettingTableViewCell.self, forCellReuseIdentifier: NSStringFromClass(SettingTableViewCell.self))
    self.register(ProfileTableViewCell.self, forCellReuseIdentifier: NSStringFromClass(ProfileTableViewCell.self))
    self.delegate = self
    self.dataSource = self
  }
  
  override init(frame: CGRect, style: UITableView.Style) {
    super.init(frame: frame, style: style)
  }
  
  convenience init() {
    self.init(frame: CGRect.zero, style: .grouped)
    setupView()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
  }
  
  func numberOfSections(in tableView: UITableView) -> Int {
    return data.count
  }
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data[section].count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    var cell: UITableViewCell
    
    if (data[indexPath.section][indexPath.row]["cellReuseIdentifier"] == NSStringFromClass(ProfileTableViewCell.self)) {
      cell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(ProfileTableViewCell.self), for: indexPath)
    } else {
      cell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(SettingTableViewCell.self), for: indexPath)
      cell.imageView?.image = UIImage.init(named: data[indexPath.section][indexPath.row]["image"] ?? "")
    }
    
    cell.detailTextLabel?.text = data[indexPath.section][indexPath.row]["detail"]
    cell.textLabel?.text = data[indexPath.section][indexPath.row]["title"]
    cell.accessoryType = .disclosureIndicator
    return cell
  }
  
  func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    if (data[indexPath.section][indexPath.row]["cellReuseIdentifier"] == NSStringFromClass(ProfileTableViewCell.self)) {
      return 78
    }
    
    return 44
  }
  
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    tableView.deselectRow(at: indexPath, animated: true)
    
    let webLink = data[indexPath.section][indexPath.row]["webLink"]
    
    if (webLink != nil) {
      toWebLink(url: webLink!)
    } else {
      toScreen()
    }
  }
  
  func toScreen() {
    let languageViewController = ReactNativeViewController.init(moduleName: "Language")
    languageViewController.title = "语言设置"
    if #available(iOS 13.0, *) {
      languageViewController.view.backgroundColor = .systemGroupedBackground
    }
    if #available(iOS 11.0, *) {
      languageViewController.navigationItem.largeTitleDisplayMode = .never
    }
    languageViewController.hidesBottomBarWhenPushed = true
    
    let vc = controller(for: self)
    vc?.navigationController?.pushViewController(languageViewController, animated: true)
  }
  
  func toWebLink(url: String) {
    if let url = URL(string: url) {
      if #available(iOS 11.0, *) {
        let config = SFSafariViewController.Configuration()
        let webVC = SFSafariViewController(url: url, configuration: config)
        
        let vc = controller(for: self)
        // let tvc = screens[0].init()
        vc?.present(webVC, animated: true)
        // vc?.navigationController?.pushViewController(tvc, animated: true)
      } else {
        
      }
    }
  }
  
  private func controller(for view: UIView) -> ReactNativeViewController? {
    var nextResponder = view.next
    while nextResponder != nil && !(nextResponder! is ReactNativeViewController) {
      nextResponder = nextResponder!.next
    }
    return nextResponder as? ReactNativeViewController
  }
}
