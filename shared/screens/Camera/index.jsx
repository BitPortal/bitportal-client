import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS, AlertIOS, Alert, Text, ActivityIndicator, Linking, TouchableOpacity, Dimensions, TouchableHighlight, Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import * as walletActions from 'actions/wallet'
import * as producerActions from 'actions/producer'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { managingWalletSelector } from 'selectors/wallet'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'

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
    showScanner: false
  }

  componentDidAppear() {
    this.setState({ showScanner: true })
  }

  componentDidMount() {

  }

  onSuccess = (e) => {
    Linking.openURL(e.data).catch(err => console.error('An error occured', err))
    this.forceUpdate()
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
        <TouchableHighlight underlayColor="white" activeOpacity={0.42} style={{ position: 'absolute', left: 20, top: toolBarMargin, width: 28, height: 28, borderRadius: 14 }} onPress={this.dismiss}>
          <View style={{ width: 28, height: 28, backgroundColor: 'white', borderRadius: 14 }}>
            <FastImage
              source={require('resources/images/nav_cancel.png')}
              style={{ width: 28, height: 28 }}
            />
          </View>
        </TouchableHighlight>
        <View style={{ width: Dimensions.get('window').width, position: 'absolute', left: 0, top: (Dimensions.get('window').height / 2) - 240, height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>扫描二维码</Text>
          <Text style={{ fontSize: 17, color: 'white', marginTop: 16 }}>扫描钱包地址开始转账</Text>
        </View>
        <View style={{ position: 'absolute', bottom: toolBarMargin, left: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 14, height: 60, padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
        </View>
      </View>
    )
  }
}
