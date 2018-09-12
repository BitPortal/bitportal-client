import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Text, View, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { FormattedNumber, FormattedMessage, IntlProvider } from 'react-intl'
import { eosPriceSelector } from 'selectors/ticker'
import { activeAssetSelector, activeAssetBalanceSelector } from 'selectors/balance'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { activeAssetTransactionsSelector } from 'selectors/transaction'
import CurrencyText from 'components/CurrencyText'
import * as balanceActions from 'actions/balance'
import * as transactionActions from 'actions/transaction'
import { ASSETS_TOKEN_SEND, ASSETS_TOKEN_RECEIVE, ASSETS_TRX_RECORD } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import ImmutableDataProvider from 'utils/immutableDataProvider'
import { SCREEN_WIDTH } from 'utils/dimens'
import messages from 'resources/messages'
import RecordItem from './RecordItem'
import styles from './styles'

const dataProvider = new ImmutableDataProvider((r1, r2) => r1.get('account_action_seq') !== r2.get('account_action_seq'))

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosPrice: eosPriceSelector(state),
    activeAsset: activeAssetSelector(state),
    activeAssetBalance: activeAssetBalanceSelector(state),
    loading: state.transaction.get('loading'),
    loaded: state.transaction.get('loaded'),
    hasMore: state.transaction.get('hasMore'),
    offset: state.transaction.get('offset'),
    position: state.transaction.get('position'),
    refresh: state.transaction.get('refresh'),
    transferHistory: activeAssetTransactionsSelector(state),
    eosAccountName: eosAccountNameSelector(state)
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

  send = () => {
    // Umeng analytics
    onEventWithLabel(ASSETS_TOKEN_SEND, '资产 - token资产详情 - 发送')
    this.props.actions.setActiveAsset(this.props.activeAsset)
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AssetsTransfer'
      }
    })
  }

  receive = () => {
    // Umeng analytics
    onEventWithLabel(ASSETS_TOKEN_RECEIVE, '资产 - token资产详情 - 接收')
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ReceiveQRCode',
        passProps: {
          symbol: this.props.activeAsset.get('symbol')
        }
      }
    })
  }

  checkTransactionRecord = (transactionInfo) => {
    // Umeng analytics
    onEventWithLabel(ASSETS_TRX_RECORD, '资产 - 资产详情 - 交易记录')
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord',
        passProps: {
          transactionInfo
        }
      }
    })
  }

  loadMore = () => {
    const hasMore = this.props.hasMore

    if (hasMore) {
      const eosAccountName = this.props.eosAccountName
      const offset = this.props.offset
      const position = this.props.position
      this.props.actions.getTransactionsRequested({ eosAccountName, offset, position })
    }
  }

  onRefresh = () => {
    const eosAccountName = this.props.eosAccountName
    const offset = this.props.offset
    this.props.actions.getTransactionsRequested({
      eosAccountName,
      offset,
      position: -1
    })
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
          {messages[locale].transaction_list_text_no_data}
        </Text>
      )
    }

    return null
  }

  componentDidMount() {
    this.onRefresh()
    const { activeAsset, eosAccountName } = this.props
    this.props.actions.getEOSAssetBalanceRequested({ code: activeAsset.get('contract'), eosAccountName })
  }

  render() {
    const { locale, activeAsset, activeAssetBalance, eosPrice, loading, refresh } = this.props
    const { transferHistory } = this.state
    const assetPrice = activeAsset.get('symbol') === 'EOS' ? eosPrice : 0

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={activeAsset.get('symbol')}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <View style={styles.content}>
              <View style={styles.topContent}>
                <Text style={[styles.text24, { marginTop: 20 }]}>
                  <FormattedNumber
                    value={activeAssetBalance}
                    maximumFractionDigits={4}
                    minimumFractionDigits={4}
                  />
                </Text>
                <Text style={[styles.text14, { marginBottom: 20 }]}>
                  ≈
                  <CurrencyText
                    value={+activeAssetBalance * +assetPrice}
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />
                </Text>
              </View>
              <RecyclerListView
                refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading && refresh} />}
                layoutProvider={this.layoutProvider}
                dataProvider={transferHistory}
                rowRenderer={this.rowRenderer}
                onEndReached={this.loadMore}
                onEndReachedThreshold={-0.5}
                renderFooter={this.renderFooter}
              />
            </View>
            <View style={[styles.btnContainer, styles.between]}>
              <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.send}>
                <Text style={styles.text14}><FormattedMessage id="transaction_list_button_send" /></Text>
              </TouchableOpacity>
              <View style={styles.line} />
              <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.receive}>
                <Text style={styles.text14}><FormattedMessage id="transaction_list_button_receive" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
