import React, { Component } from 'react'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import Keystore from './Keystore'
import QRCode from './QRCode'
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

export default class ExportKeystore extends Component {
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
            title={messages[locale].expks_title_name_expks}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <ScrollableTabView
            initialPage={0}
            renderTabBar={() => (
              <DefaultTabBar
                textStyle={[styles.text16, { color: Colors.textColor_255_255_238 }]}
                tabStyle={{ marginTop: 6 }}
                backgroundColor={Colors.minorThemeColor}
                activeTextColor={Colors.textColor_89_185_226}
                inactiveTextColor={Colors.textColor_255_255_238}
                underlineStyle={{ backgroundColor: Colors.borderColor_89_185_226, height: 2 }}
              />
            )}
          >
            <Keystore tabLabel={`${messages[locale].expks_tab_title_keystore}`} />
            <QRCode tabLabel={`${messages[locale].expks_tab_title_QRC}`} />
          </ScrollableTabView>
        </View>
      </IntlProvider>
    )
  }
}
