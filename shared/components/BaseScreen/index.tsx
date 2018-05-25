/* @tsx */
import React from 'react'

export interface BaseScreenProps {
  navigator: any
}

export default class BaseScreen<Props extends BaseScreenProps> extends React.Component<BaseScreenProps, any> {
  static navigatorStyle = {
    navBarHidden: true
  }

  constructor(props: Props, context?: {}) {
    super(props, context)
    this.screenState = null
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }

  push() {
    this.props.navigator.push(...Array.from(arguments))
  }

  pop() {
    this.props.navigator.pop({
      animated: true
    })
  }

  popToRoot() {
    this.props.navigator.popToRoot(...Array.from(arguments))
  }

  resetTo() {
    this.props.navigator.resetTo(...Array.from(arguments))
  }

  showModal() {
    this.props.navigator.showModal(...Array.from(arguments))
  }

  dismissModal() {
    this.props.navigator.dismissModal(...Array.from(arguments))
  }

  dismissAllModals() {
    this.props.navigator.dismissAllModals(...Array.from(arguments))
  }

  showLightBox() {
    this.props.navigator.showLightBox(...Array.from(arguments))
  }

  dismissLightBox() {
    this.props.navigator.dismissLightBox(...Array.from(arguments))
  }

  showInAppNotification() {
    this.props.navigator.showInAppNotification(...Array.from(arguments))
  }

  dismissInAppNotification() {
    this.props.navigator.dismissInAppNotification(...Array.from(arguments))
  }

  willAppear() {}

  didAppear() {}

  willDisappear() {}

  didDisappear() {}

  //私有方法请勿调用
  _onNavigatorEvent(event: any) {
    switch (event.id) {
      case 'willAppear':
        this.willAppear.apply(this, event)
        this.screenState = 'willAppear'
        break
      case 'didAppear':
        this.didAppear.apply(this, event)
        this.screenState = 'didAppear'
        break
      case 'willDisappear':
        this.willDisappear.apply(this, event)
        this.screenState = 'willDisappear'
        break
      case 'didDisappear':
        this.didDisappear.apply(this, event)
        this.screenState = 'didDisappear'
        break
    }

    if (event.type === 'DeepLink') {
      const payload = event.payload

	  if (payload && this.screenState === 'didAppear') {
		this.props.navigator[payload.method](payload.params)
	  }
	}
  }

  setTitle(title: any) {
    this.props.navigator.setTitle({ title })
  }

  setSubTitle(subtitle: any) {
    this.props.navigator.setSubTitle({ subtitle })
  }

  toggleTabs(show: boolean, animated: boolean) {
    this.props.navigator.toggleTabs({
      to: show ? 'shown' : 'hidden',
      animated: animated
    })
  }

  toggleNavBar(show: boolean, animated: boolean) {
    this.props.navigator.toggleNavBar({
      to: show ? 'shown' : 'hidden',
      animated: animated
    })
  }

  switchToTab(tabIndex: any) {
    this.props.navigator.switchToTab({ tabIndex })
  }
}
