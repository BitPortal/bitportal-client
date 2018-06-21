/* @jsx */

import React from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)
export default class Scanner extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  onSuccess() {
    this.props.navigator.push({
      screen: 'BitPortal.AssetsTransfer',
      passProps: {
        entry: 'scanner'
      }
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            title={messages[locale].qrscn_title_name_qrscanner}
          />
          <QRCodeScanner
            onRead={this.onSuccess.bind(this)}
            showMarker={true}
            bottomContent={<TouchableOpacity onPress={() => this.onSuccess()} style={styles.buttonTouchable}><Text style={styles.buttonText}>Go To Send</Text></TouchableOpacity>}
          />
        </View>
      </IntlProvider>
    )
  }
}
