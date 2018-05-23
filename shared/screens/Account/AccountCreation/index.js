/* @jsx */
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import CreateEOSAccountForm from 'components/Form/CreateEOSAccountForm'
import styles from './styles'

export default class AccountCreation extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  constructor(props, context) {
    super(props, context)
  }

  createPrivateKey = () => {
    this.props.navigator.push({ screen: 'BitPortal.PrivateKeyCreation' })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Create New Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CreateEOSAccountForm onPress={() => this.createPrivateKey()} />
            <View style={styles.keyboard} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
