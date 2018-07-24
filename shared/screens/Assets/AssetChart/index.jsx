import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { FormattedNumber, FormattedMessage, IntlProvider } from 'react-intl'
import { eosPriceSelector } from 'selectors/ticker'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { transferTransactionsSelector } from 'selectors/transaction'
import CurrencyText from 'components/CurrencyText'
import * as balanceActions from 'actions/balance'
import * as transactionActions from 'actions/transaction'
import messages from './messages'
import RecordItem from './RecordItem'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosPrice: eosPriceSelector(state),
    offset: state.transaction.get('offset'),
    hasMore: state.transaction.get('hasMore'),
    eosAccountName: eosAccountNameSelector(state),
    transferHistory: transferTransactionsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...balanceActions,
      ...transactionActions
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
          symbol: this.props.eosItem.get('symbol')
        }
      }
    })
  }

  checkTransactionRecord = (transactionInfo) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord',
        passProps: {
          transactionInfo
        }
      }
    })
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.eosAccountName !== this.props.eosAccountName || nextProps.offset !== this.props.offset || nextProps.eosPrice !== this.props.eosPrice || nextProps.locale !== this.props.locale || nextProps.eosItem !== this.props.eosItem || nextProps.transferHistory !== this.props.transferHistory
  }

  componentDidMount() {
    const eosAccountName = this.props.eosAccountName
    const offset = this.props.offset
    this.props.actions.getTransactionsRequested({ eosAccountName, offset, position: -1 })
  }

  render() {
    const { locale, eosItem, eosPrice, transferHistory, eosAccountName } = this.props

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
                {
                  transferHistory.map(transaction => (
                    <RecordItem key={transaction.get('account_action_seq')} item={transaction} onPress={this.checkTransactionRecord} eosAccountName={eosAccountName} />
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
