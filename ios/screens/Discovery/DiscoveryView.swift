//
//  DiscoveryView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class DiscoveryView: UITableView, UITableViewDelegate, UITableViewDataSource {
  var data: [[String : String]] = []
  
  @objc(setData:)
  public func setData(data: NSArray) {
    self.data = data as! [[String : String]]
    self.reloadData()
  }
  
  func setupView() {
    if #available(iOS 13.0, *) {
      self.backgroundColor = .systemBackground
    }
    self.register(DiscoveryTableViewCell.self, forCellReuseIdentifier: NSStringFromClass(DiscoveryTableViewCell.self))
    self.delegate = self
    self.dataSource = self
  }
  
  override init(frame: CGRect, style: UITableView.Style) {
    super.init(frame: frame, style: style)
  }
  
  convenience init() {
    self.init(frame: CGRect.zero, style: .plain)
    setupView()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
  }
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    var cell: DiscoveryTableViewCell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(DiscoveryTableViewCell.self), for: indexPath) as! DiscoveryTableViewCell
    cell.textLabel?.text = data[indexPath.row]["title"]
    cell.textLabel?.textColor = .systemBlue
    
    return cell
  }
  
  func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    return 44
  }
  
  func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
    return 44
  }
  
  func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
    let headerView = UIView(frame: CGRect(x: 0, y: 0, width: tableView.bounds.size.width, height: 44))
    if #available(iOS 13.0, *) {
      headerView.backgroundColor = .systemBackground
    }
    let titleLabel = UILabel()
    titleLabel.text = "热门推荐"
    titleLabel.sizeToFit()
    titleLabel.font = UIFont.systemFont(ofSize: 20, weight: .medium)
    headerView.addSubview(titleLabel)
    titleLabel.translatesAutoresizingMaskIntoConstraints = false
    titleLabel.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 16).isActive = true
    titleLabel.centerYAnchor.constraint(equalTo: headerView.centerYAnchor).isActive = true
    return headerView
  }
  
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    tableView.deselectRow(at: indexPath, animated: true)
  }
}
