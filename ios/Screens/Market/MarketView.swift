//
//  MarketView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import Alamofire
import AlamofireImage

class MarketView: UITableView, UITableViewDelegate, UITableViewDataSource {
  private var data: [[String : String]] = []
  var onRefresh: RCTDirectEventBlock?
  
  @objc(setOnRefresh:)
  public func setOnRefresh(eventBlock: RCTDirectEventBlock?) {
    self.onRefresh = eventBlock
  }
  
  @objc(setData:)
  public func setData(data: NSArray) {
    self.data = data as! [[String : String]]
    self.reloadData()
  }
  
  func setupView() {
    if #available(iOS 13.0, *) {
      self.backgroundColor = .systemBackground
    }
    self.register(TickerTableViewCell.self, forCellReuseIdentifier: NSStringFromClass(TickerTableViewCell.self))
    self.delegate = self
    self.dataSource = self
    // self.refreshControl = UIRefreshControl()
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
    var cell: TickerTableViewCell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(TickerTableViewCell.self), for: indexPath) as! TickerTableViewCell
    cell.selectionStyle = .none
    cell.symbol = data[indexPath.row]["symbol"] ?? ""
    cell.name = data[indexPath.row]["name"] ?? ""
    cell.price = data[indexPath.row]["price"] ?? "-"
    cell.change = data[indexPath.row]["change"] ?? "-"
    cell.trend = data[indexPath.row]["trend"] ?? "0"
    cell.tokenImage.image = nil
    
    if (data[indexPath.row]["imageUrl"] != nil) {      Alamofire.request(data[indexPath.row]["imageUrl"]!).responseData { (response) in
        if response.error == nil {
          print(response.result)
          
          if let data = response.data {
            cell.tokenImage.image = UIImage(data: data)
          }
        }
      }
    }
    
    return cell
  }
  
  func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    return 72
  }
}
