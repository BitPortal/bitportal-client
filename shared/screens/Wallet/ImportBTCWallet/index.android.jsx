import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, Keyboard, Dimensions } from 'react-native'
import { Navigation } from 'components/Navigation'
import * as walletActions from 'actions/wallet'
import { submit } from 'redux-form'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import ImportBTCMnemonicsForm from 'containers/Form/ImportBTCMnemonicsForm'
import ImportBTCPrivateKeyForm from 'containers/Form/ImportBTCPrivateKeyForm'

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

export default class ImportBTCWallet extends Component {
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
          text: gt('导入BTC钱包')
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
      { key: 'mnemonics', title: gt('助记词') },
      { key: 'privateKey', title: gt('私钥') },
    ],
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      Keyboard.dismiss()

      if (!this.state.index) {
        this.props.actions.submit('importBTCMnemonicsForm')
      } else {
        this.props.actions.submit('importBTCPrivateKeyForm')
      }
    }
  }

  submit = (data) => {
    if (!this.state.index) {
      this.props.actions.importBTCMnemonics.requested({ ...data, componentId: this.props.componentId, isSegWit: this.state.isSegWit, delay: 500 })
    } else {
      this.props.actions.importBTCPrivateKey.requested({ ...data, componentId: this.props.componentId, isSegWit: this.state.isSegWit, delay: 500 })
    }
  }

  changeAddressType = (isSegWit) => {
    this.setState({ isSegWit })
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'mnemonics':
        return (<ImportBTCMnemonicsForm componentId={this.props.componentId} isSegWit={this.state.isSegWit} onSubmit={this.submit} changeAddressType={this.changeAddressType} activeIndex={this.state.index} />)
      case 'privateKey':
        return (<ImportBTCPrivateKeyForm componentId={this.props.componentId} isSegWit={this.state.isSegWit} onSubmit={this.submit} changeAddressType={this.changeAddressType} activeIndex={this.state.index} />)
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
