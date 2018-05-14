/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import Keystore from './Keystore'
import QRCode from './QRCode'

export default class ExportKeystore extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="Export Keystore"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
        />
        <ScrollableTabView
          initialPage={0}
          renderTabBar={() => (
            <DefaultTabBar  
              textStyle={[styles.text16, { color: Colors.textColor_255_255_238 }]}
              tabStyle={{ marginTop: 6 }}
              backgroundColor={Colors.minorThemeColor}
              activeTextColor={Colors.textColor_89_185_226}
              inactiveTextColor={Colors.textColor_255_255_238}
              underlineStyle={{ backgroundColor: Colors.borderColor_89_185_226, height: 2 }}
            />
          )}
        >
          <Keystore tabLabel='Keystore' />
          <QRCode tabLabel='QR Code' />
        </ScrollableTabView>  
      </View>
    )
  }

}
