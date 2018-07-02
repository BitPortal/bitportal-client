import React, { Component } from 'react'
import Provider from 'components/Provider'

export default function screenComponent(Scene, store) {
  return class ScreenComponent extends Component {
    static options = {
      ...Scene.options
    }

    componentDidMount() {
      this.instance = this.refs.child.getWrappedInstance()
    }

    resendEvent = (eventName, params) => {
      if (this.instance && this.instance[eventName]) {
        this.instance[eventName](params)
      }
    }

    componentDidAppear() {
      this.resendEvent('componentDidAppear')
    }

    componentDidDisappear() {
      this.resendEvent('componentDidDisappear')
    }

    onSearchBarUpdated(query, isFocused) {
      this.resendEvent('onSearchBarUpdated', query, isFocused)
    }

    onSearchBarCancelPressed() {
      this.resendEvent('onSearchBarCancelPressed')
    }

    render() {
      return (
        <Provider store={store}>
          <Scene ref="child" {...this.props} />
        </Provider>
      )
    }
  }
}
