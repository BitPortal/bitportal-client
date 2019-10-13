//
//  FormDelagte.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/8.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc public protocol FormDelagte: class {
  @objc func formValueDidChange(name: String, value: String)
}
