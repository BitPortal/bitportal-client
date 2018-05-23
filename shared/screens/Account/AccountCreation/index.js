/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import CreateWalletForm from 'components/Form/CreateWalletForm'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class AccountCreation extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  constructor(props, context) {
    super(props, context)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    this.props.navigator.push({
      screen: "BitPortal.EOSAccountCreation"
    })
  }

  createPrivateKey = () => {
    this.props.navigator.push({ screen: 'BitPortal.PrivateKeyCreation' })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Create New Wallet"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CreateWalletForm onSubmit={this.onSubmit} />
            <View style={styles.keyboard} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
