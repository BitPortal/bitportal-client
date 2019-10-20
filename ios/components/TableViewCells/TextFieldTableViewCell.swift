//
//  TextFieldTableViewCell.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/5.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class TextFieldTableViewCell: UITableViewCell, UITextFieldDelegate {
  var textField = UITextField()
  var fieldLabel = UILabel()
  var name: String?
  var formDelegate: FormDelagte?
  
  var label: String = "" {
    didSet {
      self.fieldLabel.text = label
    }
  }
  
  var placeholder: String = "" {
    didSet {
      self.textField.placeholder = placeholder
    }
  }
  
  var isSecureTextEntry: Bool = false {
    didSet {
      self.textField.isSecureTextEntry = isSecureTextEntry
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
    self.textField.delegate = self
    contentView.addSubview(fieldLabel)
    fieldLabel.translatesAutoresizingMaskIntoConstraints = false
    fieldLabel.heightAnchor.constraint(equalTo: contentView.heightAnchor).isActive = true
    fieldLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16).isActive = true
    fieldLabel.topAnchor.constraint(equalTo: contentView.topAnchor).isActive = true
    fieldLabel.widthAnchor.constraint(equalToConstant: 70).isActive = true
    fieldLabel.font = UIFont.systemFont(ofSize: 16, weight: .medium)
    
    contentView.addSubview(textField)
    textField.translatesAutoresizingMaskIntoConstraints = false
    textField.heightAnchor.constraint(equalTo: contentView.heightAnchor).isActive = true
    textField.widthAnchor.constraint(equalTo: contentView.widthAnchor, constant: -86).isActive = true
    textField.leadingAnchor.constraint(equalTo: fieldLabel.trailingAnchor).isActive = true
    textField.topAnchor.constraint(equalTo: contentView.topAnchor).isActive = true
    textField.clearButtonMode = .whileEditing
    let paddingView: UIView = UIView(frame: CGRect(x: 0, y: 0, width: 16, height: textField.frame.size.height))
    textField.leftView = paddingView
    textField.leftViewMode = .always
    textField.autocapitalizationType = .none
  }
  
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    let updatedString = (textField.text as NSString?)?.replacingCharacters(in: range, with: string)
    self.formDelegate?.formValueDidChange(name: self.name ?? "", value: updatedString ?? "")
    return true
  }
  
  func textFieldShouldClear(_ textField: UITextField) -> Bool {
    self.formDelegate?.formValueDidChange(name: self.name ?? "", value: "")
    return true
  }
}
