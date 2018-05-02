
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, Image } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import TotalAssets from 'components/TotalAssets'
import Header from './Header'
import AddAssets from './AddAssets'
import AssetsList from './AssetsList'
import styles from './styles'
import Colors from 'resources/colors'

export default class Wallet extends BaseScreen {

  state = {
    assetsList: [
      { assetName: 'EOS', assetValue: 1.02, assetValueEqual: 4213.21 },
      { assetName: 'UIP', assetValue: 1.02, assetValueEqual: 4213.21 }, 
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

  }

  // 查看资产情况
  checkAsset = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header Title="Account" displayAccount={() => this.displayAccount()} scanQR={() => this.scanQR()} />
        <TotalAssets totalAssets={425321132.21} userName={'Meon'} />
        <AddAssets Title="Asset" addAssets={() => this.addAssets()} />
        <AssetsList data={this.state.assetsList} onPress={(e) => this.checkAsset(e)} />
      </View>
    )
  }
}
