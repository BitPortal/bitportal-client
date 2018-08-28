import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { change } from 'redux-form/immutable'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import TransferAssetsForm from 'components/Form/TransferAssetsForm'
import { checkCamera } from 'utils/permissions'
import Loading from 'components/Loading'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transfer: state.transfer
  }),
  dispatch => ({
    actions: bindActionCreators({
      change
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AssetsTransfer extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  scanner = async () => {
    if (this.props.entry === 'scanner') {
      Navigation.pop(this.props.componentId)
    } else {
      const authorized = await checkCamera()
      if (authorized) {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.QRCodeScanner',
            passProps: {
              entry: 'form'
            }
          }
        })
      }
    }
  }

  transferAsset = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord'
      }
    })
  }

  componentDidMount() {
    const qrInfo = this.props.qrInfo
    const entry = this.props.entry

    if (entry === 'scanner' && qrInfo) {
      const eosAccountName = qrInfo.eosAccountName
      const quantity = qrInfo.amount

      if (eosAccountName) { this.props.actions.change('transferAssetsForm', 'toAccount', eosAccountName) }
      if (quantity) { this.props.actions.change('transferAssetsForm', 'quantity', quantity) }
    }
  }

  render() {
    const { locale, transfer } = this.props
    const loading = transfer.get('loading')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].snd_title_name_snd}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanner()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TransferAssetsForm componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
