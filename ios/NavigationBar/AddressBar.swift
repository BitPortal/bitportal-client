//
//  AddressBar.swift
//  AddressBar
//
//  Created by Terence Ge on 2019/9/4.
//  Copyright © 2019 Terence Ge. All rights reserved.
//

import UIKit

@objc(AddressBar)
class AddressBar: UIView, UITextFieldDelegate {
  
  var onLeftButtonClicked: RCTDirectEventBlock?
  var onRightButtonClicked: RCTDirectEventBlock?
  var onSubmit: RCTDirectEventBlock?
  
  @objc(setOnLeftButtonClicked:)
  public func setOnLeftButtonClicked(eventBlock: RCTDirectEventBlock?) {
    self.onLeftButtonClicked = eventBlock
  }
  
  @objc(setOnRightButtonClicked:)
  public func setOnRightButtonClicked(eventBlock: RCTDirectEventBlock?) {
    self.onRightButtonClicked = eventBlock
  }
  
  @objc(setOnSubmit:)
  public func setOnSubmit(eventBlock: RCTDirectEventBlock?) {
    self.onSubmit = eventBlock
  }
  
  @objc(setTitle:)
  public func setTitle(title: String) {
    self.titleViewText = title
    self.titleView.setTitle(title, for: .normal)
  }
  
  @objc(setPlaceholder:)
  public func setPlaceholder(placeholder: String) {
    self.textField.placeholder = placeholder
  }
  
  @objc(setValue:)
  public func setValue(value: String) {
    if (self.isEditing) {
      self.addressBarCancelButtonClicked()
    }
    
    self.text = value
    self.textField.text = value
  }
  
  @objc(setIsSecure:)
  public func setIsSecure(isSecure: Bool) {
    self.isSecure = isSecure
    if (isSecure) {
      self.titleView.setImage(UIImage.init(named: "secure_address.png"), for: .normal)
    } else {
      self.titleView.setImage(nil, for: .normal)
    }
  }
  
  @objc(setCancelButtonText:)
  public func setCancelButtonText(cancelButtonText: String) {
    self.cancelButton.setTitle(cancelButtonText, for: .normal)
  }
  
  @objc(setChain:)
  public func setChain(chain: String) {
    self.chain = chain
    
    if (self.chain == "EOS") {
      self.rightViewButton.setImage(UIImage.init(named: "EOSWallet.png") , for: .normal)
      self.rightViewButton.setImage(UIImage.init(named: "EOSWallet.png") , for: .highlighted)
    } else if (self.chain == "ETHEREUM") {
      self.rightViewButton.setImage(UIImage.init(named: "ETHWallet.png") , for: .normal)
      self.rightViewButton.setImage(UIImage.init(named: "ETHWallet.png") , for: .highlighted)
    }
  }
  
  var chain = ""
  var titleViewText = "请输入网址"
  var text = ""
  var cancelButtonText = "取消"
  var isSecure = false
  var isEditing = false
  
  var addressBar = UIView()
  var textFieldContainer = UIButton(type: .custom)
  var textField = UITextField()
  var titleView = UIButton(type: .custom)
  var cancelButton = UIButton(type: .system)
  var separator = UIView()
  
  var clearButtonContainer = UIView()
  var clearButton = UIButton(type: .system)
  
  var rightViewContainer = UIView()
  var leftViewContainer = UIView()
  var rightViewButton = UIButton()
  var leftViewButton = UIButton()
  var rightViewImage = UIImage()
  var leftViewImage = UIImage()
  
  var cancelButtonLeadingAnchorConstraint: NSLayoutConstraint?
  var cancelButtonTrailingAnchorConstraint: NSLayoutConstraint?
  var textFieldContainerTrailingAnchorConstraint: NSLayoutConstraint?
  var addressBarTopAnchorConstraint: NSLayoutConstraint?
  
