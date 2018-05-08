
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import TotalAssets from 'components/TotalAssets'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Header from './Header'
import EnableAssets from './EnableAssets'
import AssetsList from './AssetsList'
import styles from './styles'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import AssetQRCode from './AssetQRCode'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as assetsActions from 'actions/assets'
import storage from 'utils/storage'
import _ from 'lodash'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    assetsInfo: state.assets.get('data')
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...assetsActions
    }, dispatch)
  })
)

export default class Assets extends BaseScreen {

  state = {
    isVisible: false
  }

  // 展示账户列表
  displayAccountList = () => {

  }

  // 前往扫描
  scanQR = () => {
    this.props.navigator.push({
      screen: 'BitPortal.QRCodeScanner'
   })
  }

  // 激活钱包信息
  enableAssets = () => {
    this.props.navigator.push({
      screen: "BitPortal.AvailableAssets"
    })
  }

  // 查看资产情况
  checkAsset = () => {

  }

  // 钱包二维码
  operateAssetQRCode = (isVisible) => {
    this.setState({ isVisible })
  }

  // 从本地获取全部资产信息
  getAssetsInfo = async () => {
    try {
      const assetsInfo = await storage.getItem('bitportal_assets_info')
      if (assetsInfo) {
        this.props.actions.getAssetsInfo(JSON.parse(assetsInfo).data)
      }
    } catch (error) {
      console.error(`AsyncStorage getItem Error: ${error.message}`)
    }
  }

  createNewAccount = () => {
    this.props.navigator.push({
      screen: "BitPortal.AccountCreation"
    })
  }

  componentDidMount() {
    this.getAssetsInfo()
  }

  render() {
    let enabledAssetInfo = _.find(this.props.assetsInfo, _.matchesProperty('enabled', true))
    return (
      <View style={styles.container}>
        <Header Title="Account" displayAccount={() => this.displayAccountList()} scanQR={() => this.scanQR()} />
        { 
          !enabledAssetInfo && 
          <TouchableOpacity onPress={() => this.createNewAccount()} style={[styles.createAccountContainer, styles.center]}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="ios-add-outline" size={40} color={Colors.bgColor_FFFFFF} />
              <Text style={[styles.text14, { color: Colors.textColor_255_255_238, marginTop: 20 }]}> 
                Create New Account
              </Text>
            </View>
          </TouchableOpacity> 
        }
        {
          enabledAssetInfo && 
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TotalAssets totalAssets={425321132.21} assetName={'Meon'} onPress={() => this.operateAssetQRCode(true)} />
              <EnableAssets Title="Asset" enableAssets={() => this.enableAssets()} />
              {/* <AssetsList data={this.state.assetsList} onPress={(e) => this.checkAsset(e)} /> */}
            </ScrollView>
          </View>
        }
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver={true}
          style = {{  margin: 0 }}
          isVisible={this.state.isVisible}
          backdropOpacity={0.9}
        >
          <AssetQRCode 
            assetName={'Meon'}
            dismissModal={() => this.operateAssetQRCode(false)} 
          />
        </Modal>
      </View>
    )
  }
}
