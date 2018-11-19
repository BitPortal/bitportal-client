import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import ImagePicker from 'react-native-image-crop-picker'
import QRDecode from '@remobile/react-native-qrcode-local-image'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { change } from 'redux-form/immutable'
import { IntlProvider } from 'react-intl'
import * as balanceActions from 'actions/balance'
import { parseEOSQrString, isJsonString } from 'utils'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import { checkPhoto } from 'utils/permissions'
import Dialog from 'components/Dialog'
import Loading from 'components/Loading'
import { ASSETS_SCAN } from 'constants/analytics'
import { onEventWithMap } from 'utils/analytics'
import { eosAssetBalanceSelector } from 'selectors/balance'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAssetBalance: eosAssetBalanceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...balanceActions,
        change
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class Scanner extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isVisible: false
  }

  componentDidAppear() {
    this.scanner.reactivate()
  }

  onSuccess = e => {
    if (
      isJsonString(e.data) &&
      JSON.parse(e.data).protocol === 'SimpleWallet' &&
      JSON.parse(e.data).action === 'login'
    ) {
      const loginParams = JSON.parse(e.data)
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.SimpleWalletAuth',
          passProps: { payload: { ...loginParams } }
        }
      })
    } else if (
      isJsonString(e.data) &&
      JSON.parse(e.data).protocol === 'SimpleWallet' &&
      JSON.parse(e.data).action === 'transfer'
    ) {
      const transactionParams = JSON.parse(e.data)
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.SimpleWalletTransaction',
          passProps: { payload: { ...transactionParams } }
        }
      })
    }
    // {
    //   protocol string // protocol name, wallet is used to distinguish different protocols, and this protocol is SimpleWallet
    //   version string // protocol version information, such as 1.0
    //   dappName string // dapp name, for display in the wallet APP, optional
    //   dappIcon string // dapp icon Url for display in the wallet APP, optional
    //   action string // When the payment is assigned as transfer, required
    //   from string // EOS account of payer, optional
    //   to string // EOS account of recipient, required
    //   amount number // amount of transfer, required
    //   contract string //transfer belongs to the token contract account name, required
    //   symbol string // transfer token name, required
    //   precision number // transfer token's precision, the number of digits after the decimal point, required
    //   dappData string // the business parameter information generated by dapp needs to be attached to the memo when transferring, and the format is :k1=v1&k2=v2, optional
    //   // wallet transfers can also attach ref parameters to indicate the source, such as k1=v1&k2=v2&ref=walletname

    //   desc string // transaction description information, wallet displayed in the payment UI to the user, up to 128 bytes long, optional

    //   expired number //Qr code expiration time, a unix timestamp

    //   callback string // after the user completes the operation, the wallet callback pulls up the callback URL of the dapp mobile terminal, such as https://abc.com?action=login&qrcID=123, optional

    //   // wallet callback with this URL followed by operation results (result, txID) such as: https://abc.com?action=login&qrcID=123&result=1&txID=xxx,

    //   // result value is: 0 for user cancellation, 1 for success and 2 for failure; txID is the id of this transaction on the mainnet of EOS (if any).

    // }
    // {
    //   protocol string   // procotol name, wallet used to distinguish different protocols, this protocol is SimpleWallet
    //   version     string   // Protocol version information, such as 1.0
    //   dappName   string   // dapp name
    //   dappIcon   string   // dapp Icon
    //   action     string   // The assignment for login
    //   uuID       string   // The unique id generated by dapp server for this login verification
    //   loginUrl   string   // The url on dapp server to accept the login validation information
    //   expired number   // Qr code expiration time, unix timestamp
    //   loginMemo string   // Login note information, wallet for display, optional
    // }
    else if (isJsonString(e.data)) {
      const { account, owner, active } = JSON.parse(e.data)

      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.AccountAssistancePayment',
          passProps: { account, owner, active }
        }
      })
    } else {
      const qrInfo = parseEOSQrString(e.data)
      // Umeng analytics
      onEventWithMap(ASSETS_SCAN, qrInfo || {})

      const eosAssetBalance = this.props.eosAssetBalance
      if (qrInfo && eosAssetBalance) {
        const token = qrInfo.token
        const index = eosAssetBalance.findIndex(v => v.get('symbol') === token)

        if (index !== -1) {
          this.props.actions.setActiveAsset(eosAssetBalance.get(index))
          if (this.props.entry === 'form') {
            const eosAccountName = qrInfo.eosAccountName
            const quantity = qrInfo.amount
            if (eosAccountName) {
              this.props.actions.change('transferAssetsForm', 'toAccount', eosAccountName)
            }
            if (quantity) {
              this.props.actions.change('transferAssetsForm', 'quantity', quantity)
            }
            Navigation.pop(this.props.componentId)
          } else if (this.props.entry === 'assets') {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'BitPortal.AssetsTransfer',
                passProps: {
                  entry: 'scanner',
                  qrInfo
                }
              }
            })
          }
        } else {
          Dialog.alert(`请添加${token}到您的资产列表`, null, { positiveText: '确定' })
        }
      }
    }
  }

  getImageFromPhoto = async () => {
    const authorized = await checkPhoto(this.props.locale)
    if (authorized) {
      const options = { smartAlbums: ['UserLibrary', 'PhotoStream'], cropping: false, mediaType: 'photo' }
      ImagePicker.openPicker(options).then(image => {
        this.setState({ isVisible: true })
        QRDecode.decode(image.path, (error, result) => {
          this.setState({ isVisible: false })
          if (error) {
            Dialog.alert(messages[this.props.locale].scan_error_popup_text_unidentified_image, null, {
              positiveText: messages[this.props.locale].general_popup_button_close
            })
          } else this.onSuccess({ data: result })
        })
      })
    }
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].scan_title_scan}
            leftButton={
              <CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />
            }
            rightButton={
              <CommonButton
                title={messages[locale].scan_button_album}
                onPress={this.getImageFromPhoto}
                extraTextStyle={{ fontSize: FontScale(18), color: Colors.textColor_255_255_238 }}
              />
            }
          />
          <View style={styles.content}>
            <QRCodeScanner
              ref={node => {
                this.scanner = node
              }}
              containerStyle={styles.qrContainer}
              onRead={this.onSuccess}
              showMarker={true}
            />
          </View>
          <Loading text={messages[locale].scan_text_processing} isVisible={this.state.isVisible} />
        </View>
      </IntlProvider>
    )
  }
}
