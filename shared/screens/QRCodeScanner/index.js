/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import QRCodeScanner from 'react-native-qrcode-scanner';

export default class Scanner extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  onSuccess(e) {
    this.props.navigator.push({
      screen: 'BitPortal.AssetsTransfer',
      passProps: {
        entry: 'scanner'
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          title="QRCode Scanner"
        />
       
       <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        showMarker={true}
        bottomContent={
          <TouchableOpacity onPress={() => this.onSuccess()} style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>Go To Send</Text>
          </TouchableOpacity>
        }
      />

      </View>
    )
  }

}
