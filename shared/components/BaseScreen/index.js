
import React, {Component} from 'react'

export default class BaseScreen extends Component {

    static navigatorStyle = {
      navBarHidden: true
    };

    constructor(props) {
      super(props)
      this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    }

    push() {
      this.props.navigator.push(...arguments)
    }

    pop() {
      this.props.navigator.pop({
        animated: true
      })
    }

    popToRoot() {
      this.props.navigator.popToRoot(...arguments)
    }

    resetTo() {
      this.props.navigator.resetTo(...arguments)
    }

    showModal() {
      this.props.navigator.showModal(...arguments)
    }

    dismissModal() {
      this.props.navigator.dismissModal(...arguments)
    }

    dismissAllModals() {
      this.props.navigator.dismissAllModals(...arguments)
    }

    showLightBox() {
      this.props.navigator.showLightBox(...arguments)
    }

    dismissLightBox() {
      this.props.navigator.dismissLightBox(...arguments)
    }

    showInAppNotification() {
      this.props.navigator.showInAppNotification(...arguments)
    }

    dismissInAppNotification() {
      this.props.navigator.dismissInAppNotification(...arguments)
    }

    willAppear(e) {

    }

    didAppear(e) {

    }

    willDisappear(e) {

    }

    didDisappear(e) {

    }

    //私有方法请勿调用
    _onNavigatorEvent(event) {
      switch (event.id) {
        case 'willAppear':
            this.willAppear.apply(this, event)
            break
        case 'didAppear':
            this.didAppear.apply(this, event)
            break
        case 'willDisappear':
            this.willDisappear.apply(this, event)
            break
        case 'didDisappear':
            this.didDisappear.apply(this, event)
            break
      }
    }

    setTitle(title) {
      this.props.navigator.setTitle({ title: title })
    }

    setSubTitle(subTitle) {
      this.props.navigator.setSubTitle({ subtitle: subTitle })
    }

    toggleTabs(show, animated) {
      this.props.navigator.toggleTabs({
        to: show ? 'shown' : 'hidden', 
        animated: animated 
      })
    }

    toggleNavBar(show, animated) {
      this.props.navigator.toggleNavBar({
        to: show ? 'shown' : 'hidden',
        animated: animated
      })
    }

    switchToTab(index) {
      this.props.navigator.switchToTab({ tabIndex: index })
    }

}