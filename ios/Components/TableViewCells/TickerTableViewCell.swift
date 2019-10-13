//
//  TickerTableViewCell.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class TickerTableViewCell: UITableViewCell {
  var tokenImage: UIImageView = UIImageView()
  var priceLabel: UILabel = UILabel()
  var nameLabel: UILabel = UILabel()
  var symbolLabel: UILabel = UILabel()
  var changelabel: UIButton = UIButton()
  
  var name: String = "" {
    didSet {
      self.nameLabel.text = name
    }
  }
  
  var symbol: String = "" {
    didSet {
      self.symbolLabel.text = symbol
    }
  }
  
  var price: String = "-" {
    didSet {
      self.priceLabel.text = price
    }
  }
  
  var change: String = "-" {
    didSet {
      self.changelabel.setTitle(change, for: .normal)
    }
  }
  
  var trend: String = "0" {
    didSet {
      if (trend == "1") {
        self.changelabel.backgroundColor = .systemGreen
        self.changelabel.setTitleColor(.white, for: .normal)
      } else if (trend == "-1") {
        self.changelabel.backgroundColor = .systemRed
        self.changelabel.setTitleColor(.white, for: .normal)
      } else {
        if #available(iOS 13.0, *) {
          self.changelabel.backgroundColor = .white
          self.changelabel.setTitleColor(.black, for: .normal)
          self.changelabel.contentHorizontalAlignment = .center
        } else {
          // Fallback on earlier versions
        }
      }
    }
  }
  
  override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
    super.init(style: .default, reuseIdentifier: reuseIdentifier)
    self.setupView()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func setupView() {
    // Initialization code
    contentView.addSubview(tokenImage)
    tokenImage.translatesAutoresizingMaskIntoConstraints = false
    tokenImage.heightAnchor.constraint(equalToConstant: 44).isActive = true
    tokenImage.widthAnchor.constraint(equalToConstant: 44).isActive = true
    tokenImage.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16).isActive = true
    tokenImage.centerYAnchor.constraint(equalTo: contentView.centerYAnchor).isActive = true
    tokenImage.layer.cornerRadius = 22
    if #available(iOS 13.0, *) {
      tokenImage.backgroundColor = .systemFill
    }
    
    contentView.addSubview(symbolLabel)
    symbolLabel.translatesAutoresizingMaskIntoConstraints = false
    symbolLabel.leadingAnchor.constraint(equalTo: tokenImage.trailingAnchor, constant: 16).isActive = true
    symbolLabel.bottomAnchor.constraint(equalTo: contentView.centerYAnchor, constant: 0).isActive = true
    symbolLabel.widthAnchor.constraint(lessThanOrEqualToConstant: 100).isActive = true
    if #available(iOS 13.0, *) {
      symbolLabel.textColor = .label
    }
    symbolLabel.font = UIFont.systemFont(ofSize: 20, weight: .medium)
    
    contentView.addSubview(nameLabel)
    nameLabel.translatesAutoresizingMaskIntoConstraints = false
    nameLabel.leadingAnchor.constraint(equalTo: tokenImage.trailingAnchor, constant: 16).isActive = true
    nameLabel.topAnchor.constraint(equalTo: contentView.centerYAnchor, constant: 3).isActive = true
    nameLabel.widthAnchor.constraint(lessThanOrEqualToConstant: 150).isActive = true
    if #available(iOS 13.0, *) {
      nameLabel.textColor = .label
    }
    nameLabel.font = UIFont.systemFont(ofSize: 18, weight: .regular)
    
    contentView.addSubview(priceLabel)
    priceLabel.translatesAutoresizingMaskIntoConstraints = false
    priceLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16).isActive = true
    priceLabel.bottomAnchor.constraint(equalTo: contentView.centerYAnchor, constant: -3).isActive = true
    priceLabel.widthAnchor.constraint(lessThanOrEqualToConstant: 150).isActive = true
    if #available(iOS 13.0, *) {
      priceLabel.textColor = .label
    }
    priceLabel.font = UIFont.systemFont(ofSize: 18, weight: .medium)
    
    contentView.addSubview(changelabel)
    changelabel.translatesAutoresizingMaskIntoConstraints = false
    changelabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16).isActive = true
    changelabel.topAnchor.constraint(equalTo: contentView.centerYAnchor, constant: 0).isActive = true
    changelabel.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .medium)
    changelabel.heightAnchor.constraint(equalToConstant: 26).isActive = true
    changelabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 74).isActive = true
    changelabel.layer.cornerRadius = 4
    changelabel.clipsToBounds = true
    changelabel.contentHorizontalAlignment = .right
    changelabel.contentEdgeInsets = UIEdgeInsets(top: 0, left: 6, bottom: 0, right: 6)
    changelabel.isUserInteractionEnabled = false
    changelabel.widthAnchor.constraint(lessThanOrEqualToConstant: 100).isActive = true
  }
}
