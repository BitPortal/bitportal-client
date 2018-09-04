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
import { parseEOSQrString } from 'utils'
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
    actions: bindActionCreators({
      ...balanceActions,
      change
    }, dispatch)
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

  onSuccess = (e) => {
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

          if (eosAccountName) { this.props.actions.change('transferAssetsForm', 'toAccount', eosAccountName) }
          if (quantity) { this.props.actions.change('transferAssetsForm', 'quantity', quantity) }

          Navigation.pop(this.props.componentId)
        } else {
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

  getImageFromPhoto = async () => {
    const authorized = await checkPhoto()
    if (authorized) {
      const options = { smartAlbums: ['UserLibrary', 'PhotoStream'], cropping: false, mediaType: 'photo' }
      ImagePicker.openPicker(options).then((image) => {
        this.setState({ isVisible: true })
        QRDecode.decode(image.path, (error, result) => {
          this.setState({ isVisible: false })
          if (error) Dialog.alert('请确认所选图片中含有二维码', null, { positiveText: '确定' })
          else this.onSuccess({ data: result })
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
            title={messages[locale].qrscn_title_name_qrscanner}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={
              <CommonButton
                title={messages[locale].qrscn_button_name_photos}
                onPress={this.getImageFromPhoto}
                extraTextStyle={{ fontSize: FontScale(18), color: Colors.textColor_255_255_238 }}
              />
            }
          />
          <QRCodeScanner
            ref={(node) => { this.scanner = node }}
            onRead={this.onSuccess}
            showMarker={true}
          />
          <Loading isVisible={this.state.isVisible} />
        </View>
      </IntlProvider>
    )
  }
}
