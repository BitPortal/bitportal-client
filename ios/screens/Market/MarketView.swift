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
import IGListKit

class Ticker: ListDiffable {
  let key: String
  let name: String
  let symbol: String
  let price: String
  let change: String
  let trend: String
  let imageUrl: String
  
  init(key: String, name: String, symbol: String, price: String, change: String, trend: String, imageUrl: String) {
    self.key = key
    self.name = name
    self.symbol = symbol
    self.price = price
    self.change = change
    self.trend = trend
    self.imageUrl = imageUrl
  }
  
  func diffIdentifier() -> NSObjectProtocol {
    return key as NSObjectProtocol
  }
  
  func isEqual(toDiffableObject object: ListDiffable?) -> Bool {
    guard let object = object as? Ticker else { return false }
    return self.name == object.name && self.symbol == object.symbol && self.price == object.price && self.change == object.change && self.trend == object.trend && self.imageUrl == object.imageUrl
  }
}

class MarketView: UITableView, UITableViewDelegate, UITableViewDataSource {
  private var oldData: [Ticker] = []
  private var data: [Ticker] = []
  var onRefresh: RCTDirectEventBlock?
  
  @objc(setOnRefresh:)
  public func setOnRefresh(eventBlock: RCTDirectEventBlock?) {
    self.onRefresh = eventBlock
  }
  
  @objc(setData:)
  public func setData(data: [[String: String]]) {
    // SPAlert.present(message: "reload")
    self.oldData = self.data
    self.data = data.map { (item) -> Ticker in
      return Ticker(key: item["key"] ?? "", name: item["name"] ?? "", symbol: item["symbol"] ?? "", price: item["price"] ?? "-", change: item["change"] ?? "-", trend: item["trend"] ?? "0", imageUrl: item["imageUrl"] ?? "")
    }
    let result = ListDiffPaths(fromSection: 0, toSection: 0, oldArray: self.oldData, newArray: self.data, option: .equality).forBatchUpdates()

    // self.reloadData()
    self.beginUpdates()
    self.deleteRows(at: result.deletes, with: .fade)
    self.insertRows(at: result.inserts, with: .fade)
    result.moves.forEach { self.moveRow(at: $0.from, to: $0.to) }
    self.endUpdates()
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
    let cell: TickerTableViewCell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(TickerTableViewCell.self), for: indexPath) as! TickerTableViewCell
    cell.selectionStyle = .none
    cell.symbol = data[indexPath.row].symbol
    cell.name = data[indexPath.row].name
    cell.price = data[indexPath.row].price
    cell.change = data[indexPath.row].change
    cell.trend = data[indexPath.row].trend
    cell.tokenImage.image = nil
    
    Alamofire.request(data[indexPath.row].imageUrl).responseData { (response) in
      if response.error == nil {
        if let data = response.data {
          cell.tokenImage.image = UIImage(data: data)
        }
      }
    }
    
    return cell
  }
  
  func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    return 72
  }
}
