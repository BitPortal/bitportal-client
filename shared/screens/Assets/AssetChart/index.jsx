import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Text, View, TouchableOpacity, VirtualizedList, ActivityIndicator } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { FormattedNumber, FormattedMessage, IntlProvider } from 'react-intl'
import { eosPriceSelector } from 'selectors/ticker'
import { activeAssetSelector } from 'selectors/balance'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { activeAssetTransactionsSelector } from 'selectors/transaction'
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
    activeAsset: activeAssetSelector(state),
    loading: state.transaction.get('loading'),
    loaded: state.transaction.get('loaded'),
    hasMore: state.transaction.get('hasMore'),
    offset: state.transaction.get('offset'),
    position: state.transaction.get('position'),
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

  send = () => {
    this.props.actions.setActiveAsset(this.props.activeAsset)
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
          symbol: this.props.activeAsset.get('symbol')
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

  componentDidAppear() {
    this.onRefresh()
  }

  render() {
    const { locale, activeAsset, eosPrice, transferHistory, loading, hasMore, loaded, eosAccountName } = this.props

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
                    value={activeAsset.get('balance')}
                    maximumFractionDigits={4}
                    minimumFractionDigits={4}
                  />
                </Text>
                <Text style={[styles.text14, { marginBottom: 20 }]}>
                  ≈
                  <CurrencyText
                    value={+activeAsset.get('balance') * +eosPrice}
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />
                </Text>
              </View>
              <VirtualizedList
                data={transferHistory}
                refreshing={loading && !loaded}
                onRefresh={this.onRefresh}
                getItem={(items, index) => (items.get ? items.get(index) : items[index])}
                getItemCount={items => (items.size || 0)}
                keyExtractor={item => String(item.get('account_action_seq'))}
                renderItem={({ item }) => <RecordItem key={item.get('account_action_seq')} item={item} onPress={this.checkTransactionRecord} eosAccountName={eosAccountName} />}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  (loaded && hasMore)
                    ? <ActivityIndicator style={{ marginVertical: 10 }} size="small" color="white" />
                    : (loaded
                    && <Text style={{ marginVertical: 10, alignSelf: 'center', color: 'white' }}>
                      {messages[locale].token_title_name_nomore}
                    </Text>)
                }
              />
            </View>
            <View style={[styles.btnContainer, styles.between]}>
              <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.send}>
                <Text style={styles.text14}><FormattedMessage id="token_button_name_send" /></Text>
              </TouchableOpacity>
              <View style={styles.line} />
              <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.receive}>
                <Text style={styles.text14}><FormattedMessage id="token_button_name_receive" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
