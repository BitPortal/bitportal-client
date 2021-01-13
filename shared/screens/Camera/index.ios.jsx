import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS, Alert, Text, ActivityIndicator, Linking, TouchableOpacity, Dimensions, TouchableHighlight, Platform } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'components/Navigation'
import * as walletActions from 'actions/wallet'
import * as assetActions from 'actions/asset'
import * as producerActions from 'actions/producer'
import QRCodeScanner, { CAMERA_FLASH_MODE } from 'components/QRCodeScanner'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { identityWalletSelector, importedWalletSelector, activeWalletSelector } from 'selectors/wallet'
import { balanceByIdSelector } from 'selectors/balance'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import QRDecode from '@remobile/react-native-qrcode-local-image'
import ImagePicker from 'react-native-image-crop-picker'
import { change } from 'redux-form'
import { checkPhoto } from 'utils/permissions'
import { isJsonString } from 'utils'
import urlParse from 'url-parse'
import { validateBTCAddress, validateETHAddress, validateEOSAccountName,validateRioAddress } from 'utils/validate'
import { getChain } from 'utils/riochain'

const toolBarMargin = (() => {
  const isIphoneX = () => {
    let dimensions
    if (Platform.OS !== 'ios') {
      return false
    }
    if (Platform.isPad || Platform.isTVOS) {
      return false
    }
    dimensions = Dimensions.get('window')
    if (dimensions.height === 812 || dimensions.width === 812) { // Checks for iPhone X in portrait or landscape
      return true
    }
    if (dimensions.height === 896 || dimensions.width === 896) {
      return true
    }
    return false
  }

  if (isIphoneX()) {
    return 60 // iPhone X
  } else if (Platform.OS == 'ios') {
    return 32 // Other iPhones
  } else {
    return 32 // Android
  }
})()

@injectIntl
@connect(
  state => ({
    identityWallet: identityWalletSelector(state),
    importedWallet: importedWalletSelector(state),
    activeWallet: activeWalletSelector(state),
    balanceById: balanceByIdSelector(state),
    assetAllIds: state.asset.allIds
  }),
  dispatch => ({
    actions: bindActionCreators({
      change,
      ...walletActions,
      ...assetActions
    }, dispatch)
  })
)

