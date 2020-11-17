import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, Keyboard, Dimensions } from 'react-native'
import { Navigation } from 'components/Navigation'
import * as walletActions from 'actions/wallet'
import { submit } from 'redux-form'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import ImportRioChainKeystoreForm from 'containers/Form/importRioChainKeystoreForm'
import ImportRioChainMnemonicsForm from 'containers/Form/ImportRioChainMnemonicsForm'

@injectIntl

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      submit
    }, dispatch)
  })
)

export default class ImportRioChainWallet extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'submit',
            icon: require('resources/images/check_android.png'),
            enabled: false
          }
        ],
        title: {
          text: gt('导入RioChain钱包')
        },
        noBorder: true,
        elevation: 0
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    isSegWit: true,
    index: 0,
    routes: [
      { key: 'keystore', title: 'Keystore' },
      { key: 'mnemonics', title: gt('助记词') },
    ],
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      Keyboard.dismiss()

      if (!this.state.index) {
        this.props.actions.submit('importRioChainKeystoreForm')
      } else if (this.state.index === 1) {
        this.props.actions.submit('importRioChainMnemonicsForm')
      }
    }
  }

  submit = (data) => {
    if (!this.state.index) {
      this.props.actions.importRioChianKeystore.requested({ ...data, componentId: this.props.componentId, isSegWit: this.state.isSegWit, delay: 500 })
    } else if (this.state.index === 1) {
      this.props.actions.importRioChainMnemonics.requested({ ...data, componentId: this.props.componentId, isSegWit: this.state.isSegWit, delay: 500 })
    } 
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'keystore':
        return (<ImportRioChainKeystoreForm componentId={this.props.componentId} onSubmit={this.submit} activeIndex={this.state.index} />)
      case 'mnemonics':
        return (<ImportRioChainMnemonicsForm componentId={this.props.componentId} onSubmit={this.submit} activeIndex={this.state.index} />)
      default:
        return null
    }
  }

  renderTabBar = (props) => {
    return (
      <TabBar {...props} style={{ backgroundColor: '#673AB7' }} indicatorStyle={{ backgroundColor: 'white', color: 'white' }} />
    )
  }

  onIndexChange = (index) => {
    Keyboard.dismiss()
    this.setState({ index })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </View>
    )
  }
}
