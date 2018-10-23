import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  LayoutAnimation
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import storage from 'utils/storage'
import Colors from 'resources/colors'
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
import SplashScreen from 'react-native-splash-screen'
import { checkCamera } from 'utils/permissions'
import { ASSETS_QR, ASSETS_TOKEN_DETAIL, ASSETS_EOS_RESOURCE, ASSETS_ADD_TOKEN } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import { startListenNetInfo } from 'utils/netInfo'
import secureStorage from 'utils/secureStorage'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'
import { GradiantCard, GradiantCardContainer } from 'components/GradiantCard'
import styles from './styles'
import EnableAssets from './EnableAssets'
import BalanceList from './BalanceList'
import TotalAssetsCard from './TotalAssetsCard'
import UserAgreement from './UserAgreement'

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
        ...eosAccountActions,
        ...walletActions
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
      topBar: {
        title: {
          text: '钱包'
        },
        largeTitle: {
          visible: true,
          fontSize: 30,
          fontFamily: 'SFNSDisplay'
        }
      }
    }
  }

  state = {
    type: '',
    isVisible: false
  }

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  displayAccountList = () => {}

  scanQR = async () => {
    const authorized = await checkCamera(this.props.locale)
    if (authorized) {
      const eosAccountName = this.props.eosAccount.get('data').get('account_name')
      if (eosAccountName) {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.QRCodeScanner',
            entry: 'assets'
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

  dismissModal = () => {
    this.setState({ isVisible: false })
  }

  acceptUserAgreement = () => {
    const { type } = this.state
    let entrance = 'EOSAccountCreation'
    switch (type) {
      case 'import':
        entrance = 'AccountImport'
        break;
      case 'create':
        entrance = 'EOSAccountCreation'
        break;
      case 'assistance':
        entrance = 'AccountAssistance'
        break;
      default:
        break;
    }
    this.setState({ isVisible: false }, () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: `BitPortal.${entrance}`
        }
      })
    })
  }

  showUserAgreement = async (type) => {
    const eosAccountCreationRequestInfo = await secureStorage.getItem('EOS_ACCOUNT_CREATION_REQUEST_INFO', true)
    if (eosAccountCreationRequestInfo) {
      const { action } = await Dialog.alert('您有一个未激活成功的账户，是否查看', null, {
        negativeText: '稍候查看',
        positiveText: '立即前往'
      })
      if (action === Dialog.actionPositive) {
        const componentId = this.props.componentId
        this.props.actions.showAssistanceAccountInfo({ componentId })
      } else {
        return null
      }
    } else {
      this.setState({ isVisible: true, type })
    }
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

  componentDidMount() {
    SplashScreen.hide()
    startListenNetInfo(this.props.locale)
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
          {!walletCount && (
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>

                <GradiantCardContainer containerTag="创建新账户" extraStyle={{ marginTop: 10 }}>
                  <GradiantCard
                    title="注册码"
                    extraStyle={{ marginBottom: 10 }}
                    onPress={() => this.showUserAgreement('create')}
                    content="BitPortal 将向部分用户提供注册码进行 EOS 账户注册。您可参加 BitPortal 官方组织的活动获取注册码。"
                  />
                  <GradiantCard
                    title="好友协助"
                    extraStyle={{ marginBottom: 10 }}
                    onPress={() => this.showUserAgreement('assistance')}
                    content="好友协助进行注册时，其将消耗一定的 EOS，已购买及抵押部分系统资源。"
                  />
                  <GradiantCard
                    title="智能合约"
                    onPress={() => this.showUserAgreement('contract')}
                    content="好友协助进行注册时，其将消耗一定的 EOS，已购买及抵押部分系统资源。"
                  />
                </GradiantCardContainer>

                <GradiantCardContainer containerTag="导入已有账户" extraStyle={{ marginTop: 10 }}>
                  <GradiantCard
                    title="私钥导入"
                    colors={Colors.gradientCardColors2}
                    onPress={() => this.showUserAgreement('import')}
                    content="输入已创建的账户私钥，将 EOS 钱包导入到 BitPortal 中。"
                  />
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
          <UserAgreement acceptUserAgreement={this.acceptUserAgreement} isVisible={this.state.isVisible} dismissModal={this.dismissModal} />
        </View>
      </IntlProvider>
    )
  }
}
