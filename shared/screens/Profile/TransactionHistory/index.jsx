import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, Text, ActivityIndicator, RefreshControl } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import * as transactionActions from 'actions/transaction'
import RecordItem from 'screens/Assets/AssetChart/RecordItem'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import ImmutableDataProvider from 'utils/immutableDataProvider'
import { SCREEN_WIDTH } from 'utils/dimens'
import messages from './messages'
import styles from './styles'

const dataProvider = new ImmutableDataProvider((r1, r2) => r1.get('account_action_seq') !== r2.get('account_action_seq'))

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transferHistory: state.transaction.get('data'),
    loading: state.transaction.get('loading'),
    hasMore: state.transaction.get('hasMore'),
    loaded: state.transaction.get('loaded'),
    offset: state.transaction.get('offset'),
    position: state.transaction.get('position'),
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

  static getDerivedStateFromProps(props) {
    return {
      transferHistory: dataProvider.cloneWithRows(props.transferHistory)
    }
  }

  state = {
    transferHistory: dataProvider.cloneWithRows(this.props.transferHistory)
  }

  layoutProvider = new LayoutProvider(
    index => index % 3,
    (type, dim) => {
      dim.width = SCREEN_WIDTH
      dim.height = 70
    }
  )

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
    const offset = this.props.offset
    this.props.actions.getTransactionsRequested({ eosAccountName, offset, position: -1, loadAll: true })
  }

  loadMore = () => {
    const hasMore = this.props.hasMore

    if (hasMore) {
      const eosAccountName = this.props.eosAccountName
      const offset = this.props.offset
      const position = this.props.position
      this.props.actions.getTransactionsRequested({ eosAccountName, offset, position, loadAll: true })
    }
  }

  rowRenderer = (type, item) => (
    <RecordItem key={item.get('account_action_seq')} item={item} onPress={this.checkTransactionRecord} eosAccountName={this.props.eosAccountName} />
  )

  renderFooter = () => {
    const { loaded, hasMore, locale } = this.props

    if (loaded && hasMore) {
      return (
        <ActivityIndicator style={{ marginVertical: 10 }} size="small" color="white" />
      )
    } else if (loaded) {
      return (
        <Text style={{ marginVertical: 10, alignSelf: 'center', color: 'white' }}>
          {messages[locale].txhis_sec_time_nomore}
        </Text>
      )
    }

    return null
  }

  componentDidMount() {
    this.onRefresh()
  }

  render() {
    const { locale, loading, loaded } = this.props
    const { transferHistory } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].txhis_title_name_txhistory}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <RecyclerListView
              style={styles.list}
              refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading && !loaded} />}
              layoutProvider={this.layoutProvider}
              dataProvider={transferHistory}
              rowRenderer={this.rowRenderer}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.5}
              renderFooter={this.renderFooter}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
