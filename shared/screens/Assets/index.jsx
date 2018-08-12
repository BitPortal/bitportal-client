import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, View, ScrollView, InteractionManager, TouchableHighlight } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import storage from 'utils/storage'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionInfoActions from 'actions/versionInfo'
import * as currencyActions from 'actions/currency'
import * as eosAccountActions from 'actions/eosAccount'
import { eosAccountBalanceSelector } from 'selectors/balance'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosPriceSelector } from 'selectors/ticker'
import { IntlProvider, FormattedMessage } from 'react-intl'
import NavigationBar, { CommonTitle, CommonRightButton } from 'components/NavigationBar'
import SettingItem from 'components/SettingItem'
import SplashScreen from 'react-native-splash-screen'
import { checkCamera } from 'utils/permissions'
import Dialog from 'components/Dialog'
import styles from './styles'
import messages from './messages'
import AccountList from './AccountList'
import EnableAssets from './EnableAssets'
import BalanceList from './BalanceList'
import TotalAssetsCard from './TotalAssetsCard'

const getTotalAssets = (eosAccountBalance, eosPrice) => {
  if (!eosAccountBalance) return 0

  let balance
  const baseTokenBalance = eosAccountBalance.filter(balance => balance.get('symbol') === 'SYS' || balance.get('symbol') === 'EOS')

  if (baseTokenBalance.size) {
    balance = baseTokenBalance.get(0).get('balance')
  } else {
    balance = 0
  }

  return +balance * eosPrice
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state),
    eosAccountBalance: eosAccountBalanceSelector(state),
    eosPrice: eosPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...tickerActions,
      ...balanceActions,
      ...versionInfoActions,
      ...currencyActions,
      ...eosAccountActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Assets extends Component {
  state = {
    isVisible2: false
  }

  displayAccountList = () => {}

  scanQR = async () => {
    const authorized = await checkCamera()
    if (authorized) {
      const eosAccountName = this.props.eosAccount.get('data').get('account_name')
      if (eosAccountName) {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.QRCodeScanner'
          }
        })
      } else {
        const { locale } = this.props
        Dialog.alert(
          messages[locale].asset_alert_name_err,
          null,
          { negativeText: messages[locale].asset_alert_button_ent }
        )
      }
    }
  }

  enableAssets = () => {}

  checkAsset = (item) => {
    InteractionManager.runAfterInteractions(() => {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.AssetChart',
          passProps: {
            eosItem: item
          }
        }
      })
    })
  }

  displayReceiceQRCode = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ReceiveQRCode',
        passProps: {
          symbol: 'EOS'
        }
      }
    })
  }

  // 创建新账户
  createNewAccount = () => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible2: false }, () => {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.EOSAccountCreation'
          }
        })
      })
    })
  }

  createEOSAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.EOSAccountCreation'
      }
    })
  }

  checkResourcesDetails = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Resources'
      }
    })
  }

  // 切换EOS账户
  switchWallet = (info) => {
    this.props.actions.switchWalletRequested(info)
  }

  getCurrencyRate = async () => {
    const currency = await storage.getItem('bitportal_currency', true)

    if (currency && currency.symbol) {
      this.props.actions.getCurrencyRateRequested({ symbol: currency.symbol })
    }
  }

  async componentDidMount() {
    SplashScreen.hide()
    this.props.actions.getVersionInfoRequested()
    this.getCurrencyRate()
    this.props.actions.syncWalletRequested()
  }

  async componentDidAppear() {
    this.props.actions.getTickersRequested({
      market: 'EOS_USDT',
      limit: 200
    })

    const eosAccountName = this.props.eosAccount.get('data').get('account_name')

    if (eosAccountName) {
      this.props.actions.getEOSAccountRequested({
        eosAccountName
      })

      this.props.actions.getBalanceRequested({
        code: 'eosio.token',
        account: eosAccountName
      })
    }
  }

  render() {
    const { wallet, eosAccountBalance, locale, eosAccount, eosPrice } = this.props
    const activeEOSAccount = eosAccount.get('data')
    const hdWalletList = wallet.get('hdWalletList')
    const classicWalletList = wallet.get('classicWalletList')
    const walletCount = hdWalletList.size + classicWalletList.size

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonTitle title={<FormattedMessage id="addpage_title_name_act" />} />}
            rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanQR()} />}
          />
          {
            !walletCount && (
              <TouchableHighlight underlayColor={Colors.mainThemeColor} onPress={() => this.createNewAccount()} style={[styles.createAccountContainer, styles.center]}>
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="ios-add-outline" size={40} color={Colors.bgColor_FFFFFF} />
                  <Text style={[styles.text14, { color: Colors.textColor_255_255_238, marginTop: 20 }]}>
                    <FormattedMessage id="addpage_button_name_crt" />
                  </Text>
                </View>
              </TouchableHighlight>
            )
          }
          {
            !!walletCount && (
              <View style={styles.scrollContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <TotalAssetsCard
                    totalAssets={getTotalAssets(eosAccountBalance, eosPrice)}
                    accountName={activeEOSAccount.get('account_name')}
                    CPUInfo={activeEOSAccount.get('cpu_limit')}
                    NETInfo={activeEOSAccount.get('net_limit')}
                    RAMQuota={activeEOSAccount.get('ram_quota')}
                    RAMUsage={activeEOSAccount.get('ram_usage')}
                    checkResourcesDetails={this.checkResourcesDetails}
                    componentId={this.props.componentId}
                    onPress={this.displayReceiceQRCode}
                  />
                  {!activeEOSAccount.get('account_name') && <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_create_eos_account" />} onPress={() => this.createEOSAccount()} extraStyle={{ marginTop: 10, marginBottom: 10 }} />}
                  {!!activeEOSAccount.get('account_name') && <EnableAssets Title={<FormattedMessage id="asset_title_name_ast" />} enableAssets={() => this.enableAssets()} />}
                  {eosAccountBalance && <BalanceList data={eosAccountBalance} eosPrice={eosPrice} onPress={this.checkAsset} />}
                </ScrollView>
              </View>
            )
          }
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
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