export default class Camera extends Component {
  static get options() {
    return {
      layout: {
        backgroundColor: 'black',
      },
      topBar: {
        visible: false
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    showScanner: false, torchOn: false
  }

  componentDidAppear() {
    this.setState({ showScanner: true })
  }

  componentDidMount() {

  }

  onSuccess = (e) => {
    this.parseQrCode(e.data)
    // Linking.openURL(e.data).catch(err => console.error('An error occured', err))
    this.forceUpdate()
  }

  switchFlashMode = () => {
    this.setState({ torchOn: !this.state.torchOn })
  }

  getLocalImage = async () => {
    const authorized = await checkPhoto('zh')

    if (authorized) {
      const options = { smartAlbums: ['UserLibrary', 'PhotoStream'], cropping: false, mediaType: 'photo' }
      ImagePicker.openPicker(options).then((image) => {
        return QRDecode.decode(image.path, (error, result) => {
          if (error) {
            Alert.alert(
              t(this,'qrcode_load_failed'),
              '',
              [
                { text: t(this,'button_ok'), onPress: () => {} }
              ]
            )
          } else {
            this.parseQrCode(result)
          }
        })
      }).catch((error) => {
        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('User cancelled photo selection')
        } else {
          console.error(error)
          Alert.alert(
            error.message,
            '',
            [
              { text: t(this,'button_ok'), onPress: () => {} }
            ]
          )
        }
      })
    } else {
      console.error('unauthorized photo permission', authorized)
      Alert.alert(
        t(this,'未授权访问本地照片'),
        '',
        [
          { text: t(this,'button_ok'), onPress: () => {} }
        ]
      )
    }
  }

  parseQrCode = (code) => {
    const { from, form, field, chain, symbol } = this.props

    if (from === 'import') {
      this.props.actions.change(form, field, code)
      this.dismiss()
    } else if (from === 'transfer') {
      const isJson = isJsonString(code)
      if (isJson) {
        Alert.alert(
        t(this,'invalid_chain_addr',{chain:''}),
          [
            { text: t(this,'button_ok'), onPress: () => {} }
          ]
        )
      } else {
        const parsed = urlParse(code, true)
        const { protocol, pathname, query } = parsed

        let address = protocol === `${chain.toLowerCase()}:` ? pathname : code
        if (chain.toUpperCase() === 'POLKADOT' && protocol !== `${chain.toLowerCase()}`) {
          address = pathname
        }
        let isValid = false
        let errChain = chain

        if (chain === 'BITCOIN') {
          isValid = validateBTCAddress(address)
        } else if (chain === 'ETHEREUM') {
          isValid = validateETHAddress(address)
        } else if (chain === 'POLKADOT')  {
          if (symbol === 'ETH') {
            errChain = 'ETHEREUM'
            isValid = validateETHAddress(address)
          }else if (symbol === 'BTC'){
            errChain = 'BITCOIN'
            isValid = validateBTCAddress(address)
          }else {
            errChain = 'AlphaOne'
            isValid = validateRioAddress(address)
          }
        }
         else if (chain === 'EOS') {
          isValid = validateEOSAccountName(address)
        }

        if (!isValid) {
          Alert.alert(
           t(this,'invalid_chain_addr',{chain:errChain}),
            [
              { text: t(this,'确定'), onPress: () => {} }
            ]
          )
        } else {
          this.props.actions.change(form, field, address)
          const amount = query.amount || query.value
          if (amount) this.props.actions.change(form, 'amount', amount)
          this.dismiss()
        }
      }
    } else {
      const isJson = isJsonString(code)
      if (isJson) {
        const json = JSON.parse(code)

        if (json.protocol && json.protocol === 'SimpleWallet') {
          const wallet = (this.props.activeWallet && this.props.activeWallet.chain === 'EOS') ? this.props.activeWallet : this.selectWallet('EOS')
          this.props.actions.setTransferWallet(wallet.id)

          if (!wallet) {
            Alert.alert(
              '未检测到可授权的EOS账户',
              '',
              [
                { text: t(this,'button_ok'), onPress: () => {} }
              ]
            )
          } else {
            Navigation.setStackRoot(this.props.componentId, {
              component: {
                name: 'BitPortal.AuthorizeEOSAccount',
                passProps: { simpleWallet: json }
              }
            })
          }
        } else {
          Alert.alert(
            code,
            '',
            [
              { text: t(this,'button_ok'), onPress: () => {} }
            ]
          )
        }
      } else {
        const parsed = urlParse(code, true)
        const { protocol, pathname, query } = parsed

        const hasProtocal = protocol === `${code.split(':')[0]}:`
        const address = hasProtocal ? pathname : code
        let chain = null

        if (validateBTCAddress(address)) {
          chain = 'BITCOIN'
        } else if (validateETHAddress(address)) {
          chain = 'ETHEREUM'
        }else if (validateRioAddress(address)) {
          chain = 'POLKADOT'
        }
         else if (validateEOSAccountName(address)) {
          chain = 'EOS'
        }

        if (!chain) {
          if (protocol === 'eos:' && pathname === 'createAccount') {
            const name = query.name
            const active = query.active
            const owner = query.owner

            if (!validateEOSAccountName(name)) {
              Alert.alert(
                '无效的EOS账户名',
                null,
                [
                  {
                    text: t(this,'button_ok'),
                    onPress: () => {}
                  }
                ]
              )
            } else {
              const wallet = (this.props.activeWallet && this.props.activeWallet.chain === 'EOS' && this.props.balanceById[`${this.props.activeWallet.chain}/${this.props.activeWallet.address}`] && this.props.balanceById[`${this.props.activeWallet.chain}/${this.props.activeWallet.address}`].syscoin && +this.props.balanceById[`${this.props.activeWallet.chain}/${this.props.activeWallet.address}`].syscoin.balance >= 0.5) ? this.props.activeWallet : this.selectWallet('EOS', 0.5)

              if (!wallet) {
                Alert.alert(
                  '未检测到可授权的EOS账户',
                  '',
                  [
                    { text: t(this,'button_ok'), onPress: () => {} }
                  ]
                )
              } else {
                this.props.actions.setTransferWallet(wallet.id)

                Navigation.setStackRoot(this.props.componentId, {
                  component: {
                    name: 'BitPortal.AuthorizeCreateEOSAccount',
                    passProps: { name, active, owner }
                  }
                })
              }
            }
          } else {
            Alert.alert(
              code,
              '',
              [
                { text: t(this,'button_ok'), onPress: () => {} }
              ]
            )
          }
        } else {
          const amount = query.amount || query.value
          const contract = query.contract || query.contractAddress
          let precision = query.precision
          let symbol = query.symbol

          if (!symbol || !contract) {
            if (chain === 'BITCOIN') {
              symbol = 'BTC'
            } else if (chain === 'ETHEREUM') {
              symbol = 'ETH'
            } else if (chain === 'EOS') {
              symbol = 'EOS'
            } else if (chain === 'CHIANX') {
              symbol = 'PCX'
            }else if (chain === 'POLKADOT') {
              symbol = 'RFUEL'
            }
          }

          if (contract && !symbol) {
            Alert.alert(
              t(this,'undetect_token_symbol',{symbol}),
              null,
              [
                {
                  text: t(this,'button_ok'),
                  onPress: () => {}
                }
              ]
            )
          }

          const wallet = (this.props.activeWallet && this.props.activeWallet.chain === chain) ? this.props.activeWallet : this.selectWallet(chain)

          if (!wallet) {
            Alert.alert(
              t(this,'undetect_wallet_symbol',{chain}),
              null,
              [
                {
                  text: t(this,'button_ok'),
                  onPress: () => {}
                }
              ]
            )
          } else {
            const assetId = contract ? `${chain}/${contract}/${symbol}` : `${chain}/${symbol}`
            if (!!contract && this.props.assetAllIds.indexOf(assetId) === -1) {
              Alert.alert(
                t(this,'unadd_token_symbol',{symbol}),
                null,
                [
                  {
                    text: t(this,'button_ok'),
                    onPress: () => {}
                  }
                ]
              )
            } else {
              this.props.actions.setTransferWallet(wallet.id)
              this.props.actions.setTransferAsset(assetId)

              Navigation.setStackRoot(this.props.componentId, {
                component: {
                  name: 'BitPortal.TransferAsset',
                  passProps: { presetAddress: address, presetAmount: amount },
                  options: {
                    topBar: {
                      title: {
                        text:  t(this,'send_token_symbol',{symbol}),
                      },
                      leftButtons: [
                        {
                          id: 'cancel',
                          text: t(this,'button_cancel'),
                        }
                      ]
                    },
                    animations: {
                      setStackRoot: {
                        enabled: true
                      }
                    }
                  }
                }
              })
            }
          }
        }
      }
    }
  }

  selectWallet = (chain, minimalBalance = 0) => {
    const selectedIdentityWallet = this.props.identityWallet.filter(wallet => wallet.address && wallet.chain === chain)
    const selectedImportedWallet = this.props.importedWallet.filter(wallet => wallet.address && wallet.chain === chain)

    const identityIndex = selectedIdentityWallet.findIndex(wallet => this.props.balanceById[`${wallet.chain}/${wallet.address}`] && this.props.balanceById[`${wallet.chain}/${wallet.address}`].syscoin && +this.props.balanceById[`${wallet.chain}/${wallet.address}`].syscoin.balance >= minimalBalance)

    if (identityIndex !== -1) {
      return selectedIdentityWallet[identityIndex]
    }

    const importedIndex = selectedImportedWallet.findIndex(wallet => this.props.balanceById[`${wallet.chain}/${wallet.address}`] && this.props.balanceById[`${wallet.chain}/${wallet.address}`].syscoin && +this.props.balanceById[`${wallet.chain}/${wallet.address}`].syscoin.balance >= minimalBalance)

    if (importedIndex !== -1) {
      return selectedImportedWallet[importedIndex]
    }

    return selectedIdentityWallet[0] || selectedImportedWallet[0]
  }

  dismiss = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <QRCodeScanner
          cameraStyle={{ height: Dimensions.get('window').height }}
          topViewStyle={{ flex: 0, height: 0 }}
          bottomViewStyle={{ flex: 0, height: 0 }}
          showMarker={true}
          onRead={this.onSuccess}
          customMarker={<View style={{ width: 240, height: 240, backgroundColor: 'rgba(0,0,0,0)', borderRadius: 10, borderWidth: 0, borderColor: 'green' }} />}
          reactivateTimeout = {5000}
          reactivate={false}
          flashMode={this.state.torchOn ? CAMERA_FLASH_MODE.torch : CAMERA_FLASH_MODE.off}
        />
        <View style={{ position: 'absolute', top: 0, left: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: Dimensions.get('window').width, height: (Dimensions.get('window').height - 240) / 2, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, width: Dimensions.get('window').width, height: (Dimensions.get('window').height - 240) / 2, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <View style={{ position: 'absolute', top: (Dimensions.get('window').height - 240) / 2, left: 0, width: (Dimensions.get('window').width - 240) / 2, height: 240, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <View style={{ position: 'absolute', top: (Dimensions.get('window').height - 240) / 2, right: 0, width: (Dimensions.get('window').width - 240) / 2, height: 240, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <FastImage
            source={require('resources/images/camera_marker.png')}
            style={{ width: 240, height: 240, position: 'absolute', top: (Dimensions.get('window').height - 240) / 2, left: (Dimensions.get('window').width - 240) / 2 }}
          />
        </View>
        <TouchableHighlight underlayColor="rgba(0,0,0,0)" activeOpacity={0.42} style={{ position: 'absolute', left: 20, top: toolBarMargin, width: 28, height: 28 }} onPress={this.dismiss}>
          <View style={{ width: 28, height: 28, backgroundColor: 'white', borderRadius: 14 }}>
            <FastImage
              source={require('resources/images/nav_cancel.png')}
              style={{ width: 28, height: 28 }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(0,0,0,0)" activeOpacity={0.42} style={{ position: 'absolute', right: 20, top: toolBarMargin, width: 28, height: 28, borderRadius: 14 }} onPress={this.getLocalImage}>
          <View style={{ width: 28, height: 28 }}>
            <FastImage
              source={require('resources/images/photos.png')}
              style={{ width: 28, height: 28 }}
            />
          </View>
        </TouchableHighlight>
        <View style={{ width: Dimensions.get('window').width, position: 'absolute', left: 0, top: (Dimensions.get('window').height / 2) - 240, height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{t(this,'scan_qrcode')}</Text>
          <Text style={{ fontSize: 17, color: 'white', marginTop: 16 }}>{t(this,'scan_camera_hint')}</Text>
        </View>
        <TouchableHighlight underlayColor="rgba(0,0,0,0)" activeOpacity={0.42} style={{ position: 'absolute', right: (Dimensions.get('window').width / 2) - 14, top: (Dimensions.get('window').height / 2) + 120 + 20, width: 28, height: 28 }} onPress={this.switchFlashMode}>
          <View style={{ width: 28, height: 28 }}>
            <FastImage
              source={require('resources/images/flame.png')}
              style={{ width: 28, height: 28 }}
            />
          </View>
        </TouchableHighlight>
        {/* <View style={{ position: 'absolute', bottom: toolBarMargin, left: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 14, height: 60, padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ height: 44, width: '50%', paddingRight: 4 }}>
            <View
            style={{
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            height: 44,
            width: '100%',
            borderRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            shadowColor: '#666'
            }}
            >
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.7)' }}>转账</Text>
            </View>
            </View>
            <View style={{ height: 44, width: '50%', paddingLeft: 4 }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0)', alignItems: 'center', justifyContent: 'center', height: 44, width: '100%', borderRadius: 8 }}>
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.7)' }}>导入</Text>
            </View>
            </View>
            </View> */}
      </View>
    )
  }
}
