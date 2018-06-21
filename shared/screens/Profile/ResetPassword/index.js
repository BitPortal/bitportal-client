/* @jsx */
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import ResetPasswordForm from 'components/Form/ResetPasswordForm'
import styles from './styles'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class ResetPassword extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].cpwd_title_name_cpwd}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ResetPasswordForm />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
