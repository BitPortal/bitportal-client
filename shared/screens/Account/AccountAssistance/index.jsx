import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import CreateEOSAccountAssistanceForm from 'components/Form/CreateEOSAccountAssistanceForm'
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

export default class AccountAssistance extends Component {
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
            title={messages[locale].add_eos_create_friend_assistance_title_friend_assistance}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <CreateEOSAccountAssistanceForm componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
