import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, TouchableOpacity } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { IntlProvider } from 'react-intl'
import * as balanceActions from 'actions/balance'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...balanceActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Scanner extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  onSuccess(qrValue) {
    this.props.actions.setActiveAsset('EOS')
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AssetsTransfer',
        passProps: {
          entry: 'scanner',
          qrValue
        }
      }
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].qrscn_title_name_qrscanner}
          />
          <QRCodeScanner
            onRead={this.onSuccess.bind(this)}
            showMarker={true}
            // bottomContent={<TouchableOpacity onPress={() => this.onSuccess()} style={styles.buttonTouchable}><Text style={styles.buttonText}>Go To Send</Text></TouchableOpacity>}
          />
        </View>
      </IntlProvider>
    )
  }
}
