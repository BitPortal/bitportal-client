/* @jsx */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { IntlProvider } from 'react-intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import ImportEOSAccountForm from 'components/Form/ImportEOSAccountForm'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class AccountImport extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  changeAccountName = () => {

  }

  enterPrivateKey = () => {

  }

  goToBackUp = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BackupTips'
      }
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].import_title_name_impt}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, backgroundColor: Colors.bgColor_48_49_59 }} >
              <ImportEOSAccountForm onPress={() => this.goToBackUp()} componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