  var textFieldTrailingAnchorConstraint: NSLayoutConstraint?
  var textFieldLeadingAnchorConstraint: NSLayoutConstraint?
  var titleViewLeadingAnchorConstraint: NSLayoutConstraint?
  var titleViewLeadingAnchorConstraint2: NSLayoutConstraint?
  var titleViewCenterXAnchorConstraint: NSLayoutConstraint?
  
  private func configureNavbar() {
    // let statusBarHeight = UIApplication.shared.statusBarFrame.height
    // self.height = 50
  }
  
  private func configureAddressBar() {
    // let statusBarHeight = UIApplication.shared.statusBarFrame.height
    addressBar.translatesAutoresizingMaskIntoConstraints = false
    addressBar.trailingAnchor.constraint(equalTo: self.trailingAnchor).isActive = true
    addressBar.leadingAnchor.constraint(equalTo: self.leadingAnchor).isActive = true
    addressBar.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: 0).isActive = true
    addressBarTopAnchorConstraint = addressBar.topAnchor.constraint(equalTo: self.topAnchor, constant: 0)
    addressBarTopAnchorConstraint?.isActive = true
  }
  
  private func configureTextFieldContainer() {
    textFieldContainer.translatesAutoresizingMaskIntoConstraints = false
    textFieldContainer.leadingAnchor.constraint(equalTo: addressBar.leadingAnchor, constant: 10).isActive = true
    textFieldContainer.topAnchor.constraint(equalTo: addressBar.topAnchor, constant: 4).isActive = true
    textFieldContainer.heightAnchor.constraint(equalToConstant: 36).isActive = true
    // textFieldContainer.centerYAnchor.constraint(equalTo: addressBar.centerYAnchor).isActive = true
    textFieldContainerTrailingAnchorConstraint = textFieldContainer.trailingAnchor.constraint(equalTo: addressBar.trailingAnchor, constant: -10)
    textFieldContainerTrailingAnchorConstraint?.isActive = true
    
    let normalBackgroundColor = UIColor.init(displayP3Red: 142 / 255, green: 142 / 255, blue: 149 / 255, alpha: 0.15)
    self.setBackgroundColor(color: normalBackgroundColor, forState: .normal)
    
    let selectedBackgroundColor = UIColor.init(displayP3Red: 142 / 255, green: 142 / 255, blue: 149 / 255, alpha: 0.3)
    self.setBackgroundColor(color: selectedBackgroundColor, forState: .highlighted)
    
    textFieldContainer.layer.cornerRadius = 10
    textFieldContainer.clipsToBounds = true
    textFieldContainer.isUserInteractionEnabled = true
    
    textFieldContainer.addTarget(self, action: #selector(textFieldContainerClicked), for: .touchUpInside)
    
    var frame = textFieldContainer.frame
    frame.size.width = UIScreen.main.bounds.width - 20
    textFieldContainer.frame = frame
    
  }
  
  private func setBackgroundColor(color: UIColor, forState: UIControl.State) {
    let minimumSize: CGSize = CGSize(width: 1.0, height: 1.0)
    
    UIGraphicsBeginImageContext(minimumSize)
    
    if let context = UIGraphicsGetCurrentContext() {
      context.setFillColor(color.cgColor)
      context.fill(CGRect(origin: .zero, size: minimumSize))
    }
    
    let colorImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    
    self.textFieldContainer.setBackgroundImage(colorImage, for: forState)
  }
  
  private func configureCancelButton() {
    cancelButton.translatesAutoresizingMaskIntoConstraints = false
    
    cancelButton.titleLabel?.font = UIFont.systemFont(ofSize: 18)
    cancelButton.titleLabel?.textAlignment = .center
    cancelButton.setTitle("取消", for: .normal)
    cancelButton.sizeToFit()
    
    cancelButton.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    cancelButton.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
    cancelButtonLeadingAnchorConstraint = cancelButton.leadingAnchor.constraint(equalTo: addressBar.trailingAnchor, constant: 0)
    cancelButtonLeadingAnchorConstraint?.isActive = true
    
    cancelButton.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
    cancelButton.addTarget(self, action: #selector(addressBarCancelButtonClicked), for: .touchUpInside)
  }
  
  private func configureTextField() {
    textField.translatesAutoresizingMaskIntoConstraints = false
    textField.clearButtonMode = .never
    textField.font = UIFont.systemFont(ofSize: 15)
    textField.delegate = self
    textField.text = self.text
    textField.placeholder = "请输入网址"
    textField.autocapitalizationType = .none
    textField.returnKeyType = .go
    
    textField.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    textField.widthAnchor.constraint(equalTo: textFieldContainer.widthAnchor, constant: -38).isActive = true
    textField.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
    
    textFieldLeadingAnchorConstraint = textField.leadingAnchor.constraint(equalTo: titleView.leadingAnchor, constant: 0)
    textFieldLeadingAnchorConstraint?.isActive = true
    textField.alpha = 0
    
    // let titleViewLeadingDistance = (UIScreen.main.bounds.width - 20) > titleView.frame.size.width ? ((UIScreen.main.bounds.width - 20 - titleView.frame.size.width) / 2) : 0
    // textField.transform = CGAffineTransform.init(translationX: titleViewLeadingDistance, y: 0)
  }
  
  private func configureTitleView() {
    titleView.translatesAutoresizingMaskIntoConstraints = false
    
//    titleView.titleLabel?.text = self.titleViewText
//    titleView.titleLabel?.textColor = .black
//    titleView.titleLabel?.textAlignment = .left
//    titleView.titleLabel?.sizeToFit()
    titleView.titleLabel?.font = UIFont.systemFont(ofSize: 17)
    titleView.setTitle(self.titleViewText, for: .normal)
    titleView.setTitleColor(.black, for: .normal)
    titleView.imageView?.contentMode = .scaleAspectFit
    titleView.imageEdgeInsets = UIEdgeInsets(top: 10, left: -6, bottom: 10, right: 0)
    // titleView.backgroundColor = .blue
    
    if (isSecure) {
      titleView.setImage(UIImage.init(named: "secure_address.png"), for: .normal)
    } else {
      titleView.setImage(nil, for: .normal)
    }
    
    // titleView.widthAnchor.constraint(equalTo: titleLabel.widthAnchor).isActive = true
    
    titleView.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    titleView.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
    // titleView.trailingAnchor.constraint(lessThanOrEqualTo: textFieldContainer.trailingAnchor, constant: -38).isActive = true
    
    textField.isUserInteractionEnabled = false
    
    titleViewLeadingAnchorConstraint = titleView.leadingAnchor.constraint(greaterThanOrEqualTo: textFieldContainer.leadingAnchor, constant: 38)
    titleViewLeadingAnchorConstraint?.isActive = true
    titleViewLeadingAnchorConstraint2 = titleView.leadingAnchor.constraint(equalTo: textFieldContainer.leadingAnchor, constant: 8)
    
    titleViewCenterXAnchorConstraint = titleView.centerXAnchor.constraint(equalTo: textFieldContainer.centerXAnchor, constant: 8)
    titleViewCenterXAnchorConstraint?.isActive = true
    
    titleView.isUserInteractionEnabled = false
  }
  
  private func configureRightViewContainer() {
    rightViewContainer.translatesAutoresizingMaskIntoConstraints = false
    
    rightViewContainer.widthAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    rightViewContainer.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    rightViewContainer.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
    rightViewContainer.trailingAnchor.constraint(equalTo: textFieldContainer.trailingAnchor).isActive = true
    
    // let gradientLayer = CAGradientLayer()
    // gradientLayer.frame = textFieldContainer.bounds
    //        gradientLayer.frame.origin = titleView.frame.origin
    //        gradientLayer.frame.size = CGSize(width: UIScreen.main.bounds.width  - 16 - 38, height: 38)
    //        gradientLayer.colors = [UIColor.clear.cgColor, UIColor.clear.cgColor, UIColor.init(displayP3Red: 142 / 255, green: 142 / 255, blue: 149 / 255, alpha: 0.18).cgColor, UIColor.init(displayP3Red: 142 / 255, green: 142 / 255, blue: 149 / 255, alpha: 0.18).cgColor]
    //        gradientLayer.locations = [0, 0.8, 0.9, 1.0]
    //        gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)
    //        gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)
    //        titleView.layer.addSublayer(gradientLayer)
    
    rightViewButton = UIButton.init(type: .custom)
    rightViewContainer.addSubview(rightViewButton)
    rightViewButton.translatesAutoresizingMaskIntoConstraints = false
    rightViewButton.centerXAnchor.constraint(equalTo: rightViewContainer.centerXAnchor).isActive = true
    rightViewButton.centerYAnchor.constraint(equalTo: rightViewContainer.centerYAnchor).isActive = true
    rightViewButton.widthAnchor.constraint(equalTo: rightViewContainer.widthAnchor).isActive = true
    rightViewButton.heightAnchor.constraint(equalTo: rightViewContainer.heightAnchor).isActive = true
    
    if (chain == "EOS") {
      rightViewButton.setImage(UIImage.init(named: "EOSWallet.png") , for: .normal)
      rightViewButton.setImage(UIImage.init(named: "EOSWallet.png") , for: .highlighted)
    } else if (chain == "ETHEREUM") {
      rightViewButton.setImage(UIImage.init(named: "ETHWallet.png") , for: .normal)
      rightViewButton.setImage(UIImage.init(named: "ETHWallet.png") , for: .highlighted)
    } else {
      rightViewButton.setImage(UIImage.init(named: "identity_nav.png") , for: .normal)
      rightViewButton.setImage(UIImage.init(named: "identity_nav.png") , for: .highlighted)
    }
    
    rightViewButton.imageEdgeInsets = UIEdgeInsets(top: 5, left: 5, bottom: 5, right: 5)
    rightViewButton.addTarget(self, action: #selector(rightViewButtonClicked), for: .touchUpInside)
  }
  
  @objc func rightViewButtonClicked() {
    if (self.onRightButtonClicked != nil) {
      self.onRightButtonClicked!([:])
    }
  }
  
  private func configureLeftViewContainer() {
    leftViewContainer.translatesAutoresizingMaskIntoConstraints = false
    
    leftViewContainer.widthAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    leftViewContainer.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    leftViewContainer.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
    leftViewContainer.leadingAnchor.constraint(equalTo: textFieldContainer.leadingAnchor).isActive = true
    
    leftViewButton = UIButton.init(type: .custom)
    leftViewContainer.addSubview(leftViewButton)
    leftViewButton.translatesAutoresizingMaskIntoConstraints = false
    leftViewButton.centerXAnchor.constraint(equalTo: leftViewContainer.centerXAnchor).isActive = true
    leftViewButton.centerYAnchor.constraint(equalTo: leftViewContainer.centerYAnchor).isActive = true
    leftViewButton.widthAnchor.constraint(equalTo: leftViewContainer.widthAnchor).isActive = true
    leftViewButton.heightAnchor.constraint(equalTo: leftViewContainer.heightAnchor).isActive = true
    
    leftViewButton.setImage(UIImage.init(named: "nav_close_black.png") , for: .normal)
    leftViewButton.setImage(UIImage.init(named: "nav_close_black.png") , for: .highlighted)
    leftViewButton.imageEdgeInsets = UIEdgeInsets(top: 6, left: 6, bottom: 6, right: 6)
    
    leftViewButton.addTarget(self, action: #selector(leftViewButtonClicked), for: .touchUpInside)
  }
  
  @objc func leftViewButtonClicked() {
    if (self.onLeftButtonClicked != nil) {
      self.onLeftButtonClicked!([:])
    }
  }
  
  private func configureClearButtonContainer() {
    clearButtonContainer.translatesAutoresizingMaskIntoConstraints = false
    
    clearButtonContainer.widthAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    clearButtonContainer.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
    clearButtonContainer.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
    clearButtonContainer.trailingAnchor.constraint(equalTo: textFieldContainer.trailingAnchor).isActive = true
    
    clearButton = UIButton.init(type: .custom)
    clearButtonContainer.addSubview(clearButton)
    
    clearButton.translatesAutoresizingMaskIntoConstraints = false
    clearButton.centerXAnchor.constraint(equalTo: rightViewContainer.centerXAnchor).isActive = true
    clearButton.centerYAnchor.constraint(equalTo: rightViewContainer.centerYAnchor).isActive = true
    clearButton.widthAnchor.constraint(equalTo: rightViewContainer.widthAnchor).isActive = true
    clearButton.heightAnchor.constraint(equalTo: rightViewContainer.heightAnchor).isActive = true
    
    clearButton.setImage(UIImage.init(named: "clear.png") , for: .normal)
    clearButton.setImage(UIImage.init(named: "clear.png") , for: .highlighted)
    clearButton.imageEdgeInsets = UIEdgeInsets(top: 10.5, left: 10.5, bottom: 10.5, right: 10.5)
    clearButton.transform = CGAffineTransform.init(scaleX: 0.1, y: 0.1)
    clearButtonContainer.alpha = 0
    // clearButton.backgroundColor = .red
    clearButton.addTarget(self, action: #selector(clearButtonClicked), for: .touchUpInside)
  }
  
  private func configureSeparator() {
    separator.translatesAutoresizingMaskIntoConstraints = false
    separator.backgroundColor = UIColor.init(red: 191 / 255.0, green: 191 / 255.0, blue: 191 / 255.0, alpha: 1)
    separator.leadingAnchor.constraint(equalTo: self.addressBar.leadingAnchor).isActive = true
    separator.trailingAnchor.constraint(equalTo: self.addressBar.trailingAnchor).isActive = true
    separator.bottomAnchor.constraint(equalTo: self.addressBar.bottomAnchor).isActive = true
    separator.heightAnchor.constraint(equalToConstant: 0.5).isActive = true
  }
  
  @objc func clearButtonClicked() {
    self.clearButtonContainer.alpha = 0
    self.textField.text = ""
  }
  
  private func commonInit() {
    self.addSubview(addressBar)
    addressBar.addSubview(separator)
    addressBar.addSubview(textFieldContainer)
    addressBar.addSubview(cancelButton)
    textFieldContainer.addSubview(textField)
    textFieldContainer.addSubview(titleView)
    textFieldContainer.addSubview(rightViewContainer)
    textFieldContainer.addSubview(leftViewContainer)
    textFieldContainer.addSubview(clearButtonContainer)
    textFieldContainer.bringSubviewToFront(clearButtonContainer)
    textFieldContainer.bringSubviewToFront(leftViewContainer)
    textFieldContainer.bringSubviewToFront(rightViewContainer)
    
    configureNavbar()
    configureAddressBar()
    configureSeparator()
    configureTextFieldContainer()
    configureCancelButton()
    configureTitleView()
    configureTextField()
    configureRightViewContainer()
    configureLeftViewContainer()
    configureClearButtonContainer()
    
    NotificationCenter.default.addObserver(self, selector: #selector(statusBarHeightChanged), name: UIApplication.willChangeStatusBarFrameNotification, object: nil)
  }
  
  @objc func statusBarHeightChanged() {
    // self.layoutIfNeeded()
  }
  
  public override init(frame: CGRect) {
    super.init(frame: frame)
    self.commonInit()
  }
  
  required public init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    self.commonInit()
  }
  
  @objc func textFieldContainerClicked() {
    let point1 = CGPoint(x: 0.35, y: 0.0)
    let point2 = CGPoint(x: 0.32, y: 0.96)
    
    self.textField.isUserInteractionEnabled = true
    self.textField.becomeFirstResponder()
    self.textField.text = self.text
    self.textField.selectedTextRange = textField.textRange(from: self.textField.beginningOfDocument, to: self.textField.beginningOfDocument)
    self.rightViewContainer.alpha = 0
    self.clearButtonContainer.alpha = 1
    self.leftViewContainer.alpha = 0
    self.cancelButton.isUserInteractionEnabled = false
    self.clearButton.isUserInteractionEnabled = false
    
    let animator = UIViewPropertyAnimator(duration: 0.28, controlPoint1: point1, controlPoint2: point2) {
      self.textFieldContainerTrailingAnchorConstraint?.constant = -self.cancelButton.frame.size.width
      self.cancelButtonLeadingAnchorConstraint?.constant = -self.cancelButton.frame.size.width
      
      self.titleViewCenterXAnchorConstraint?.isActive = false
      self.titleViewLeadingAnchorConstraint?.isActive = false
      self.titleViewLeadingAnchorConstraint2?.isActive = true
      
      self.rightViewButton.transform = CGAffineTransform.init(scaleX: 0.1, y: 0.1)
      self.clearButton.transform = CGAffineTransform.init(scaleX: 1, y: 1)
      self.textField.alpha = 1
      self.titleView.alpha = 0
      self.layoutIfNeeded()
    }
    
    animator.addCompletion({ _ in
      self.textField.selectAll(nil)
      self.cancelButton.isUserInteractionEnabled = true
      self.clearButton.isUserInteractionEnabled = true
      self.isEditing = true
    })
    
    animator.startAnimation()
    
  }
  
  @objc func addressBarCancelButtonClicked() {
    self.textField.isUserInteractionEnabled = false
    let point1 = CGPoint(x: 0.35, y: 0.0)
    let point2 = CGPoint(x: 0.32, y: 0.96)
    // self.textField.resignFirstResponder()
    
    self.rightViewContainer.alpha = 1
    self.leftViewContainer.alpha = 1
    
    let animator = UIViewPropertyAnimator(duration: 0.28, controlPoint1: point1, controlPoint2: point2) {
      self.textFieldContainerTrailingAnchorConstraint?.constant = -10
      self.cancelButtonLeadingAnchorConstraint?.constant = 0
      
      self.titleViewCenterXAnchorConstraint?.isActive = true
      self.titleViewLeadingAnchorConstraint?.isActive = true
      self.titleViewLeadingAnchorConstraint2?.isActive = false
      
      self.rightViewButton.transform = CGAffineTransform.init(scaleX: 1, y: 1)
      self.clearButton.transform = CGAffineTransform.init(scaleX: 0.1, y: 0.1)
      self.clearButtonContainer.alpha = 0
      self.textField.alpha = 0
      self.titleView.alpha = 1
      self.layoutIfNeeded()
    }
    
    animator.addCompletion({ _ in
      self.isEditing = false
    })
    
    animator.startAnimation()
  }
  
  func textFieldShouldBeginEditing(_ textField: UITextField) -> Bool {
    return true
  }
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if (textField.text?.count == 0 || textField.text == self.text) {
      self.addressBarCancelButtonClicked()
    } else if (self.onSubmit != nil) {
      self.onSubmit!(["text": textField.text])
    }
    
    return true
  }
  
  func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
    self.textField.selectedTextRange = textField.textRange(from: self.textField.beginningOfDocument, to: self.textField.beginningOfDocument)
    return true
  }
  
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    if (range.length == textField.text?.count && string.count == 0) {
      self.clearButtonContainer.alpha = 0
    } else {
      self.clearButtonContainer.alpha = 1
    }
    
    return true
  }
}

