import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { change } from 'redux-form/immutable'
import { IntlProvider } from 'react-intl'
import * as balanceActions from 'actions/balance'
import { parseEOSQrString } from 'utils'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...balanceActions,
      change
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

  onSuccess = (e) => {
    const qrInfo = parseEOSQrString(e.data)

    if (qrInfo) {
      const token = qrInfo.token
      this.props.actions.setActiveAsset(token)

      if (this.props.entry === 'form') {
        const eosAccountName = qrInfo.eosAccountName
        const quantity = qrInfo.amount

        if (eosAccountName) this.props.actions.change('transferAssetsForm', 'toAccount', eosAccountName)
        if (quantity) this.props.actions.change('transferAssetsForm', 'quantity', quantity)

        Navigation.pop(this.props.componentId)
      } else {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.AssetsTransfer',
            passProps: {
              entry: 'scanner',
              qrInfo
            }
          }
        })
      }
    }
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
            onRead={this.onSuccess}
            showMarker={true}
          />
        </View>
      </IntlProvider>
    )
  }
}
