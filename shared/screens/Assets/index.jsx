import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import storage from 'utils/storage'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionActions from 'actions/version'
import * as currencyActions from 'actions/currency'
import * as eosAccountActions from 'actions/eosAccount'
import {
  selectedEOSTokenBalanceSelector,
  eosTotalAssetBalanceSelector
} from 'selectors/balance'
import { eosPriceSelector } from 'selectors/ticker'
import { eosAccountSelector } from 'selectors/eosAccount'
import { IntlProvider, FormattedMessage } from 'react-intl'
import NavigationBar, { CommonTitle, CommonRightButton } from 'components/NavigationBar'
import SettingItem from 'components/SettingItem'
import SplashScreen from 'react-native-splash-screen'
import { checkCamera } from 'utils/permissions'
import { ASSETS_QR, ASSETS_TOKEN_DETAIL, ASSETS_EOS_RESOURCE, ASSETS_ADD_TOKEN } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'
import { GradiantCard, GradiantCardContainer } from 'components/GradiantCard'
import styles from './styles'
import AccountList from './AccountList'
import EnableAssets from './EnableAssets'
import BalanceList from './BalanceList'
import TotalAssetsCard from './TotalAssetsCard'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state),
    eosAssetBalance: selectedEOSTokenBalanceSelector(state),
    eosTotalAssetBalance: eosTotalAssetBalanceSelector(state),
    eosPrice: eosPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...walletActions,
        ...tickerActions,
        ...balanceActions,
        ...versionActions,
        ...currencyActions,
        ...eosAccountActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)

export default class Assets extends Component {
  static get options() {
    return {
      bottomTabs: {
        backgroundColor: Colors.minorThemeColor
      }
    }
  }

  state = {
    isVisible2: false
  }

  displayAccountList = () => {}

  scanQR = async () => {
    const authorized = await checkCamera(this.props.locale)
    if (authorized) {
      const eosAccountName = this.props.eosAccount
        .get('data')
        .get('account_name')
      if (eosAccountName) {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.QRCodeScanner'
          }
        })
      } else {
        const { locale } = this.props
        Dialog.alert(messages[locale].general_error_popup_text_no_account, null, {
          negativeText: messages[locale].general_popup_button_close
        })
      }
    }
  }

  checkAssetList = () => {
    // Umeng analytics
    onEventWithLabel(ASSETS_ADD_TOKEN, '资产 - 添加token资产')
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AvailableAssets',
        passProps: {
          eosAccountName: this.props.eosAccount.get('data').get('account_name')
        }
      }
    })
  }

  checkAsset = (item) => {
    // Umeng analytics
    onEventWithLabel(ASSETS_TOKEN_DETAIL, '资产 - token资产详情')
    this.props.actions.setActiveAsset(item)
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AssetChart'
      }
    })
  }

  displayReceiceQRCode = () => {
    // Umeng analytics
    onEventWithLabel(ASSETS_QR, '资产 - 二维码 / 收款')

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ReceiveQRCode',
        passProps: {
          symbol: 'EOS'
        }
      }
    })
  }

  createNewAccount = () => {
    this.setState({ isVisible2: false }, () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.EOSAccountCreation'
        }
      })
    })
  }

  importNewAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountImport'
      }
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
    // Umeng analytics
    onEventWithLabel(ASSETS_EOS_RESOURCE, '资产 - EOS资源管理')
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Resources'
      }
    })
  }

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
      this.props.actions.getEOSAccountRequested({ eosAccountName })
      this.props.actions.getEOSBalanceRequested({ eosAccountName })
      this.props.actions.getEOSAssetBalanceListRequested({ eosAccountName })
    }
  }

  render() {
    const { wallet, eosAssetBalance, eosTotalAssetBalance, locale, eosAccount, eosPrice } = this.props
    const activeEOSAccount = eosAccount.get('data')
    const hdWalletList = wallet.get('hdWalletList')
    const classicWalletList = wallet.get('classicWalletList')
    const walletCount = hdWalletList.size + classicWalletList.size

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonTitle title={<FormattedMessage id="assets_title_eos_wallet" />} />}
            rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanQR()} />}
          />
          {!walletCount && (
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>

                <GradiantCardContainer containerTag="创建新账户" extraStyle={{ marginTop: 10 }}>
                  <GradiantCard onPress={this.createNewAccount} extraStyle={{ marginBottom: 10 }} title="注册码" content="BitPortal 将向部分用户提供注册码进行 EOS 账户注册。您可参加 BitPortal 官方组织的活动获取注册码。" />
                  <GradiantCard extraStyle={{ marginBottom: 10 }} title="好友协助" content="好友协助进行注册时，其将消耗一定的 EOS，已购买及抵押部分系统资源。" />
                  <GradiantCard title="智能合约" content="好友协助进行注册时，其将消耗一定的 EOS，已购买及抵押部分系统资源。" />
                </GradiantCardContainer>

                <GradiantCardContainer containerTag="导入已有账户" extraStyle={{ marginTop: 10 }}>
                  <GradiantCard onPress={this.importNewAccount} colors={Colors.gradientCardColors2} title="私钥导入" content="输入已创建的账户私钥，将 EOS 钱包导入到 BitPortal 中。" />
                </GradiantCardContainer>

              </ScrollView>
            </View>
          )}
          {!!walletCount && (
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TotalAssetsCard
                  totalAssets={eosTotalAssetBalance}
                  accountName={activeEOSAccount.get('account_name')}
                  CPUInfo={activeEOSAccount.get('cpu_limit')}
                  NETInfo={activeEOSAccount.get('net_limit')}
                  RAMQuota={activeEOSAccount.get('ram_quota')}
                  RAMUsage={activeEOSAccount.get('ram_usage')}
                  checkResourcesDetails={this.checkResourcesDetails}
                  componentId={this.props.componentId}
                  onPress={this.displayReceiceQRCode}
                />
                {!activeEOSAccount.get('account_name') && (
                  <SettingItem
                    leftItemTitle={<FormattedMessage id="assets_no_account_button_import" />}
                    onPress={() => this.createEOSAccount()}
                    extraStyle={{ marginTop: 10, marginBottom: 10 }}
                  />
                )}
                {!!activeEOSAccount.get('account_name') && (
                  <EnableAssets
                    Title={<FormattedMessage id="assets_label_assets" />}
                    onPress={this.checkAssetList}
                  />
                )}
                {eosAssetBalance && (
                <BalanceList
                     data={eosAssetBalance}
                     eosPrice={eosPrice}
                     onPress={this.checkAsset}
                />
                )}
              </ScrollView>
            </View>
          )}
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
