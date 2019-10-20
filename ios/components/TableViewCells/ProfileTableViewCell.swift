//
//  ProfileTableViewCell.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/2.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class ProfileTableViewCell: UITableViewCell {
  override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
    super.init(style: .subtitle, reuseIdentifier: reuseIdentifier)
    self.imageView?.image = UIImage.init(named: "avatarPlaceholder.png")
    self.textLabel?.font = UIFont.systemFont(ofSize: 22)
    self.detailTextLabel?.font = UIFont.systemFont(ofSize: 16)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func awakeFromNib() {
    super.awakeFromNib()
    // Initialization code
  }
  
  override func setSelected(_ selected: Bool, animated: Bool) {
    super.setSelected(selected, animated: animated)
    
    // Configure the view for the selected state
  }
}
