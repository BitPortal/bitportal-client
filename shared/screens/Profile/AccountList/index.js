/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import WalletCard from './WalletCard'

export default class AccountList extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  createNewAccount = () => {
    this.props.navigator.push({ screen: 'BitPortal.AccountCreation' })
  }
  
  importAccount = () => {

  }

  checkAsset = () => {
    this.props.navigator.push({ screen: 'BitPortal.AccountManager' })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          >
            <WalletCard assetName="EOS-1"  totalAssets={3211.4123} accountName="meon-1" onPress={() => this.checkAsset()} />
            <WalletCard assetName="EOS-2"  totalAssets={211.4123} accountName="meon-2" onPress={() => this.checkAsset()} colors={['rgb(247, 107, 28)', 'rgb(250, 191, 81)']} />
            <WalletCard assetName="EOS-3"  totalAssets={11.4123} accountName="meon-3" onPress={() => this.checkAsset()} colors={['rgb(50, 174, 0)', 'rgb(158, 214, 58)']} />
            <WalletCard assetName="EOS-4"  totalAssets={1.4123} accountName="meon-4" onPress={() => this.checkAsset()} colors={['rgb(244, 75, 47)', 'rgb(248, 112, 98)']} />
          </ScrollView>
        </View>
        <View style={[styles.btnContainer, styles.between]}>
          <TouchableOpacity style={[styles.center, styles.btn]} onPress={() => this.createNewAccount()}>
            <Text style={styles.text14}> Create </Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity style={[styles.center, styles.btn]} onPress={() => this.importAccount()}>
            <Text style={styles.text14}> Import </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}
