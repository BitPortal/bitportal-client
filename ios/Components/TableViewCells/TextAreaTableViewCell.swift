//
//  TextAreaTableViewCell.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/5.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class TextAreaTableViewCell: UITableViewCell, UITextViewDelegate {
  var textView = UITextView()
  var clearButton: UIButton?
  var name: String?
  var formDelegate: FormDelagte?
  var scanButton: UIButton? = nil {
    didSet {
      if (scanButton != nil) {
        self.contentView.addSubview(scanButton!)
        scanButton?.translatesAutoresizingMaskIntoConstraints = false
        scanButton?.trailingAnchor.constraint(equalTo: self.contentView.trailingAnchor, constant: -2).isActive = true
        scanButton?.topAnchor.constraint(equalTo: self.contentView.topAnchor, constant: 6).isActive = true
        scanButton?.widthAnchor.constraint(equalToConstant: 30).isActive = true
        scanButton?.heightAnchor.constraint(equalToConstant: 30).isActive = true
      }
    }
  }
  
  var placeholder: String = "" {
    didSet {
      textView.text = placeholder
      if #available(iOS 13.0, *) {
        textView.textColor = .tertiaryLabel
      }
      textView.selectedTextRange = textView.textRange(from: textView.beginningOfDocument, to: textView.beginningOfDocument)
    }
  }
  
  override func awakeFromNib() {
    super.awakeFromNib()
    // Initialization code
  }
  
  override func setSelected(_ selected: Bool, animated: Bool) {
    super.setSelected(selected, animated: animated)
    
    // Configure the view for the selected state
  }
  
  override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
    super.init(style: .default, reuseIdentifier: reuseIdentifier)
    self.setupView()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func setupView() {
    self.textView.delegate = self
    contentView.addSubview(textView)
    textView.translatesAutoresizingMaskIntoConstraints = false
    textView.heightAnchor.constraint(equalTo: contentView.heightAnchor).isActive = true
    textView.widthAnchor.constraint(equalTo: contentView.widthAnchor).isActive = true
    textView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor).isActive = true
    textView.topAnchor.constraint(equalTo: contentView.topAnchor).isActive = true
    textView.font = UIFont.systemFont(ofSize: 17)
    textView.textContainerInset = UIEdgeInsets.init(top: 12, left: 11, bottom: 12, right: 24)
    textView.autocapitalizationType = .none
    textView.isEditable = true
    
    if #available(iOS 13.0, *) {
      clearButton = UIButton.systemButton(with: UIImage.init(named: "clearCircle.png")!, target: self, action: #selector(clearTextView))
      contentView.addSubview(clearButton!)
      clearButton?.translatesAutoresizingMaskIntoConstraints = false
      clearButton?.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -2).isActive = true
      clearButton?.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -6).isActive = true
      clearButton?.tintColor = .tertiaryLabel
      clearButton?.imageEdgeInsets = UIEdgeInsets.init(top: 5, left: 5, bottom: 5, right: 5)
      clearButton?.widthAnchor.constraint(equalToConstant: 24).isActive = true
      clearButton?.heightAnchor.constraint(equalToConstant: 24).isActive = true
      clearButton?.alpha = 0
      // clearButton?.backgroundColor = .red
    } else {
      // Fallback on earlier versions
    }
    
  }
  
  @objc func clearTextView() {
    self.textView.text = ""
    formDelegate?.formValueDidChange(name: self.name ?? "", value: "")
    self.clearButton?.alpha = 0
    textView.text = self.placeholder
    if #available(iOS 13.0, *) {
      textView.textColor = .tertiaryLabel
    }
    textView.selectedTextRange = textView.textRange(from: textView.beginningOfDocument, to: textView.beginningOfDocument)
  }
  
  func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
    // Combine the textView text and the replacement text to
    // create the updated text string
    let currentText:String = textView.text
    let updatedText = (currentText as NSString).replacingCharacters(in: range, with: text)
    
    // If updated text view will be empty, add the placeholder
    // and set the cursor to the beginning of the text view
    if #available(iOS 13.0, *) {
      if updatedText.isEmpty {
        textView.text = self.placeholder
        textView.textColor = .tertiaryLabel
        textView.selectedTextRange = textView.textRange(from: textView.beginningOfDocument, to: textView.beginningOfDocument)
        formDelegate?.formValueDidChange(name: self.name ?? "", value: "")
        self.clearButton?.alpha = 0
      } else if textView.textColor == .tertiaryLabel && !text.isEmpty {
        textView.textColor = .label
        textView.text = text
        formDelegate?.formValueDidChange(name: self.name ?? "", value: text)
        self.clearButton?.alpha = 1
      } else {
        if (textView.textColor != .tertiaryLabel) {
          formDelegate?.formValueDidChange(name: self.name ?? "", value: updatedText)
          self.clearButton?.alpha = 1
        }
        return true
      }
    } else {
      // Fallback on earlier versions
    }
    
    // ...otherwise return false since the updates have already
    // been made
    return false
  }
  
  func textViewDidChangeSelection(_ textView: UITextView) {
    if #available(iOS 13.0, *) {
      if textView.textColor == .tertiaryLabel {
        textView.selectedTextRange = textView.textRange(from: textView.beginningOfDocument, to: textView.beginningOfDocument)
      }
    } else {
      // Fallback on earlier versions
    }
  }
  
  func textViewShouldBeginEditing(_ textView: UITextView) -> Bool {
    if #available(iOS 13.0, *) {
      if (!textView.text.isEmpty && textView.textColor != .tertiaryLabel) {
        self.clearButton?.alpha = 1
      } else {
        self.clearButton?.alpha = 0
      }
    } else {
      // Fallback on earlier versions
    }
    
    return true
  }
  
  func textViewShouldEndEditing(_ textView: UITextView) -> Bool {
    self.clearButton?.alpha = 0
    
    return true
  }
}
