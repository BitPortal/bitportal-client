import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { FormattedNumber, injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableNativeFeedback,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
  Clipboard
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { submit } from 'redux-form'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg'
import { formatCycleTime, formatMemorySize } from 'utils/format'
import { eosRAMPriceSelector } from 'selectors/ticker'
import { managingWalletBalanceSelector } from 'selectors/balance'
import { managingAccountSelector } from 'selectors/account'
import {
  managingAccountTotalResourcesSelector,
  managingAccountSelfDelegatedBandwidthSelector,
  managingAccountOthersDelegatedBandwidthSelector
} from 'selectors/account'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as tickerActions from 'actions/ticker'
import * as transactionActions from 'actions/transaction'
import Loading from 'components/Loading'
import TradeEOSBandWidthForm from 'containers/Form/TradeEOSBandWidthForm'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import TradeEOSRAMForm from 'containers/Form/TradeEOSRAMForm'
@injectIntl
@connect(
  state => ({
    getAccount: state.getAccount,
    account: managingAccountSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...tickerActions,
      ...transactionActions,
      submit
    }, dispatch)
  })
)

export default class ManageEOSResource extends Component {
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
          text: gt('EOS资源管理')
        },
        elevation: 0,
        drawBehind: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.getAccount.loading !== prevState.getAccountLoading
      || nextProps.getAccount.loaded !== prevState.getAccountLoaded
    ) {
      return {
        getAccountLoading: nextProps.getAccount.loading,
        getAccountLoaded: nextProps.getAccount.loaded
      }
    } else {
      return null
    }
  }

  state = {
    getAccountLoading: false,
    getAccountLoaded: false,

    buy: true,
    delegate: true,
    index: 0,
    routes: [
      { key: 'ram', title: 'RAM' },
      { key: 'bandwidth', title: 'CPU/NET' },
    ],

    showPrompt: false,
    password: ''
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      Keyboard.dismiss()

      this.requestPassword()
    }
  }

  submit = (data) => {
    const accountName = this.props.account.account_name
    const chain = this.props.chain
    const id = this.props.walletId

    if (!this.state.index) {
      if (this.state.buy) {
        this.props.actions.buyRAM.requested({
          chain,
          id,
          accountName,
          receiver: data.receiver,
          ramAmount: data.buyRAMAmount,
          password: this.state.password
        })
      } else {
        this.props.actions.sellRAM.requested({
          chain,
          id,
          accountName,
          receiver: data.receiver,
          ramAmount: data.sellRAMAmount,
          password: this.state.password
        })
      }
    } else {
      if (this.state.delegate) {
        this.props.actions.delegateBW.requested({
          chain,
          id,
          accountName,
          receiver: data.receiver,
          cpuAmount: data.delegateCPUAmount,
          netAmount: data.delegateNETAmount,
          password: this.state.password
        })
      } else {
        this.props.actions.undelegateBW.requested({
          chain,
          id,
          accountName,
          receiver: data.receiver,
          cpuAmount: data.undelegateCPUAmount,
          netAmount: data.undelegateNETAmount,
          password: this.state.password
        })
      }
    }
  }

  componentDidMount() {
    this.props.actions.getEOSRAMTicker.requested()

    if (!this.props.account && this.props.address && this.props.chain) {
      this.props.actions.getAccount.requested({ chain: this.props.chain, address: this.props.address })
    }
  }

  toggleRAM = (buy) => {
    this.setState({ buy })
  }

  toggleBandWidth = (delegate) => {
    this.setState({ delegate })
  }

  changeBandWidthAction = (delegate) => {
    this.setState({ delegate })
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'bandwidth':
        return (<TradeEOSBandWidthForm componentId={this.props.componentId} delegate={this.state.delegate} onSubmit={this.submit} toggleBandWidth={this.toggleBandWidth} activeIndex={this.state.index} />)
      case 'ram':
        return (<TradeEOSRAMForm componentId={this.props.componentId} buy={this.state.buy} onSubmit={this.submit} toggleRAM={this.toggleRAM} activeIndex={this.state.index} />)
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

  requestPassword = () => {
    this.setState({ showPrompt: true, password: '' })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

  clearPassword = () => {
    this.setState({ password: '', showPrompt: false })
  }

  submitPassword = () => {
    this.setState({ showPrompt: false })

    if (!this.state.index) {
      this.props.actions.submit('tradeEOSRAMForm')
    } else {
      this.props.actions.submit('tradeEOSBandWidthForm')
    }
  }

  render() {
    const { formValues, change, account, getAccount } = this.props

    if ((!getAccount.loaded && getAccount.loading) || !account) {
      return (
        <Loading text={t(this,'获取账户信息中...')} />
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
        <Modal
          isVisible={this.state.showPrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>{t(this,'请输入密码')}</Text>
                {/* <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', marginBottom: 12 }}>This is a prompt</Text> */}
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 0,
                    width: '100%',
                    borderBottomWidth: 2,
                    borderColor: '#169689'
                  }}
                  autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholder="Password"
                  keyboardType="default"
                  secureTextEntry={true}
                  onChangeText={this.changePassword}
                  onSubmitEditing={this.submitPassword}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.clearPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'取消')}</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'确定')}</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
