//
//  NavBar.swift
//  bitportal
//
//  Created by Terence Ge on 2019/9/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class NavBar: SPFakeBarView {
  var onLeftButtonClicked: RCTDirectEventBlock?

  @objc(setTitle:)
  public func setTitle(title: String) {
    self.titleLabel.text = title
  }

  @objc(setSubTitle:)
  public func setSubTitle(title: String) {
    self.subtitleLabel.text = title
  }

  @objc(setLeftButtonTitle:)
  public func setLeftButtonTitle(title: String) {
    self.leftButton.setTitle(title, for: .normal)
    self.leftButton.addTarget(self, action: #selector(self.dismissAction), for: .touchUpInside)
  }

  @objc(setOnLeftButtonClicked:)
  public func setOnLeftButtonClicked(eventBlock: RCTDirectEventBlock?) {
    self.onLeftButtonClicked = eventBlock
  }

  @objc func dismissAction() {
    if (self.onLeftButtonClicked != nil) {
      self.onLeftButtonClicked!([:])
    }
  }

  public init() {
    super.init(style: .stork)
    self.commonInit()
  }

  required public init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    self.commonInit()
  }

  private func commonInit() {
    self.height = 66
  }
}
