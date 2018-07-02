/* @jsx */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import CreateEOSAccountForm from 'components/Form/CreateEOSAccountForm'
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
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.popToRoot()} />}
          title="Create EOS Account"
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
