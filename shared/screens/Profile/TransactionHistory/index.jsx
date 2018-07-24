import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import * as transactionActions from 'actions/transaction'
import RecordItem from 'screens/Assets/AssetChart/RecordItem'
import ListItem from './ListItem'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transaction: state.transaction,
    eosAccountName: eosAccountNameSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class TransationHistory extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
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

  componentDidMount() {
    const eosAccountName = this.props.eosAccountName
    const offset = this.props.transaction.get('offset')
    this.props.actions.getTransactionsRequested({ eosAccountName, offset, position: -1 })
  }

  componentWillUnmount() {
    this.props.actions.resetTransaction()
  }

  render() {
    const { locale, transaction, eosAccountName } = this.props
    const transferHistory = transaction.get('data')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].txhis_title_name_txhistory}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView>
              {
                transferHistory.map(transaction => (
                  <RecordItem key={transaction.get('account_action_seq')} item={transaction} onPress={this.checkTransactionRecord} eosAccountName={eosAccountName} />
                ))
              }
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
