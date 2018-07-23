import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import { bindActionCreators } from 'redux'
import * as intlActions from 'actions/intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...intlActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Languages extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    locale: this.props.locale
  }

  switchLanguage = (language) => {
    this.setState({ locale: language }, () => {
      this.props.actions.setLocale(language)
    })
  }

  render() {
    const locale = this.state.locale || this.props.locale

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].lan_title_name_language}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SettingItem
                leftItemTitle="English"
                onPress={this.switchLanguage.bind(this, 'en')}
                extraStyle={{ marginTop: 10 }}
                iconColor={Colors.bgColor_0_122_255}
                rightItemTitle={locale === 'en' ? null : ' '}
                rightImageName={locale === 'en' && 'md-checkmark'}
              />
              <SettingItem
                leftItemTitle="简体中文"
                iconColor={Colors.bgColor_0_122_255}
                rightItemTitle={locale === 'zh' ? null : ' '}
                rightImageName={locale === 'zh' && 'md-checkmark'}
                onPress={this.switchLanguage.bind(this, 'zh')}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
