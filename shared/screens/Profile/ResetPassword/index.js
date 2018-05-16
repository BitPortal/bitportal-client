/* @jsx */
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import ResetPasswordForm from 'components/Form/ResetPasswordForm'
import styles from './styles'

export default class ResetPassword extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Reset Password"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ResetPasswordForm />
          </ScrollView>
        </View>
      </View>
    )
  }
}
