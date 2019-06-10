import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableHighlight } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import { activeWalletSelector, activeChainSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector, activeAssetBalanceSelector } from 'selectors/balance'
import { activeWalletTickerSelector } from 'selectors/ticker'
import { activeWalletTransactionsSelector } from 'selectors/transaction'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { activeAssetSelector } from 'selectors/asset'
import FastImage from 'react-native-fast-image'
import * as transactionActions from 'actions/transaction'
import * as walletActions from 'actions/wallet'
import * as balanceActions from 'actions/balance'
import { assetIcons } from 'resources/images'
import styles from './styles'
const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    getTransactions: state.getTransactions,
    chain: activeChainSelector(state),
    activeWallet: activeWalletSelector(state),
    activeAsset: activeAssetSelector(state),
    walletBalance: activeWalletBalanceSelector(state),
    assetBalance: activeAssetBalanceSelector(state),
    ticker: activeWalletTickerSelector(state),
    transactions: activeWalletTransactionsSelector(state),
    childAddress: managingWalletChildAddressSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...walletActions,
      ...balanceActions
    }, dispatch)
  })
)

export default class Asset extends Component {
  static get options() {
    return {
      topBar: {
        noBorder: true
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  onRefresh = () => {

  }

  toTransferAsset = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.TransferAsset',
            options: {
              topBar: {
                title: {
                  text: `发送${this.props.activeAsset.symbol}到`
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })

    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.TransferAsset',
     *     options: {
     *       topBar: {
     *         title: {
     *           text: `发送${this.props.activeWallet.symbol}到`
     *         }
     *       }
     *     }
     *   }
     * })*/
  }

