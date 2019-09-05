//
//  AddressBar.swift
//  AddressBar
//
//  Created by Terence Ge on 2019/9/4.
//  Copyright © 2019 Terence Ge. All rights reserved.
//

import UIKit

@objc(AddressBar)
class AddressBar: SPFakeBarView, UITextFieldDelegate {
    var titleViewText = "baidu.com"
    var placeHolderText = "请输入网址"
    var text = "http://www.baidu.com"
    var cancelButtonText = "取消"
    var isSecure = false
    
    var addressBar = UIView()
    var textFieldContainer = UIButton(type: .custom)
    var textField = UITextField()
    var titleView = UILabel()
    var cancelButton = UIButton(type: .system)
    
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
    var textFieldTrailingAnchorConstraint: NSLayoutConstraint?
    var textFieldLeadingAnchorConstraint: NSLayoutConstraint?
    var titleViewLeadingAnchorConstraint: NSLayoutConstraint?
    
    private func configureNavbar() {
        self.height = 50
    }
    
    private func configureAddressBar() {
        addressBar.translatesAutoresizingMaskIntoConstraints = false
        addressBar.leadingAnchor.constraint(equalTo: self.leadingAnchor).isActive = true
        addressBar.trailingAnchor.constraint(equalTo: self.trailingAnchor).isActive = true
        addressBar.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        addressBar.topAnchor.constraint(equalTo: self.topAnchor, constant: 0).isActive = true
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
        cancelButton.setTitle(self.cancelButtonText, for: .normal)
        
        cancelButton.titleLabel?.font = UIFont.systemFont(ofSize: 18)
        cancelButton.titleLabel?.textAlignment = .center
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
        textField.placeholder = self.placeHolderText
        textField.text = self.text
        textField.autocapitalizationType = .none
        textField.returnKeyType = .go
        
        textField.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
        textField.widthAnchor.constraint(equalTo: textFieldContainer.widthAnchor, constant: -38).isActive = true
        textField.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
        
        textFieldLeadingAnchorConstraint = textField.leadingAnchor.constraint(equalTo: textFieldContainer.leadingAnchor, constant: 8)
        textFieldLeadingAnchorConstraint?.isActive = true
        textField.alpha = 0
        
        let titleViewLeadingDistance = (UIScreen.main.bounds.width - 20) > titleView.frame.size.width ? ((UIScreen.main.bounds.width - 20 - titleView.frame.size.width) / 2) : 0
        textField.transform = CGAffineTransform.init(translationX: titleViewLeadingDistance, y: 0)
    }
    
    private func configureTitleView() {
        titleView.translatesAutoresizingMaskIntoConstraints = false
        titleView.font = UIFont.systemFont(ofSize: 17)
        titleView.text = self.titleViewText
        titleView.textColor = .black
        titleView.textAlignment = .left
        titleView.sizeToFit()
        
        titleView.heightAnchor.constraint(equalTo: textFieldContainer.heightAnchor).isActive = true
        titleView.centerYAnchor.constraint(equalTo: textFieldContainer.centerYAnchor).isActive = true
        // titleView.trailingAnchor.constraint(lessThanOrEqualTo: textFieldContainer.trailingAnchor, constant: -38).isActive = true
        
        textField.isUserInteractionEnabled = false
        
        titleViewLeadingAnchorConstraint = titleView.leadingAnchor.constraint(equalTo: textFieldContainer.leadingAnchor, constant: 8)
        titleViewLeadingAnchorConstraint?.isActive = true
        
        let titleViewLeadingDistance = (UIScreen.main.bounds.width - 20) > titleView.frame.size.width ? ((UIScreen.main.bounds.width - 20 - titleView.frame.size.width) / 2) : 0
        
        titleView.transform = CGAffineTransform.init(translationX: titleViewLeadingDistance, y: 0)
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
        
        rightViewButton.setImage(UIImage.init(named: "ETHWallet.png") , for: .normal)
        rightViewButton.setImage(UIImage.init(named: "ETHWallet.png") , for: .highlighted)
        rightViewButton.imageEdgeInsets = UIEdgeInsets(top: 5, left: 5, bottom: 5, right: 5)
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
    }
    
    private func commonInit() {
        self.addSubview(addressBar)
        addressBar.addSubview(textFieldContainer)
        addressBar.addSubview(cancelButton)
        textFieldContainer.addSubview(textField)
        textFieldContainer.addSubview(titleView)
        textFieldContainer.addSubview(rightViewContainer)
        textFieldContainer.addSubview(leftViewContainer)
        textFieldContainer.addSubview(clearButtonContainer)
        
        configureNavbar()
        configureAddressBar()
        configureTextFieldContainer()
        configureCancelButton()
        configureTitleView()
        configureTextField()
        configureRightViewContainer()
        configureLeftViewContainer()
        configureClearButtonContainer()
    }
    
    public init() {
        super.init(style: .stork)
        self.commonInit()
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.commonInit()
    }
    
    @objc func textFieldContainerClicked() {
        let point1 = CGPoint(x: 0.2, y: 0.43)
        let point2 = CGPoint(x: 0.5, y: 0.98)
        
        self.textField.isUserInteractionEnabled = true
        self.textField.becomeFirstResponder()
        self.textField.selectedTextRange = textField.textRange(from: self.textField.beginningOfDocument, to: self.textField.beginningOfDocument)
        self.rightViewContainer.alpha = 0
        self.clearButtonContainer.alpha = 1
        self.leftViewContainer.alpha = 0
        self.cancelButton.isUserInteractionEnabled = false
        self.clearButton.isUserInteractionEnabled = false
        
        let animator = UIViewPropertyAnimator(duration: 0.28, controlPoint1: point1, controlPoint2: point2) {
            self.textFieldContainerTrailingAnchorConstraint?.constant = -self.cancelButton.frame.size.width
            self.cancelButtonLeadingAnchorConstraint?.constant = -self.cancelButton.frame.size.width
            self.textField.transform = CGAffineTransform.init(translationX: 0, y: 0)
            self.titleView.transform = CGAffineTransform.init(translationX: 0, y: 0)
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
        })
        
        animator.startAnimation()
        
    }
    
    @objc func addressBarCancelButtonClicked() {
        self.textField.isUserInteractionEnabled = false
        let point1 = CGPoint(x: 0.2, y: 0.43)
        let point2 = CGPoint(x: 0.5, y: 0.98)
        self.textField.text = self.text
        
        self.rightViewContainer.alpha = 1
        self.leftViewContainer.alpha = 1
        
        let animator = UIViewPropertyAnimator(duration: 0.28, controlPoint1: point1, controlPoint2: point2) {
            self.textFieldContainerTrailingAnchorConstraint?.constant = -10
            self.cancelButtonLeadingAnchorConstraint?.constant = 0
            let titleViewLeadingDistance = (UIScreen.main.bounds.width - 20) > self.titleView.frame.size.width ? ((UIScreen.main.bounds.width - 20 - self.titleView.frame.size.width) / 2) : 0
            self.textField.transform = CGAffineTransform.init(translationX: titleViewLeadingDistance, y: 0)
            self.titleView.transform = CGAffineTransform.init(translationX: titleViewLeadingDistance, y: 0)
            self.rightViewButton.transform = CGAffineTransform.init(scaleX: 1, y: 1)
            self.clearButton.transform = CGAffineTransform.init(scaleX: 0.1, y: 0.1)
            self.clearButtonContainer.alpha = 0
            self.textField.alpha = 0
            self.titleView.alpha = 1
            self.layoutIfNeeded()
        }
        
        animator.addCompletion({ _ in
            
        })
        
        animator.startAnimation()
    }
}

