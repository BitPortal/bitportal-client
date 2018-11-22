import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import storage from 'utils/storage'
import Colors from 'resources/colors'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionActions from 'actions/version'
import * as currencyActions from 'actions/currency'
import * as eosAccountActions from 'actions/eosAccount'

import { selectedEOSTokenBalanceSelector, eosTotalAssetBalanceSelector } from 'selectors/balance'
import { eosPriceSelector } from 'selectors/ticker'
import { eosAccountSelector } from 'selectors/eosAccount'
import { IntlProvider, FormattedMessage } from 'react-intl'
import NavigationBar, { CommonTitle, CommonRightButton } from 'components/NavigationBar'
import { checkCamera } from 'utils/permissions'
import { events } from 'navigators/event'
import { ASSETS_QR, ASSETS_TOKEN_DETAIL, ASSETS_EOS_RESOURCE, ASSETS_ADD_TOKEN } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import { startListenNetInfo } from 'utils/netInfo'
import secureStorage from 'utils/secureStorage'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'
import { GradiantCard, GradiantCardContainer } from 'components/GradiantCard'
import EnableAssets from './EnableAssets'
import BalanceList from './BalanceList'
import TotalAssetsCard from './TotalAssetsCard'
import UserAgreement from './UserAgreement'
import MenuPopUp from './MenuPopUp'
import styles from './styles'

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
      bottomTabs: {
        backgroundColor: Colors.minorThemeColor
      }
    }
  }

  state = {
    type: '',
    isVisible: false,
    isVisible2: false
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
            passProps: {
              entry: 'assets'
            }
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

  showMemu = () => this.setState({ isVisible2: true })

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

  checkAsset = item => {
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
    this.setState({ isVisible: false, isVisible2: false })
  }

  acceptUserAgreement = () => {
    const { type } = this.state
    let entrance = 'EOSAccountCreation'
    switch (type) {
      case 'import':
        entrance = 'AccountImport'
        break
      case 'create':
        entrance = 'EOSAccountCreation'
        break
      case 'assistance':
        entrance = 'AccountAssistance'
        break
      case 'contract':
        entrance = 'AccountSmartContact'
        break
      default:
        break
    }
    this.setState({ isVisible: false }, () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: `BitPortal.${entrance}`
        }
      })
    })
  }

  showUserAgreement = async type => {
    const { locale } = this.props
    const eosAccountCreationRequestInfo = await secureStorage.getItem('EOS_ACCOUNT_CREATION_REQUEST_INFO', true)
    if (eosAccountCreationRequestInfo) {
      const { action } = await Dialog.alert(
        messages[locale].assets_popup_label_pending_create_order,
        messages[locale].assets_popup_text_pending_create_order,
        {
          negativeText: messages[locale].general_popup_button_cancel,
          positiveText: messages[locale].assets_popup_button_check_order
        }
      )
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

  selectFunc = async (type) => {
    await this.setState({ isVisible2: false })
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    setTimeout(() => {
      switch (type) {
        case 'scanQR':
          this.scanQR()
          break;
        case 'transfer':
          if (eosAccountName) {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'BitPortal.AssetsTransfer'
              }
            })
          } else {
            const { locale } = this.props
            Dialog.alert(messages[locale].general_error_popup_text_no_account, null, {
              negativeText: messages[locale].general_popup_button_close
            })
          }
          break;
        case 'receive':
          if (eosAccountName) {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'BitPortal.ReceiveQRCode',
                passProps: {
                  symbol: 'EOS'
                }
              }
            })
          } else {
            const { locale } = this.props
            Dialog.alert(messages[locale].general_error_popup_text_no_account, null, {
              negativeText: messages[locale].general_popup_button_close
            })
          }
          break;
        case 'vote':
          Navigation.push(this.props.componentId, {
            component: {
              name: 'BitPortal.Voting'
            }
          })
          break;
        default:
          break;
      }
    }, 500)
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

  switchWallet = info => {
    this.props.actions.switchWalletRequested(info)
  }

  getCurrencyRate = async () => {
    const currency = await storage.getItem('bitportal_currency', true)
    if (currency && currency.symbol) {
      this.props.actions.getCurrencyRateRequested({ symbol: currency.symbol })
    }
  }

  componentWillMount() {
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
          <NavigationBar
            leftButton={<CommonTitle title={<FormattedMessage id="assets_title_eos_wallet" />} />}
            rightButton={<CommonRightButton iconName="md-add" onPress={() => this.showMemu()} />}
          />
          {!walletCount && (
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                <GradiantCardContainer
                  containerTag={messages[locale].assets_label_create_account}
                  extraStyle={{ marginTop: 10 }}
                >
                  <GradiantCard
                    title={messages[locale].assets_label_create_account_registration_code}
                    extraStyle={{ marginBottom: 10 }}
                    onPress={() => this.showUserAgreement('create')}
                    content={messages[locale].assets_text_create_account_registration_code}
                  />
                  <GradiantCard
                    title={messages[locale].assets_label_create_account_friend_assistance}
                    extraStyle={{ marginBottom: 10 }}
                    onPress={() => this.showUserAgreement('assistance')}
                    content={messages[locale].assets_text_create_account_friend_assistance}
                  />
                  <GradiantCard
                    title={messages[locale].assets_label_create_account_smart_contract}
                    onPress={() => this.showUserAgreement('contract')}
                    content={messages[locale].assets_text_create_account_smart_contract}
                  />
                </GradiantCardContainer>

                <GradiantCardContainer
                  containerTag={messages[locale].assets_label_import_account}
                  extraStyle={{ marginTop: 10 }}
                >
                  <GradiantCard
                    title={messages[locale].assets_label_import_account_import_private_key}
                    colors={Colors.gradientCardColors2}
                    onPress={() => this.showUserAgreement('import')}
                    content={messages[locale].assets_text_import_account_import_private_key}
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
                  <EnableAssets Title={<FormattedMessage id="assets_label_assets" />} onPress={this.checkAssetList} />
                )}
                {eosAssetBalance && (
                  <BalanceList data={eosAssetBalance} eosPrice={eosPrice} onPress={this.checkAsset} />
                )}
              </ScrollView>
            </View>
          )}
          <UserAgreement
            acceptUserAgreement={this.acceptUserAgreement}
            isVisible={this.state.isVisible}
            dismissModal={this.dismissModal}
          />
          <MenuPopUp 
            selectFunc={this.selectFunc}
            isVisible={this.state.isVisible2}
            dismissModal={this.dismissModal}
          />
        </View>
      </IntlProvider>
    )
  }
}
