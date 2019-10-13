//
//  CreateIdentityView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class CreateIdentityView: UITableView, UITableViewDelegate, UITableViewDataSource, FormDelagte {
  var data = [
    [
      [
        "name": "name",
        "label": "身份名",
        "placeholder": "输入不超过12位的身份名"
      ],
      [
        "name": "password",
        "label": "钱包密码",
        "placeholder": "不少于8位字符，建议混合大小写字母，数字，符号",
        "isSecure": "1"
      ],
      [
        "name": "confirmedPassword",
        "label": "确认密码",
        "placeholder": "再次输入密码",
        "isSecure": "1"
      ],
      [
        "name": "passwordHint",
        "label": "密码提示",
        "placeholder": "选填"
      ]
    ]
  ]
  
  var values = [
    "name": "",
    "password": "",
    "confirmedPassword": "",
    "passwordHint": ""
  ]
  
  var nextButton: UIBarButtonItem?
  var onSubmit: RCTDirectEventBlock?
  var activityIndicator = UIActivityIndicatorView()
  
  @objc(setOnSubmit:)
  public func setOnSubmit(eventBlock: RCTDirectEventBlock?) {
    self.onSubmit = eventBlock
  }
  
  @objc(setLoading:)
  public func setLoading(loading: Bool) {
    self.loading = loading
    
    if (self.nextButton != nil) {
      self.nextButton!.isEnabled = !loading
    }
  }
  
  var loading: Bool = false {
    didSet {
      if (loading) {
        self.activityIndicator.startAnimating()
      } else {
        self.activityIndicator.stopAnimating()
      }
    }
  }
  
  public func submitFailed(message: String) {
    let errorMessage = "创建失败"
    let vc = self.controller(for: self)
    let alert = UIAlertController(title: errorMessage, message: "", preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "确定", style: .default, handler: nil))
    vc?.present(alert, animated: true)
  }
  
  public func submitSucceeded(mnemonics: String) {
    self.toBackupIdentity(mnemonics: mnemonics)
  }
  
  @objc func toBackupIdentity(mnemonics: String) {
    UserDefaults.standard.set(mnemonics, forKey: "mnemonics")
    let toVC = ReactNativeViewController.init(moduleName: "BackupIdentity")
    let submit = UIBarButtonItem()
    submit.title = "下一步"
    submit.style = .plain
    submit.setTitleTextAttributes([NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .init(500))], for: .normal)
    submit.setTitleTextAttributes([NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .init(500))], for: .disabled)
    toVC.navigationItem.rightBarButtonItems = [submit]
    if #available(iOS 11.0, *) {
      toVC.navigationItem.largeTitleDisplayMode = .never
    }
    
    let vc = controller(for: self)
    if #available(iOS 13.0, *) {
      toVC.view.backgroundColor = .systemBackground
    }
    
    vc?.navigationController?.pushViewController(toVC, animated: true)
  }
  
  override init(frame: CGRect, style: UITableView.Style) {
    super.init(frame: frame, style: style)
  }
  
  convenience init() {
    self.init(frame: CGRect.zero, style: .grouped)
    setupView()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func setupView() {
    if #available(iOS 13.0, *) {
      self.backgroundColor = .systemBackground
    }
    self.register(TextFieldTableViewCell.self, forCellReuseIdentifier: NSStringFromClass(TextFieldTableViewCell.self))
    
    self.delegate = self
    self.dataSource = self
    
    let headerView = UIView(frame: CGRect.init(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 100))
    self.tableHeaderView = headerView
    let titleLabel = UILabel()
    headerView.addSubview(titleLabel)
    titleLabel.text = "创建身份"
    titleLabel.font = UIFont.systemFont(ofSize: 26, weight: .bold)
    titleLabel.translatesAutoresizingMaskIntoConstraints = false
    titleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor).isActive = true
    titleLabel.topAnchor.constraint(equalTo: headerView.topAnchor, constant: 0).isActive = true
    
    let subTitleLabel = UILabel()
    headerView.addSubview(subTitleLabel)
    subTitleLabel.text = "输入您的身份信息"
    subTitleLabel.font = UIFont.systemFont(ofSize: 17, weight: .regular)
    subTitleLabel.translatesAutoresizingMaskIntoConstraints = false
    subTitleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor).isActive = true
    subTitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16).isActive = true
    subTitleLabel.textAlignment = .center
    subTitleLabel.widthAnchor.constraint(lessThanOrEqualTo: headerView.widthAnchor, multiplier: 1, constant: -32).isActive = true
    
    headerView.addSubview(activityIndicator)
    activityIndicator.translatesAutoresizingMaskIntoConstraints = false
    activityIndicator.leadingAnchor.constraint(equalTo: titleLabel.trailingAnchor, constant: 10).isActive = true
    activityIndicator.centerYAnchor.constraint(equalTo: titleLabel.centerYAnchor).isActive = true
    activityIndicator.hidesWhenStopped = true
  }
  
  func formValueDidChange(name: String, value: String) {
    if (values[name] != nil) {
      values[name] = value
      resetSubmitButtonState()
    }
  }
  
  func resetSubmitButtonState() {
    nextButton?.isEnabled = values["name"] != "" && values["password"] != "" && values["confirmedPassword"] != ""
  }
  
  override func didMoveToWindow() {
    let vc = controller(for: self)
    nextButton = vc?.navigationItem.rightBarButtonItems?[0]
    nextButton?.target = self
    nextButton?.action = #selector(nextStep)
  }
  
  @objc func nextStep() {
    self.endEditing(false)
    
    if (self.onSubmit != nil) {
      if (values["name"]!.count > 12) {
        let vc = controller(for: self)
        let alert = UIAlertController(title: "身份名不超过12位", message: "", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default, handler: nil))
        vc?.present(alert, animated: true)
      } else if (values["password"]!.count < 8) {
        let vc = controller(for: self)
        let alert = UIAlertController(title: "密码不少于8位字符", message: "", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default, handler: nil))
        vc?.present(alert, animated: true)
      } else if (values["password"] != values["confirmedPassword"]) {
        let vc = controller(for: self)
        let alert = UIAlertController(title: "两次密码输入不一致", message: "", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default, handler: nil))
        vc?.present(alert, animated: true)
      } else {
        self.onSubmit!(["values": values])
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
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: NSStringFromClass(TextFieldTableViewCell.self), for: indexPath) as! TextFieldTableViewCell
    cell.name = data[indexPath.section][indexPath.row]["name"] ?? ""
    cell.label = data[indexPath.section][indexPath.row]["label"] ?? ""
    cell.placeholder = data[indexPath.section][indexPath.row]["placeholder"] ?? ""
    cell.isSecureTextEntry = data[indexPath.section][indexPath.row]["isSecure"] == "1"
    cell.formDelegate = self
    cell.selectionStyle = .none
    
    if #available(iOS 13.0, *) {
      cell.backgroundColor = .systemBackground
    }
    return cell
  }
  
  @objc func scan() {
    let toVC = ReactNativeViewController.init(moduleName: "Camera")
    toVC.view.backgroundColor = .black
    
    let vc = controller(for: self)
    toVC.modalPresentationStyle = .fullScreen
    vc?.present(toVC, animated: true)
  }
  
  func numberOfSections(in tableView: UITableView) -> Int {
    return data.count
  }
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data[section].count
  }
  
  func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    return 56
  }
}
