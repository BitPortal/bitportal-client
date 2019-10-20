//
//  CurrencyView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class CurrencyView: UITableView, UITableViewDelegate, UITableViewDataSource {
  private var data: [[String : String]] = []
  var onCurrencySelected: RCTDirectEventBlock?
  
  @objc(setOnCurrencySelected:)
  public func setOnCurrencySelected(eventBlock: RCTDirectEventBlock?) {
    self.onCurrencySelected = eventBlock
  }
  
  @objc(setData:)
  public func setData(data: NSArray) {
    self.data = data as! [[String : String]]
    self.reloadData()
  }
  
  func setupView() {
    if #available(iOS 13.0, *) {
      self.backgroundColor = .systemGroupedBackground
    }
    self.delegate = self
    self.dataSource = self
    self.register(UITableViewCell.self, forCellReuseIdentifier: NSStringFromClass(UITableViewCell.self))
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
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell: UITableViewCell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(UITableViewCell.self), for: indexPath)
    cell.textLabel?.text = data[indexPath.row]["title"]
    cell.accessoryType = UITableViewCell.AccessoryType(rawValue: UITableViewCell.AccessoryType.RawValue((data[indexPath.row]["accessoryType"]! as NSString).intValue)) ?? .none
    return cell
  }
  
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    tableView.deselectRow(at: indexPath, animated: true)
    
    if (self.onCurrencySelected != nil && !data[indexPath.row]["currency"]!.isEmpty) {
      self.onCurrencySelected!(["currency": data[indexPath.row]["currency"]!])
    }
  }
}
