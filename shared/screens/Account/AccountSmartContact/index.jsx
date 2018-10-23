import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import CreateEOSAccountSmartContactForm from 'components/Form/CreateEOSAccountSmartContactForm'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: state.eosAccount
  }),
  null,
  null,
  { withRef: true }
)

export default class AccountSmartContact extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { locale, eosAccount } = this.props
    const loading = eosAccount.get('loading')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].add_eos_create_smart_contract_title_smart_contract}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <CreateEOSAccountSmartContactForm componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
