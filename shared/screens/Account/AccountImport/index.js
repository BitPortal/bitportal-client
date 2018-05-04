/* @jsx */
import React, { Component, Children } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { LeftButton, CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'

export default class AccountImport extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<LeftButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          title="Import"
        />

      </View>
    )
  }

}
