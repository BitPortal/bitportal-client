import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { IntlProvider } from 'react-intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import ImportEOSAccountForm from 'components/Form/ImportEOSAccountForm'
import Loading from 'components/Loading'
import messages from './messages'
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

export default class AccountImport extends Component {
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
            title={messages[locale].import_title_name_impt}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: Colors.bgColor_30_31_37 }}>
              <ImportEOSAccountForm componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
