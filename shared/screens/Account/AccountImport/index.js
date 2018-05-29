/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import ImportEOSAccountForm from 'components/Form/ImportEOSAccountForm'

export default class AccountImport extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isAccountVaild: true
  }

  changeAccountName = () => {

  }

  enterPrivateKey = (privateKey) => {

  }

  goToBackUp = () => {
    this.props.navigator.push({
      screen: 'BitPortal.BackupTips'
    })
  }

  render() {
    const { isAccountVaild } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Import EOS Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImportEOSAccountForm onPress={() => this.goToBackUp()} />
            <View style={styles.keyboard} />
          </ScrollView>
        </View>

      </View>
    )
  }

}
