
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, Image } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import TotalAssets from 'components/TotalAssets'
import Header from './Header'
import AddAssets from './AddAssets'
import AssetsList from './AssetsList'
import styles from './styles'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import AssetQRCode from './AssetQRCode'

export default class Assets extends BaseScreen {

  state = {
    isVisible: false,
    assetsList: [
      { assetName: 'EOS', assetValue: 1.02, assetValueEqual: 4213.21 },
      { assetName: 'UIP', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'OCT', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'PRA', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'DEW', assetValue: 1.02, assetValueEqual: 4213.21 },
      { assetName: 'OCT', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'PRA', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'DEW', assetValue: 1.02, assetValueEqual: 4213.21 },
      { assetName: 'OCT', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'PRA', assetValue: 1.02, assetValueEqual: 4213.21 }, 
      { assetName: 'DEW', assetValue: 1.02, assetValueEqual: 4213.21 }
    ]
  }

  // 展示账户列表
  displayAccount = () => {

  }

  // 前往扫描
  scanQR = () => {
    
  }

  // 添加钱包信息
  addAssets = () => {
    this.props.navigator.push({
      screen: "BitPortal.AddAssets"
    })
  }

  // 查看资产情况
  checkAsset = () => {

  }

  // 钱包二维码
  operateAssetQRCode = (isVisible) => {
    this.setState({ isVisible })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header Title="Account" displayAccount={() => this.displayAccount()} scanQR={() => this.scanQR()} />
        
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TotalAssets totalAssets={425321132.21} assetName={'Meon'} onPress={() => this.operateAssetQRCode(true)} />
            <AddAssets Title="Asset" addAssets={() => this.addAssets()} />
            <AssetsList data={this.state.assetsList} onPress={(e) => this.checkAsset(e)} />
          </ScrollView>
        </View>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
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