  toReceiveAsset = async () => {
    const constants = await Navigation.constants()

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ReceiveAsset',
        passProps: {
          statusBarHeight: constants.statusBarHeight
        },
        options: {
          topBar: {
            title: {
              text: `接收 ${this.props.activeWallet.symbol}`
            },
            noBorder: this.props.activeWallet.chain === 'BITCOIN' && this.props.childAddress && this.props.activeWallet.address !== this.props.childAddress
          }
        }
      }
    })
  }

  componentDidAppear() {
    const { activeWallet, activeAsset } = this.props
    const contract = activeAsset.contract
    const assetSymbol = activeAsset.symbol
    this.props.actions.getTransactions.requested({ ...this.props.activeWallet, contract, assetSymbol })
  }

  componentDidDisappear() {
    this.props.actions.getTransactions.succeeded()
  }

  componentDidMount() {
    this.props.actions.setActiveWallet(this.props.activeWallet.id)
    const { activeAsset, activeWallet, chain } = this.props

    if (activeAsset.contract) {
      this.props.actions.getEOSTokenBalance.requested({ ...activeAsset, ...activeWallet })
    } else {
      this.props.actions.getBalance.requested(activeWallet)
    }
  }

  toTransactionDetail = (id, pending) => {
    this.props.actions.setActiveTransactionId(id)

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionDetail',
        options: {
          topBar: {
            title: {
              text: `${this.props.activeWallet.symbol} ${!pending ? '转账成功' : '转账中...'}`
            }
          }
        },
        passProps: {
          chain: this.props.activeWallet.chain,
          precision: this.props.assetBalance.precision,
          symbol: this.props.assetBalance.symbol
        }
      }
    })
  }

  onRefresh = () => {
    this.props.actions.getTransactions.refresh(this.props.activeWallet)
  }

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  /* onLoadMore = (e) => {
   *   console.log('onLoadMore', e)
   * }*/

  render() {
    const { ticker, walletBalance, activeWallet, activeAsset, intl, transactions, getTransactions, statusBarHeight, assetBalance } = this.props
    const balance = activeAsset.contract ? assetBalance : walletBalance
    const transactionCount = transactions && transactions.length
    const precision = balance.precision
    const symbol = balance.symbol
    const hasTransactions = !!transactions
    const loading = getTransactions.loading
    const refreshing = getTransactions.refreshing
    const emptyTransactions = !!transactions && transactions.length === 0
    const chain = activeWallet ? activeWallet.chain : ''

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#F7F7F7', height: 180 + +statusBarHeight + 52, paddingTop: +statusBarHeight + 44 + 52 }}>
          <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 16, paddingLeft: 16 }}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '60%' }}>
              <Text style={{ fontSize: 26, fontWeight: '500' }}>{balance && intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })}</Text>
              {!assetBalance && <Text style={{ fontSize: 20, color: '#007AFF', marginTop: 4 }}>≈ ${(ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</Text>}
              {!!assetBalance && <Text style={{ fontSize: 20, color: '#007AFF', marginTop: 4 }}>≈ ${(ticker && ticker[`${activeWallet.chain}/${assetBalance.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${assetBalance.symbol}`], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</Text>}
            </View>
            {(!activeAsset || !activeAsset.icon_url) && !!chain && <FastImage source={assetIcons[chain.toLowerCase()]} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />}
            {(!!activeAsset && !!activeAsset.icon_url) && <FastImage source={{ uri: activeAsset.icon_url }} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />}
          </View>
          {/* <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16 }}>
              <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.48)' }}>{this.formatAddress(activeWallet.address)}</Text>
              </View> */}
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, marginTop: 12 }}>
            <View style={{ width: '50%', paddingRight: 8 }}>
              <TouchableHighlight underlayColor="#007AFF" style={{ padding: 5 }} activeOpacity={0.7} style={{ backgroundColor: '#007AFF', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center' }} onPress={this.toTransferAsset}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <FastImage
                    source={require('resources/images/transfer_white.png')}
                    style={{ width: 26, height: 26, marginRight: 8 }}
                  />
                  <Text style={{ color: 'white', fontSize: 17 }}>转账</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={{ width: '50%', paddingLeft: 8 }}>
              <TouchableHighlight underlayColor="#007AFF" style={{ padding: 5 }} activeOpacity={0.7} style={{ backgroundColor: '#007AFF', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center' }} onPress={this.toReceiveAsset}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <FastImage
                    source={require('resources/images/receive_white.png')}
                    style={{ width: 26, height: 26, marginRight: 8, marginBottom: 3 }}
                  />
                  <Text style={{ color: 'white', fontSize: 17 }}>收款</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
        </View>
        <TableView
          style={{ flex: 1, backgroundColor: 'white' }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          detailTextColor="#666666"
          headerBackgroundColor="white"
          headerTextColor="black"
          headerFontSize={17}
          onItemNotification={this.onItemNotification}
          separatorStyle={TableView.Consts.SeparatorStyle.None}
          onRefresh={this.onRefresh}
          refreshing={refreshing}
          canRefresh={hasTransactions}
          canLoadMore={true}
        >
          <Section uid="HeaderTableViewCell">
            <Item
              reactModuleForCell="HeaderTableViewCell"
              title={emptyTransactions ? '暂无交易记录' : '交易记录'}
              loading={(!refreshing && loading) && (!hasTransactions || emptyTransactions)}
              loadingTitle="获取交易记录..."
              height={48}
              componentId={this.props.componentId}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
          </Section>
          {transactionCount && <Section>
            {transactions.map((transaction: any, index: number) => <Item
              reactModuleForCell="TransactionTableViewCell"
              height={60}
              key={transaction.id}
              id={transaction.id}
              change={intl.formatNumber(+transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}
              date={transaction.timestamp && intl.formatDate(+transaction.timestamp, { year: 'numeric', month: 'numeric', day: 'numeric' })}
              time={transaction.timestamp && intl.formatTime(+transaction.timestamp, { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' })}
              transactionType={transaction.transactionType}
              targetAddress={transaction.targetAddress}
              symbol={symbol}
              componentId={this.props.componentId}
              showSeparator={transactionCount - 1 !== index}
              onPress={this.toTransactionDetail.bind(this, transaction.id, transaction.pending)}
            />
            )}
          </Section>}
        </TableView>
      </View>
    )
  }
}
