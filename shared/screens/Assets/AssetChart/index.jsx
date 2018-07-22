import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { FormattedNumber, FormattedMessage, IntlProvider } from 'react-intl'
import { eosPriceSelector } from 'selectors/ticker'
import CurrencyText from 'components/CurrencyText'
import * as balanceActions from 'actions/balance'
import messages from './messages'
import ChartWrapper from './ChartWrapper'
import RecordItem from './RecordItem'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosPrice: eosPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...balanceActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AssetChart extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    data: [
      { amount: 234.532 },
      { amount: -4212.42 }
    ]
  }

  send = () => {
    this.props.actions.setActiveAsset(this.props.eosItem.get('symbol'))
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AssetsTransfer'
      }
    })
  }

  receive = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ReceiveQRCode',
        passProps: {
          accountName: this.props.eosItem.get('account_name')
        }
      }
    })
  }

  checkTransactionRecord = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord'
      }
    })
  }

  render() {
    const { locale, eosItem, eosPrice } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={eosItem.get('symbol')}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <Text style={[styles.text24, { marginTop: 20 }]}>
                  <FormattedNumber
                  value={eosItem.get('balance')}
                  maximumFractionDigits={4}
                  minimumFractionDigits={4}
                  />
                </Text>
                <Text style={[styles.text14, { marginBottom: 20 }]}>
                  ≈
                  <CurrencyText
                    value={+eosItem.get('balance') * +eosPrice}
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />
                </Text>

                <ChartWrapper />

                {
                  this.state.data.map((item, index) => (
                    <RecordItem key={index} item={item} onPress={() => this.checkTransactionRecord()} />
                  ))
                }

              </View>
            </ScrollView>

            <View style={[styles.btnContainer, styles.between]}>
              <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.send}>
                <Text style={styles.text14}> <FormattedMessage id="token_button_name_send" /> </Text>
              </TouchableOpacity>
              <View style={styles.line} />
              <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.receive}>
                <Text style={styles.text14}> <FormattedMessage id="token_button_name_receive" /> </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </IntlProvider>
    )
  }
}
