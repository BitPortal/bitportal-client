/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import { Text, View, TouchableHighlight, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'
import StakeEOSForm from 'components/Form/StakeEOSForm'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class Stake extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    amount: 0
  }

  enterStakeAmount = (amount) => {
    this.setState({ amount })
  }

  stakeEOS = () => {

  }

  render() {
    const { amount } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].vt_title_name_vote}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <StakeEOSForm />
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
