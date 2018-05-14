/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import TotalAssetsCard from 'components/TotalAssetsCard'

export default class ExportEntrance extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  exportPrivateKey = () => {
    this.props.navigator.push({ screen: 'BitPortal.ExportPrivateKey' })
  }

  exportKeystore = () => {
    this.props.navigator.push({ screen: 'BitPortal.ExportKeystore' })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="Export"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          >
            <SettingItem leftItemTitle={'Export Private Key'} onPress={() => this.exportPrivateKey()} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Export Keystore'} onPress={() => this.exportKeystore()} />
          </ScrollView>
        </View>
      </View>
    )
  }

}
