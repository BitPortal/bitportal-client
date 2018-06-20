
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, LayoutAnimation, TouchableHighlight, ActivityIndicator, InteractionManager } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import TotalAssetsCard from 'components/TotalAssetsCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
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
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionInfoActions from 'actions/versionInfo'
import * as currencyActions from 'actions/currency'
import { accountBalanceSelector } from 'selectors/balance'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosPriceSelector } from 'selectors/ticker'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from './messages'
import NavigationBar, { ListButton, CommonRightButton, CommonTitle } from 'components/NavigationBar'
import SettingItem from 'components/SettingItem'
import Loading from 'components/Loading'

const getTotalAssets = (balanceList, eosPrice) => {
  if (!balanceList) return 0

  let balance
  const baseTokenBalance = balanceList.filter(balance => balance.get('symbol') === 'SYS' || balance.get('symbol') === 'EOS')

  if (baseTokenBalance.size) {
    balance = baseTokenBalance.get(0).get('balance')
  } else {
    balance = 0
  }

  return +balance * eosPrice
}

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state),
    balance: accountBalanceSelector(state),
    eosPrice: eosPriceSelector(state)
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...walletActions,
      ...tickerActions,
      ...balanceActions,
      ...versionInfoActions,
      ...currencyActions
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
    // this.setState({ isVisible2: true })
  }

  // 前往扫描
  scanQR = () => {
    this.props.navigator.push({
      screen: 'BitPortal.QRCodeScanner'
    })
  }

  // 激活钱包
  enableAssets = () => {
    /* this.props.navigator.push({
     *   screen: "BitPortal.AvailableAssets"
     * })*/
  }

  // 查看资产情况
  checkAsset = (assetInfo) => {
    /* this.props.navigator.push({
     *   screen: 'BitPortal.AssetChart',
     *   passProps: { assetInfo }
     * })*/
  }

  // 钱包二维码
  operateAssetQRCode = (isVisible) => {
    this.setState({ isVisible })
  }

  // 创建新账户
  createNewAccount = () => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible2: false }, () => {
        this.props.navigator.push({ screen: "BitPortal.AccountImport" })
      })
    })
  }

  createEOSAccount = () => {
    this.props.navigator.push({
      screen: "BitPortal.EOSAccountCreation"
    })
  }

  // 切换EOS账户
  switchWallet(info) {
    this.props.actions.switchWalletRequested(info)
  }

  getCurrencyRate = async () => {
    const currency = await storage.getItem('bitportal_currency', true)

    if (currency && currency.symbol) {
      this.props.actions.getCurrencyRateRequested({ symbol: currency.symbol })
    }
  }

  async componentDidMount() {
    // 检测版本号
    this.props.actions.getVersionInfoRequested()
    // 获取资产单位
    this.getCurrencyRate()
    this.props.actions.syncWalletRequested()
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

  async didAppear() {
    /* this.props.actions.createAccountRequested({
     *   bitportalAccountName: 'EOS-1',
     *   password: 'asddas',
     *   eosAccountName: 'sfdfio'
     * })*/
    // this.props.actions.createWalletRequested({ name: 'TG-2', password: 'helloword' })
    /* this.props.actions.importEOSKeyRequested({
     *   hdWalletName: 'EOS-1',
     *   key: '5Hpchj7rC5rLKRMVv6vTg8W3vXPU5VGzBRAg8x2n7P1pyAniZ5i',
     *   coin: 'EOS'
     * })*/
    this.props.actions.getTickersRequested({
      market: 'EOS_USDT',
      limit: 200
    })

    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    if (eosAccountName) {
      this.props.actions.getBalanceRequested({
        code: 'eosio.token',
        account: eosAccountName
      })
    }
  }

  componentWillUpdate() {
    LayoutAnimation.linear()
  }

  render() {
    const { wallet, balance, locale, eosAccount, eosPrice } = this.props
    const loading = wallet.get('loading')
    const activeEOSAccount = eosAccount.get('data')
    const hdWalletList = wallet.get('hdWalletList')
    const classicWalletList = wallet.get('classicWalletList')
    const walletCount = hdWalletList.size + classicWalletList.size
    const balanceList = balance.get('data').get('eosAccountBalance')
    
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonTitle title={<FormattedMessage id="addpage_title_name_act" />} />}
            // rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanQR()} />}
          />
          {
            !walletCount  &&
            <TouchableHighlight underlayColor={Colors.mainThemeColor} onPress={() => this.createNewAccount()} style={[styles.createAccountContainer, styles.center]}>
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="ios-add-outline" size={40} color={Colors.bgColor_FFFFFF} />
                <Text style={[styles.text14, { color: Colors.textColor_255_255_238, marginTop: 20 }]}>
                  <FormattedMessage id="addpage_button_name_crt" />
                </Text>
              </View>
            </TouchableHighlight>
          }
          {
            !!walletCount &&
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TotalAssetsCard totalAssets={getTotalAssets(balanceList, eosPrice)} accountName={activeEOSAccount.get('account_name')} onPress={() => this.operateAssetQRCode(true)} />
                {!activeEOSAccount.get('account_name') && <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_create_eos_account" />} onPress={() => this.createEOSAccount()} extraStyle={{ marginTop: 10, marginBottom: 10 }} />}
                {!!activeEOSAccount.get('account_name') && <EnableAssets Title={<FormattedMessage id="asset_title_name_ast" />} enableAssets={() => this.enableAssets()} />}
                {balanceList && <BalanceList data={balanceList} eosPrice={eosPrice} onPress={(e) => this.checkAsset(e)} />}
              </ScrollView>
            </View>
          }
          <Loading isVisible={loading} />
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={this.state.isVisible}
            backdropOpacity={0.9}
          >
            <AssetQRCode
              accountName={activeEOSAccount.get('account_name')}
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
              data={hdWalletList}
              moreData={classicWalletList}
              activeAccount={wallet.get('data')}
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
