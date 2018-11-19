import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import AddContactsForm from 'components/Form/AddContactsForm'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class CreateContact extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].contacts_add_title_add_contact}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <AddContactsForm componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
