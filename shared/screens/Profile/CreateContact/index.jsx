/* @jsx */

import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import AddContactsForm from 'components/Form/AddContactsForm'
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

export default class CreateContact extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isAccountVaild: true
  }

  changeNickName = () => {

  }

  saveContact = () => {

  }

  render() {
    const { isAccountVaild } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].newct_title_name_newct}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
           <AddContactsForm />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
