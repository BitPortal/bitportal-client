/* @jsx */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import CreateWalletAndEOSAccountForm from 'components/Form/CreateWalletAndEOSAccountForm'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef : true }
)

export default class AccountCreation extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  constructor(props, context) {
    super(props, context)
    this.onSubmit = this.onSubmit.bind(this)
    this.importEOSAccount = this.importEOSAccount.bind(this)
  }

  importEOSAccount() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountImport'
      }
    })
  }

  onSubmit() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.EOSAccountCreation'
      }
    })
  }

  createPrivateKey = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.PrivateKeyCreation'
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title="Create EOS Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CreateWalletAndEOSAccountForm onSubmit={this.onSubmit} importEOSAccount={this.importEOSAccount} />
            <View style={styles.keyboard} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
