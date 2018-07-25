import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, VirtualizedList, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import * as transactionActions from 'actions/transaction'
import RecordItem from 'screens/Assets/AssetChart/RecordItem'
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

  onRefresh = () => {
    const eosAccountName = this.props.eosAccountName
    const offset = this.props.transaction.get('offset')
    this.props.actions.getTransactionsRequested({ eosAccountName, offset, position: -1 })
  }

  loadMore = () => {
    const hasMore = this.props.transaction.get('hasMore')

    if (hasMore) {
      const eosAccountName = this.props.eosAccountName
      const offset = this.props.transaction.get('offset')
      const position = this.props.transaction.get('position')
      this.props.actions.getTransactionsRequested({ eosAccountName, offset, position })
    }
  }

  componentDidMount() {
    this.onRefresh()
  }

  render() {
    const { locale, transaction, eosAccountName } = this.props
    const transferHistory = transaction.get('data')
    const loading = transaction.get('loading')
    const hasMore = transaction.get('hasMore')
    const loaded = transaction.get('loaded')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].txhis_title_name_txhistory}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <VirtualizedList
              data={transferHistory}
              refreshing={loading && !loaded}
              onRefresh={this.onRefresh}
              getItem={(items, index) => (items.get ? items.get(index) : items[index])}
              getItemCount={items => (items.size || 0)}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item }) => <RecordItem key={item.get('account_action_seq')} item={item} onPress={this.checkTransactionRecord} eosAccountName={eosAccountName} />}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={(loaded && hasMore) ? <ActivityIndicator style={{ marginVertical: 10 }} size="small" color="white" /> : (loaded && <Text style={{ marginVertical: 10, alignSelf: 'center', color: 'white' }}>没有更多数据了</Text>)}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
