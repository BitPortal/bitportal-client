//
//  BackupIdentityView.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class BackupIdentityView: UIScrollView {
  var mnemonicsTextView = UILabel()
  var headerView = UIView(frame: CGRect.init(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 100))
  var mnemonicsView = UIView(frame: CGRect.init(x: 0, y: 116, width: UIScreen.main.bounds.size.width, height: 80))
  var subTitleLabel = UILabel()

  var nextButton: UIBarButtonItem?
  var onSubmit: RCTDirectEventBlock?
  var activityIndicator = UIActivityIndicatorView()
  var mnemonics: String?

  var shuffledButtonsContainer = UIView()
  var recoveredButtonsContainer = UIView()
  var shuffledButtons = [UIButton]()
  var recoveredButtons = [UIButton]()

  @objc(setOnSubmit:)
  public func setOnSubmit(eventBlock: RCTDirectEventBlock?) {
    self.onSubmit = eventBlock
  }

  @objc(setLoading:)
  public func setLoading(loading: Bool) {
    self.loading = loading
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
    let errorMessage = message
    let vc = self.controller(for: self)
    let alert = UIAlertController(title: errorMessage, message: "", preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "确定", style: .default, handler: nil))
    vc?.present(alert, animated: true)
    self.nextButton?.isEnabled = true
  }

  public func submitSucceeded() {
    SPAlert.present(title: "助记词顺序正确!", preset: SPAlertPreset.done)

    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
      let vc = self.controller(for: self)
      vc?.dismiss(animated: true, completion: nil)
      self.nextButton?.isEnabled = true
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
  }

  convenience init() {
    self.init(frame: CGRect.zero)
    setupView()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  func setupView() {
    mnemonics = UserDefaults.standard.string(forKey: "mnemonics") ?? ""
    UserDefaults.standard.removeObject(forKey: "mnemonics")

    if #available(iOS 13.0, *) {
      self.backgroundColor = .systemBackground
    }

    self.addSubview(headerView)

    let titleLabel = UILabel()
    headerView.addSubview(titleLabel)
    titleLabel.text = "备份身份"
    titleLabel.font = UIFont.systemFont(ofSize: 26, weight: .bold)
    titleLabel.translatesAutoresizingMaskIntoConstraints = false
    titleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor).isActive = true
    titleLabel.topAnchor.constraint(equalTo: headerView.topAnchor, constant: 0).isActive = true

    headerView.addSubview(subTitleLabel)

    let subTitleText = "请仔细抄写下方助记词，我们将在下一步验证。"
    let paragraphStyle = NSMutableParagraphStyle()
    paragraphStyle.lineSpacing = 1.8
    let attrString = NSMutableAttributedString(string: subTitleText)
    attrString.addAttribute(NSAttributedString.Key.paragraphStyle, value:paragraphStyle, range:NSMakeRange(0, subTitleText.count))
    subTitleLabel.attributedText = attrString

    subTitleLabel.font = UIFont.systemFont(ofSize: 17, weight: .regular)
    subTitleLabel.translatesAutoresizingMaskIntoConstraints = false
    subTitleLabel.centerXAnchor.constraint(equalTo: headerView.centerXAnchor).isActive = true
    subTitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16).isActive = true
    subTitleLabel.textAlignment = .center
    subTitleLabel.widthAnchor.constraint(lessThanOrEqualTo: headerView.widthAnchor, multiplier: 1, constant: -64).isActive = true
    subTitleLabel.numberOfLines = 0

    headerView.addSubview(activityIndicator)
    activityIndicator.translatesAutoresizingMaskIntoConstraints = false
    activityIndicator.leadingAnchor.constraint(equalTo: titleLabel.trailingAnchor, constant: 10).isActive = true
    activityIndicator.centerYAnchor.constraint(equalTo: titleLabel.centerYAnchor).isActive = true
    activityIndicator.hidesWhenStopped = true

    self.addSubview(mnemonicsView)

    mnemonicsTextView.text = self.mnemonics
    mnemonicsView.addSubview(mnemonicsTextView)
    mnemonicsTextView.translatesAutoresizingMaskIntoConstraints = false
    mnemonicsTextView.font = UIFont.systemFont(ofSize: 17, weight: .regular)
    mnemonicsTextView.leadingAnchor.constraint(equalTo: mnemonicsView.leadingAnchor, constant: 16).isActive = true
    mnemonicsTextView.centerYAnchor.constraint(equalTo: mnemonicsView.centerYAnchor).isActive = true
    mnemonicsTextView.textAlignment = .left
    mnemonicsTextView.widthAnchor.constraint(lessThanOrEqualTo: headerView.widthAnchor, multiplier: 1, constant: -32).isActive = true
    mnemonicsTextView.numberOfLines = 0

    let topSeparator = UIView()
    mnemonicsView.addSubview(topSeparator)
    topSeparator.translatesAutoresizingMaskIntoConstraints = false
    topSeparator.leadingAnchor.constraint(equalTo: mnemonicsView.leadingAnchor).isActive = true
    topSeparator.trailingAnchor.constraint(equalTo: mnemonicsView.trailingAnchor).isActive = true
    topSeparator.topAnchor.constraint(equalTo: mnemonicsView.topAnchor).isActive = true
    topSeparator.heightAnchor.constraint(equalToConstant: 0.5).isActive = true

    let bottomSeparator = UIView()
    mnemonicsView.addSubview(bottomSeparator)
    bottomSeparator.translatesAutoresizingMaskIntoConstraints = false
    bottomSeparator.leadingAnchor.constraint(equalTo: mnemonicsView.leadingAnchor).isActive = true
    bottomSeparator.trailingAnchor.constraint(equalTo: mnemonicsView.trailingAnchor).isActive = true
    bottomSeparator.bottomAnchor.constraint(equalTo: mnemonicsView.bottomAnchor).isActive = true
    bottomSeparator.heightAnchor.constraint(equalToConstant: 0.5).isActive = true

    if #available(iOS 13.0, *) {
      topSeparator.backgroundColor = .separator
      bottomSeparator.backgroundColor = .separator
    }
  }

  func createVerifyView() {
    mnemonicsView.addSubview(shuffledButtonsContainer)
    shuffledButtonsContainer.translatesAutoresizingMaskIntoConstraints = false
    shuffledButtonsContainer.topAnchor.constraint(equalTo: mnemonicsView.topAnchor).isActive = true
    shuffledButtonsContainer.leadingAnchor.constraint(equalTo: mnemonicsView.leadingAnchor).isActive = true
    shuffledButtonsContainer.bottomAnchor.constraint(equalTo: mnemonicsView.bottomAnchor).isActive = true
    shuffledButtonsContainer.trailingAnchor.constraint(equalTo: mnemonicsView.trailingAnchor).isActive = true

    let shuffledWords = mnemonics?.split(separator: " ").shuffled()
    for word in shuffledWords! {
      let wordButton = createWordButton(word: String(word))
      wordButton.addTarget(self, action: #selector(shuffledWordClicked(sender:)), for: .touchUpInside)
      shuffledButtonsContainer.addSubview(wordButton)
      shuffledButtons.append(wordButton)
    }

    layoutShuffledButtons(true)
    shuffledButtonsContainer.alpha = 0

    headerView.addSubview(recoveredButtonsContainer)
    recoveredButtonsContainer.translatesAutoresizingMaskIntoConstraints = false
    recoveredButtonsContainer.topAnchor.constraint(equalTo: mnemonicsView.bottomAnchor, constant: 6).isActive = true
    recoveredButtonsContainer.leadingAnchor.constraint(equalTo: mnemonicsView.leadingAnchor).isActive = true
    recoveredButtonsContainer.heightAnchor.constraint(equalTo: mnemonicsView.heightAnchor).isActive = true
    recoveredButtonsContainer.trailingAnchor.constraint(equalTo: mnemonicsView.trailingAnchor).isActive = true
    recoveredButtonsContainer.alpha = 0
  }

  func createWordButton(word: String) -> UIButton {
    let wordButton = UIButton()
    wordButton.setTitle(word, for: .normal)
    if #available(iOS 13.0, *) {
      wordButton.setTitleColor(.label, for: .normal)
      wordButton.backgroundColor = .tertiarySystemFill
    }
    wordButton.contentEdgeInsets = UIEdgeInsets.init(top: 4, left: 6, bottom: 4, right: 6)
    wordButton.sizeToFit()
    wordButton.layer.cornerRadius = 6
    return wordButton
  }

  func layoutShuffledButtons(_ ajustContainerHeight: Bool = false) {
    var originX: CGFloat = 16
    let horizontalPadding: CGFloat = 16
    let verticalPadding: CGFloat = 10
    let horizontalSpacing: CGFloat = 10
    let verticalSpacing: CGFloat = 10
    var lines: Int = 1
    var buttonHeight: CGFloat = 0

    for i in 0 ..< shuffledButtons.count {
      shuffledButtons[i].tag = i

      if (i == 0) {
        buttonHeight = shuffledButtons[i].intrinsicContentSize.height
        shuffledButtons[i].frame.origin = CGPoint.init(x: horizontalPadding, y: verticalPadding)
        originX += shuffledButtons[i].intrinsicContentSize.width
      } else {
        if ((originX + shuffledButtons[i].intrinsicContentSize.width + horizontalPadding) < UIScreen.main.bounds.size.width) {

          shuffledButtons[i].frame.origin = CGPoint.init(x: shuffledButtons[i-1].frame.origin.x + 10 + shuffledButtons[i-1].intrinsicContentSize.width, y: shuffledButtons[i-1].frame.origin.y)
          originX += shuffledButtons[i].intrinsicContentSize.width + horizontalSpacing
        } else {
          lines += 1
          shuffledButtons[i].frame.origin = CGPoint.init(x: horizontalPadding, y: shuffledButtons[i-1].frame.origin.y + verticalSpacing + buttonHeight)
          originX = shuffledButtons[i].intrinsicContentSize.width + horizontalPadding
        }
      }
    }

    if (ajustContainerHeight) {
      let paddingHeight = verticalPadding * 2
      let contentHeight = CGFloat(lines) * buttonHeight + (CGFloat(lines) - 1) * verticalSpacing
      mnemonicsView.frame.size.height = paddingHeight + contentHeight
      headerView.frame.size.height = 116 + mnemonicsView.frame.size.height * 2 + 6
    }
  }

  func layoutRecoveredButtons() {
    var originX: CGFloat = 16
    let horizontalPadding: CGFloat = 16
    let verticalPadding: CGFloat = 10
    let horizontalSpacing: CGFloat = 10
    let verticalSpacing: CGFloat = 10
    var lines: Int = 1
    var buttonHeight: CGFloat = 0

    for i in 0 ..< recoveredButtons.count {
      recoveredButtons[i].tag = i

      if (i == 0) {
        buttonHeight = recoveredButtons[i].intrinsicContentSize.height
        recoveredButtons[i].frame.origin = CGPoint.init(x: horizontalPadding, y: verticalPadding)
        originX += recoveredButtons[i].intrinsicContentSize.width
      } else {
        if ((originX + recoveredButtons[i].intrinsicContentSize.width + horizontalPadding) < UIScreen.main.bounds.size.width) {

          recoveredButtons[i].frame.origin = CGPoint.init(x: recoveredButtons[i-1].frame.origin.x + 10 + recoveredButtons[i-1].intrinsicContentSize.width, y: recoveredButtons[i-1].frame.origin.y)
          originX += recoveredButtons[i].intrinsicContentSize.width + horizontalSpacing
        } else {
          lines += 1
          recoveredButtons[i].frame.origin = CGPoint.init(x: horizontalPadding, y: recoveredButtons[i-1].frame.origin.y + verticalSpacing + buttonHeight)
          originX = recoveredButtons[i].intrinsicContentSize.width + horizontalPadding
        }
      }
    }
  }

  @objc func shuffledWordClicked(sender: UIButton) {
    let recoveredButton = createWordButton(word: sender.titleLabel?.text ?? "")
    self.recoveredButtonsContainer.addSubview(recoveredButton)
    self.recoveredButtons.append(recoveredButton)
    recoveredButton.tag = self.recoveredButtons.count - 1
    recoveredButton.addTarget(self, action: #selector(self.recoveredWordClicked(sender:)), for: .touchUpInside)
    recoveredButton.alpha = 0

    shuffledButtons.remove(at: sender.tag)
    self.layoutRecoveredButtons()

    if (shuffledButtons.count == 0) {
      nextButton?.isEnabled = true
    }

    UIView.animate(withDuration: 0.3) {
      sender.removeFromSuperview()
      self.recoveredButtons.last?.alpha = 1
      self.layoutShuffledButtons()
    }
  }

  @objc func recoveredWordClicked(sender: UIButton) {
    let shuffledButton = createWordButton(word: sender.titleLabel?.text ?? "")
    self.shuffledButtonsContainer.addSubview(shuffledButton)
    self.shuffledButtons.append(shuffledButton)
    shuffledButton.tag = self.shuffledButtons.count - 1
    shuffledButton.addTarget(self, action: #selector(self.shuffledWordClicked(sender:)), for: .touchUpInside)
    shuffledButton.alpha = 0

    recoveredButtons.remove(at: sender.tag)
    self.layoutShuffledButtons()
    nextButton?.isEnabled = false

    UIView.animate(withDuration: 0.3) {
      sender.removeFromSuperview()
      self.shuffledButtons.last?.alpha = 1
      self.layoutRecoveredButtons()
    }
  }

  func resetSubmitButtonState() {
    nextButton?.isEnabled = false
  }

  override func didMoveToWindow() {
    let vc = controller(for: self)
    nextButton = vc?.navigationItem.rightBarButtonItems?[0]
    nextButton?.target = self
    nextButton?.action = #selector(nextStep)
  }

  @objc func nextStep() {
    let vc = controller(for: self)
    nextButton = vc?.navigationItem.rightBarButtonItems?[0]
    nextButton?.title = "验证"
    nextButton?.isEnabled = false
    nextButton?.target = self
    nextButton?.action = #selector(verify)
    createVerifyView()

    let subTitleText = "请按顺序点击助记词，以确认您正确备份。"
    let paragraphStyle = NSMutableParagraphStyle()
    paragraphStyle.lineSpacing = 1.8
    let attrString = NSMutableAttributedString(string: subTitleText)
    attrString.addAttribute(NSAttributedString.Key.paragraphStyle, value:paragraphStyle, range:NSMakeRange(0, subTitleText.count))
    subTitleLabel.attributedText = attrString
    subTitleLabel.textAlignment = .center

    UIView.animate(withDuration: 0.3) {
      self.mnemonicsTextView.removeFromSuperview()
      self.shuffledButtonsContainer.alpha = 1
      self.recoveredButtonsContainer.alpha = 1
      self.layoutIfNeeded()
    }
  }

  @objc func verify() {
    let recoveredMnemonics: String = recoveredButtons.map { (recoveredButton: UIButton) -> String in
      return recoveredButton.titleLabel?.text ?? ""
    }.joined(separator: " ")

    if (recoveredMnemonics != self.mnemonics) {
      submitFailed(message: "助记词顺序错误!")
    } else {
      if (self.onSubmit != nil) {
        self.nextButton?.isEnabled = false
        self.onSubmit!([:])
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
}
