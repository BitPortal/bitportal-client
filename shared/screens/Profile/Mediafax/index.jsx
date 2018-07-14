/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { Mediafax, MediafaxIcons, MediafaxUrls } from 'constants/mediafax'
import Images from 'resources/images'
import { validateUrl } from 'utils/validate'
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

export default class MediafaxScreen extends Component {

  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  changePage = (title) => {
    if (validateUrl(MediafaxUrls[title])) {
      Navigation.push(this.props.componentId, {
        component: {
          name: `BitPortal.BPWebView`,
          passProps: {
            title,
            uri: MediafaxUrls[title]
          }
        }
      })
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: `BitPortal.BPWebView`,
          passProps: {
            title,
            name: MediafaxUrls[title]
          }
        }
      })
    }
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]["mdf_title_name_nav"]}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 10 }}>
              {Mediafax.map((item, index) => (
                <SettingItem 
                  key={index} 
                  leftImage={MediafaxIcons[item]} 
                  leftItemTitle={item} 
                  onPress={() => this.changePage(item)} 
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}