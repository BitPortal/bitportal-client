import React, { Component } from 'react'
import { View, ScrollView, Clipboard } from 'react-native'
import { Navigation } from 'react-native-navigation'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { Mediafax, MediafaxIcons, MediafaxUrls } from 'constants/mediafax'
import { validateUrl } from 'utils/validate'
import Toast from 'components/Toast'
import { SOCIAL_MEDIA } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
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

export default class MediafaxScreen extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  changePage = (index, item) => {
    // Umeng analitics
    onEventWithLabel(SOCIAL_MEDIA.item)
    if (validateUrl(MediafaxUrls[item])) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.BPWebView',
          passProps: {
            title: messages[this.props.locale][`mdf_title_index_media${index}`],
            needLinking: true,
            uri: MediafaxUrls[item]
          }
        }
      })
    } else {
      Clipboard.setString(`@${MediafaxUrls[item]}`)
      Toast(messages[this.props.locale].mdf_title_name_copied)
    }
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].mdf_title_name_nav}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 10 }}>
              {Mediafax.map((item, index) => (
                <SettingItem
                  key={index}
                  leftImage={MediafaxIcons[item]}
                  leftItemTitle={messages[locale][`mdf_title_index_media${index}`]}
                  rightItemTitle={(item.indexOf('Wechat') !== -1) && `${MediafaxUrls[item]}`}
                  onPress={() => this.changePage(index, item)}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
