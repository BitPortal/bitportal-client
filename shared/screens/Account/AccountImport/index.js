/* @jsx */

import React from 'react'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import ImportEOSAccountForm from 'components/Form/ImportEOSAccountForm'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from './messages'
import { connect } from 'react-redux'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

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
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            title={messages[locale]['import_title_name_impt']}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ImportEOSAccountForm onPress={() => this.goToBackUp()} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
