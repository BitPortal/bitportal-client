/* @tsx */
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
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

export default class ExportEntrance extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  exportPrivateKey = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ExportPrivateKey'
      }
    })
  }

  exportKeystore = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ExportKeystore'
      }
    })
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].export_title_name_export}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <SettingItem leftItemTitle={<FormattedMessage id="exp_sec_title_expks" />} onPress={() => this.exportKeystore()} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftItemTitle={<FormattedMessage id="exp_sec_title_expvk" />} onPress={() => this.exportPrivateKey()} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
