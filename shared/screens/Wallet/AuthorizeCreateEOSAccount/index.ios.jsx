import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { injectIntl } from 'react-intl'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { transferWalletSelector } from 'selectors/wallet'
import { eosRAMPriceSelector } from 'selectors/ticker'
import * as transactionActions from 'actions/transaction'
import * as accountActions from 'actions/account'
import * as tickerActions from 'actions/ticker'
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
      return gt('密码错误')
    default:
      return gt('创建失败')
  }
}

@injectIntl

@connect(
  state => ({
    authorizeCreateEOSAccount: state.authorizeCreateEOSAccount,
    authorizeWallet: transferWalletSelector(state),
    ramPrice: eosRAMPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...accountActions,
      ...tickerActions
    }, dispatch)
  })
)

export default class AuthorizeCreateEOSAccount extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'skip',
            text: gt('button_cancel')
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
          onPress: password => this.props.actions.authorizeCreateEOSAccount.requested({ password, name: this.props.name, active: this.props.active, owner: this.props.owner, authorizeWallet: this.props.authorizeWallet })
        }
      ],
      'secure-text'
    )
  }

  componentDidAppear() {
    this.props.actions.authorizeCreateEOSAccount.failed()
    // this.props.actions.authorizeCreateEOSAccount.requested({ chain: authorizeWallet.chain, address: authorizeWallet.address })
  }

  componentDidMount() {
    this.props.actions.getEOSRAMTicker.requested()
  }

  componentWillUnmount() {

  }

  onModalHide = () => {
    const error = this.props.authorizeCreateEOSAccount.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: t(this,'确定'), onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  clearError = () => {
    this.props.actions.authorizeCreateEOSAccount.clearError()
  }

  render() {
    const { name, active, owner, authorizeWallet, authorizeCreateEOSAccount, ramPrice, intl } = this.props
    const loading = authorizeCreateEOSAccount.loading
      const ram = typeof ramPrice === 'number' ? ` ≈ ${intl.formatNumber(ramPrice * (8192 / 1024), { minimumFractionDigits: 0, maximumFractionDigits: 4 })} EOS` : '';
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
          <View style={{ marginTop: 40, width: '100%' }}>
            <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>
              {t(this,'授权创建EOS账户:')}
            </Text>
            <Text style={{ fontSize: 17, marginTop: 12, marginBottom: 4 }}>
              {t(this,'新建账户名: ')+name}
            </Text>
            <Text style={{ fontSize: 17, marginTop: 6, marginBottom: 4 }}>
              Active Key: {active}
            </Text>
            <Text style={{ fontSize: 17, marginTop: 6, marginBottom: 4 }}>
              Owner Key: {owner}
            </Text>
            <Text style={{ fontSize: 15, color: '#007AFF', marginTop: 12 }}>
              {t(this,'注意：授权帐号将消耗一些EOS为新帐号购买内存(8192 bytes {message})和代理资源(0.1 EOS)',{message:ram})}
            </Text>
          </View>
          <View style={{ marginBottom: 40, marginTop: 40, width: '100%' }}>
            <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>
              {t(this,'授权帐号：')}
            </Text>
            <Text style={{ fontSize: 15, marginTop: 12 }}>
              {authorizeWallet.address}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.authorize}>
            <Text style={styles.buttonText}>{t(this,'确认创建')}</Text>
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
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{t(this,'创建中...')}</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
