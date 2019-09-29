//
//  ViewController.swift
//  navigation
//
//  Created by Terence Ge on 2019/9/27.
//  Copyright © 2019 Terence Ge. All rights reserved.
//

import UIKit

@objc(ViewController)
class ViewController: UIViewController {

  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view.
    self.view.backgroundColor = .red
    if #available(iOS 11.0, *) {
      self.navigationItem.largeTitleDisplayMode = .never
    }
    self.title = "Goodbye"
  }
  
  override var prefersStatusBarHidden: Bool {
    return false
  }
}

