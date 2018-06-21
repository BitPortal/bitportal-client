/* @jsx */

import React from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import ImportEOSAccountForm from 'components/Form/ImportEOSAccountForm'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class AccountImport extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  changeAccountName = () => {

  }

  enterPrivateKey = () => {

  }

  goToBackUp = () => {
    this.props.navigator.push({
      screen: 'BitPortal.BackupTips'
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            title={messages[locale].import_title_name_impt}
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
