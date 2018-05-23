
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import TotalAssetsCard from 'components/TotalAssetsCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Header from './Header'
import EnableAssets from './EnableAssets'
import BalanceList from './BalanceList'
import styles from './styles'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import AssetQRCode from './AssetQRCode'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import storage from 'utils/storage'
import AccountList from './AccountList'
import * as walletActions from 'actions/wallet'
import * as keystoreActions from 'actions/keystore'
import { accountBalanceSelector } from 'selectors/balance'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    balance: accountBalanceSelector(state),
    keystore: state.keystore
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...walletActions,
      ...keystoreActions
    }, dispatch)
  })
)

export default class Assets extends BaseScreen {
  constructor(props, context) {
    super(props, context)

    this.state = {
      isVisible: false,
      isVisible2: false
    }

    this.switchWallet = this.switchWallet.bind(this)
  }

  // 展示账户列表
  displayAccountList = () => {
    this.setState({ isVisible2: true })
  }

  // 前往扫描
  scanQR = () => {
    this.props.navigator.push({
      screen: 'BitPortal.QRCodeScanner'
    })
  }

  // 激活钱包
  enableAssets = () => {
    this.props.navigator.push({
      screen: "BitPortal.AvailableAssets"
    })
  }

  // 查看资产情况
  checkAsset = (assetInfo) => {
    this.props.navigator.push({
      screen: 'BitPortal.AssetChart',
      passProps: { assetInfo }
    })
  }

  // 钱包二维码
  operateAssetQRCode = (isVisible) => {
    this.setState({ isVisible })
  }

  // 创建新账户
  createNewAccount = () => {
    this.props.navigator.push({
      screen: "BitPortal.AccountCreation"
    })
  }

  // 切换EOS账户
  switchWallet({ name, id }) {
    this.props.actions.switchWalletRequested({ name, id })
  }

  componentDidMount() {
    /* this.props.actions.createEOSAccountRequested({
     *   creator: 'eosio',
     *   name: 'fsdfsdfsdf',
     *   recovery: 'eosio'
     * })*/
    // this.props.actions.syncEOSAccount()
    /* this.props.actions.importEOSAccountRequested({
     *   name: 'eosio',
     *   key: 'PW5KfRDq5g6F8LqkSRa3KhZABHhFkyqGa3oXc9fEqgX8hBQNJbuv6'
     * })*/
  }

  didAppear() {
    /* this.props.actions.createAccountRequested({
     *   bitportalAccountName: 'EOS-1',
     *   password: 'asddas',
     *   eosAccountName: 'sfdfio'
     * })*/
    // this.props.actions.createWalletRequested({ name: 'TG-1' })
    this.props.actions.syncWalletRequested()
    // this.props.actions.createWalletRequested({ name: 'TG-2' })
    /* this.props.actions.importEOSKeyRequested({
     *   hdWalletName: 'EOS-1',
     *   key: '5Hpchj7rC5rLKRMVv6vTg8W3vXPU5VGzBRAg8x2n7P1pyAniZ5i',
     *   coin: 'EOS'
     * })*/
  }

  render() {
    const { wallet, balance, locale } = this.props
    const active = wallet.get('active')
    const accountList = wallet.get('data')
    const balanceList = balance.get('data').get('eosAccountBalance')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <Header Title={<FormattedMessage id="addpage_title_name_act" />} displayAccount={() => this.displayAccountList()} scanQR={() => this.scanQR()} />
          {
            !accountList.size &&
            <TouchableOpacity onPress={() => this.createNewAccount()} style={[styles.createAccountContainer, styles.center]}>
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="ios-add-outline" size={40} color={Colors.bgColor_FFFFFF} />
                <Text style={[styles.text14, { color: Colors.textColor_255_255_238, marginTop: 20 }]}>
                  <FormattedMessage id="addpage_button_name_crt" />
                </Text>
              </View>
            </TouchableOpacity>
          }
          {
            !!accountList.size &&
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TotalAssetsCard totalAssets={425321132.21} accountName={active.get('name')} onPress={() => this.operateAssetQRCode(true)} />
                <EnableAssets Title={<FormattedMessage id="asset_title_name_ast" />} enableAssets={() => this.enableAssets()} />
                {balanceList && <BalanceList data={balanceList} onPress={(e) => this.checkAsset(e)} />}
              </ScrollView>
            </View>
          }
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={this.state.isVisible}
            backdropOpacity={0.9}
          >
            <AssetQRCode
              assetName={'Meon'}
              dismissModal={() => this.operateAssetQRCode(false)}
            />
          </Modal>
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            style = {{  margin: 0 }}
            isVisible={this.state.isVisible2}
            backdropOpacity={0}
          >
            <AccountList
              data={accountList}
              activeAccount={active}
              onPress={this.switchWallet}
              createNewAccount={() => this.createNewAccount()}
              dismissModal={() => this.setState({ isVisible2: false })}
            />
          </Modal>
        </View>
      </IntlProvider>
    )
  }
}
