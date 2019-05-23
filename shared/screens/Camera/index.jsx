import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS, AlertIOS, Alert, Text, ActivityIndicator, Linking, TouchableOpacity, Dimensions, TouchableHighlight, Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import * as walletActions from 'actions/wallet'
import * as producerActions from 'actions/producer'
import QRCodeScanner, { CAMERA_FLASH_MODE } from 'react-native-qrcode-scanner'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { managingWalletSelector } from 'selectors/wallet'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import QRDecode from '@remobile/react-native-qrcode-local-image'
import ImagePicker from 'react-native-image-crop-picker'
import { checkPhoto } from 'utils/permissions'

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

@connect(
  state => ({
  }),
  dispatch => ({
    actions: bindActionCreators({

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
        title: {
          text: '扫描',
          color: 'white'
        },
        largeTitle: {
          visible: false
        },
        background: {
          color: 'rgba(0,0,0,0)'
        },
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
              '二维码识别失败，请重新尝试或更换晰度更高的图片',
              '',
              [
                { text: '确定', onPress: () => {} }
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
              { text: '确定', onPress: () => {} }
            ]
          )
        }
      })
    } else {
      console.error('unauthorized photo permission', authorized)
      Alert.alert(
        '未授权访问本地照片',
        '',
        [
          { text: '确定', onPress: () => {} }
        ]
      )
    }
  }

  parseQrCode = (code) => {

  }

  dismiss = () => {
    Navigation.dismissAllModals()
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
          reactivate={true}
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>扫描二维码</Text>
          <Text style={{ fontSize: 17, color: 'white', marginTop: 16 }}>将镜头对准二维码进行扫描</Text>
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
