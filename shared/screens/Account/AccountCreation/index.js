/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { BackButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
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
    this.goBack = this.goBack.bind(this)
  }

  goBack() {
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<BackButton iconName="md-arrow-back" onPress={this.goBack} />}
          title="Create New Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CreateEOSAccountForm />
          </ScrollView>
        </View>
      </View>
    )
  }
}
