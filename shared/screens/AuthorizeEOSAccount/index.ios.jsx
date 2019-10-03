import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { injectIntl } from 'react-intl'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { transferWalletSelector } from 'selectors/wallet'
import * as transactionActions from 'actions/transaction'
import * as accountActions from 'actions/account'
import Modal from 'react-native-modal'

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    default:
      return '授权失败'
  }
}

@injectIntl

@connect(
  state => ({
    authorizeEOSAccount: state.authorizeEOSAccount,
    authorizeWallet: transferWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...accountActions
    }, dispatch)
  })
)

export default class AuthorizeEOSAccount extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'skip',
            text: '取消'
          }
        ],
        backButton: {
          visible: false
        },
        largeTitle: {
          visible: false
        },
        noBorder: true,
        background: {
          color: 'rgba(0,0,0,0)',
          translucent: true
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'skip') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  authorize = () => {
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.authorizeEOSAccount.requested({ password, simpleWallet: this.props.simpleWallet, authorizeWallet: this.props.authorizeWallet })
        }
      ],
      'secure-text'
    )
  }

  componentDidAppear() {
    // this.props.actions.authorizeEOSAccount.failed()
    const { authorizeWallet } = this.props
    this.props.actions.getAccount.requested({ chain: authorizeWallet.chain, address: authorizeWallet.address })
  }

  componentWillUnmount() {

  }

  onModalHide = () => {
    const error = this.props.authorizeEOSAccount.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  clearError = () => {
    this.props.actions.authorizeEOSAccount.clearError()
  }

  render() {
    const { simpleWallet, authorizeWallet, authorizeEOSAccount } = this.props
    const loading = authorizeEOSAccount.loading

    return (
      <View style={styles.container}>
        <View
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <FastImage
            source={require('resources/images/AddIdentityBackground.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
        <View style={{ width: '100%', height: 500, paddingHorizontal: 16, paddingVertical: 30 }}>
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <FastImage
              source={{ uri: simpleWallet.dappIcon }}
              style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'white' }}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
              {simpleWallet.dappName}
            </Text>
          </View>
          <View style={{ marginTop: 40, width: '100%' }}>
            <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>
              授权后该应用将获得一下权限：
            </Text>
            <Text style={{ fontSize: 17, marginTop: 12, marginBottom: 4 }}>
              获取您的eos帐号信息
            </Text>
            <Text style={{ fontSize: 15 }}>
              注意：帐号授权不会向DAPP提供您的私钥
            </Text>
          </View>
          <View style={{ marginBottom: 40, marginTop: 40, width: '100%' }}>
            <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>
              授权帐号：
            </Text>
            <Text style={{ fontSize: 15, marginTop: 12 }}>
              {authorizeWallet.address}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.authorize}>
            <Text style={styles.buttonText}>确认授权</Text>
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={loading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>授权中...</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
