import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import ResetPasswordForm from 'components/Form/ResetPasswordForm'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    keystore: state.keystore
  }),
  null,
  null,
  { withRef: true }
)

export default class ResetPassword extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { locale, keystore, componentId } = this.props
    const loading = keystore.get('changing')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].change_password_title_change_password}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ResetPasswordForm componentId={componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
