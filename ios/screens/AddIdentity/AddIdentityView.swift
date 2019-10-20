//
//  AddIdentityView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class AddIdentityView: UIView {
  var labelLarge1 = UILabel()
  var labelLarge2 = UILabel()
  var labelLarge3 = UILabel()
  var labelSmall = UILabel()
  var createButton = UIButton()
  var recoverButton = UIButton()
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.setupView()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func setupView() {
    self.addSubview(labelSmall)
    labelSmall.translatesAutoresizingMaskIntoConstraints = false
    labelSmall.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16).isActive = true
    labelSmall.bottomAnchor.constraint(equalTo: self.centerYAnchor).isActive = true
    labelSmall.text = "只需一个身份，管理多链钱包"
    labelSmall.font = UIFont.systemFont(ofSize: 17)
    if #available(iOS 13.0, *) {
      labelSmall.textColor = .label
    }
    
    self.addSubview(labelLarge2)
    labelLarge2.translatesAutoresizingMaskIntoConstraints = false
    labelLarge2.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16).isActive = true
    labelLarge2.bottomAnchor.constraint(equalTo: labelSmall.topAnchor, constant: -32).isActive = true
    labelLarge2.text = "币通"
    labelLarge2.font = UIFont.systemFont(ofSize: 30)
    if #available(iOS 13.0, *) {
      labelLarge2.textColor = .label
    }
    
    self.addSubview(labelLarge3)
    labelLarge3.translatesAutoresizingMaskIntoConstraints = false
    labelLarge3.leadingAnchor.constraint(equalTo: labelLarge2.trailingAnchor, constant: 10).isActive = true
    labelLarge3.bottomAnchor.constraint(equalTo: labelSmall.topAnchor, constant: -32).isActive = true
    labelLarge3.text = "数字身份"
    labelLarge3.font = UIFont.systemFont(ofSize: 30)
    labelLarge3.textColor = .systemBlue
    
    self.addSubview(labelLarge1)
    labelLarge1.translatesAutoresizingMaskIntoConstraints = false
    labelLarge1.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16).isActive = true
    labelLarge1.bottomAnchor.constraint(equalTo: labelLarge2.topAnchor, constant: -10).isActive = true
    labelLarge1.text = "创建您的"
    labelLarge1.font = UIFont.systemFont(ofSize: 30)
    if #available(iOS 13.0, *) {
      labelLarge1.textColor = .label
    }
    
    self.addSubview(createButton)
    createButton.translatesAutoresizingMaskIntoConstraints = false
    createButton.setTitle("创建身份", for: .normal)
    createButton.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16).isActive = true
    createButton.widthAnchor.constraint(equalTo: self.widthAnchor, multiplier: 1, constant: -32).isActive = true
    createButton.topAnchor.constraint(equalTo: self.centerYAnchor, constant: 60).isActive = true
    createButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
    createButton.backgroundColor = .systemBlue
    createButton.layer.cornerRadius = 10
    createButton.contentVerticalAlignment = .center
    createButton.contentHorizontalAlignment = .center
    createButton.addTarget(self, action: #selector(toCreateIdentity), for: .touchUpInside)
    
    self.addSubview(recoverButton)
    recoverButton.translatesAutoresizingMaskIntoConstraints = false
    recoverButton.setTitle("恢复身份", for: .normal)
    recoverButton.setTitleColor(.systemBlue, for: .normal)
    recoverButton.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16).isActive = true
    recoverButton.widthAnchor.constraint(equalTo: self.widthAnchor, multiplier: 1, constant: -32).isActive = true
    recoverButton.topAnchor.constraint(equalTo: createButton.bottomAnchor, constant: 16).isActive = true
    recoverButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
    if #available(iOS 13.0, *) {
      recoverButton.backgroundColor = .systemFill
    }
    recoverButton.layer.cornerRadius = 10
    recoverButton.contentVerticalAlignment = .center
    recoverButton.contentHorizontalAlignment = .center
    recoverButton.addTarget(self, action: #selector(toRecoverIdentity), for: .touchUpInside)
  }
  
  @objc func toCreateIdentity() {
    let toVC = ReactNativeViewController.init(moduleName: "CreateIdentity")
    
    let submit = UIBarButtonItem()
    submit.title = "下一步"
    submit.setTitleTextAttributes([NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .init(500))], for: .normal)
    submit.setTitleTextAttributes([NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .init(500))], for: .disabled)
    submit.isEnabled = false
    submit.style = .plain
    toVC.navigationItem.rightBarButtonItems = [submit]
    
    if #available(iOS 13.0, *) {
      toVC.view.backgroundColor = .systemBackground
    }
    if #available(iOS 11.0, *) {
      toVC.navigationItem.largeTitleDisplayMode = .never
    }
    
    let vc = controller(for: self)
    vc?.navigationController?.pushViewController(toVC, animated: true)
  }
  
  @objc func toRecoverIdentity() {
    let toVC = ReactNativeViewController.init(moduleName: "RecoverIdentity")
    
    let submit = UIBarButtonItem()
    submit.setTitleTextAttributes([NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .init(500))], for: .normal)
    submit.setTitleTextAttributes([NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .init(500))], for: .disabled)
    submit.title = "确认"
    submit.isEnabled = false
    submit.style = .plain
    toVC.navigationItem.rightBarButtonItems = [submit]
    if #available(iOS 11.0, *) {
      toVC.navigationItem.largeTitleDisplayMode = .never
    }
    
    let vc = controller(for: self)
    if #available(iOS 13.0, *) {
      toVC.view.backgroundColor = .systemBackground
//      let appearance = UINavigationBarAppearance()
//      appearance.configureWithDefaultBackground()
//      vc?.navigationController?.navigationBar.standardAppearance = appearance
    }
    
    vc?.navigationController?.pushViewController(toVC, animated: true)
  }
  
  override func didMoveToWindow() {
    let vc = controller(for: self)
    let skipButton = vc?.navigationItem.rightBarButtonItems?[0]
    skipButton?.target = self
    skipButton?.action = #selector(skip)
  }
  
  @objc func skip() {
    let vc = controller(for: self)
    vc?.dismiss(animated: true, completion: nil)
  }
  
  private func controller(for view: UIView) -> ReactNativeViewController? {
    var nextResponder = view.next
    while nextResponder != nil && !(nextResponder! is ReactNativeViewController) {
      nextResponder = nextResponder!.next
    }
    return nextResponder as? ReactNativeViewController
  }
}
