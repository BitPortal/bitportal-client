import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
  Clipboard
} from 'react-native'
import { injectIntl } from 'react-intl'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { submit } from 'redux-form'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg'
import { identityEOSWalletSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'
import { FilledTextField } from 'components/Form'
import * as accountActions from 'actions/account'
import IndicatorModal from 'components/Modal/IndicatorModal'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import CreateEOSAccountByVcodeForm from 'containers/Form/CreateEOSAccountByVcodeForm'
import CreateEOSAccountByFriendForm from 'containers/Form/CreateEOSAccountByFriendForm'
import CreateEOSAccountByContractForm from 'containers/Form/CreateEOSAccountByContractForm'

@connect(
  state => ({
    createEOSAccount: state.createEOSAccount,
    wallet: identityEOSWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      submit
    }, dispatch)
  })
)

export default class CreateEOSAccount extends Component {
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
          text: '创建EOS帐户'
        },
        elevation: 0,
        drawBehind: false
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    index: 0,
    routes: [
      { key: 'vcode', title: '邀请码' },
      { key: 'friend', title: '好友协助' },
      { key: 'contract', title: '智能合约' },
    ],
    showModal: false
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      Keyboard.dismiss()
      this.props.actions.submit('createEOSAccountForm')
    }
  }

  submit = (data) => {
    const { wallet } = this.props
    const publicKey = wallet && wallet.publicKeys && wallet.publicKeys.length && wallet.publicKeys[0]

    if (!this.state.index) {
      this.props.actions.createEOSAccount.requested({
        ...data,
        ownerKey: publicKey,
        activeKey: publicKey,
        componentId: this.props.componentId,
        delay: 500
      })
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'vcode':
        return (<CreateEOSAccountByVcodeForm componentId={this.props.componentId} onSubmit={this.submit} activeIndex={this.state.index} />)
      case 'friend':
        return (<CreateEOSAccountByFriendForm componentId={this.props.componentId} onSubmit={this.submit} activeIndex={this.state.index} />)
      case 'contract':
        return (<CreateEOSAccountByContractForm componentId={this.props.componentId} onSubmit={this.submit} activeIndex={this.state.index} />)
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
