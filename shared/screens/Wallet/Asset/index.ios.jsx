import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableHighlight, NativeModules, StatusBarIOS, SafeAreaView } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import { activeWalletSelector, activeChainSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector, activeAssetBalanceSelector } from 'selectors/balance'
import { activeWalletTickerSelector } from 'selectors/ticker'
import { activeWalletTransactionsSelector, activeWalletTransactionsLoadingMoreSelector, activeWalletTransactionsCanLoadMoreSelector } from 'selectors/transaction'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { activeAssetSelector } from 'selectors/asset'
import { currencySelector } from 'selectors/currency'
import FastImage from 'react-native-fast-image'
import * as transactionActions from 'actions/transaction'
import * as walletActions from 'actions/wallet'
import * as balanceActions from 'actions/balance'
import { assetIcons } from 'resources/images'
import chainxAccount from '@chainx/account'
import styles from './styles'
const { StatusBarManager } = NativeModules
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
    childAddress: managingWalletChildAddressSelector(state),
    loadingMore: activeWalletTransactionsLoadingMoreSelector(state),
    canLoadMore: activeWalletTransactionsCanLoadMoreSelector(state),
    currency: currencySelector(state)
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

  state = {
    statusBarHeight: 0
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
              text: `接收 ${this.props.activeAsset.symbol}`
            },
            noBorder: this.props.activeWallet.chain === 'BITCOIN' && this.props.childAddress && this.props.activeWallet.address !== this.props.childAddress
          }
        }
      }
    })
  }

  componentDidAppear() {

  }

  componentDidDisappear() {

  }

  componentDidMount() {
    this.props.actions.setActiveWallet(this.props.activeWallet.id)
    const { activeAsset, activeWallet, chain } = this.props

    if (activeAsset && activeAsset.contract) {
      if (activeWallet.chain === 'EOS') {
        this.props.actions.getEOSTokenBalance.requested({ ...activeWallet, contract: activeAsset.contract, assetSymbol: activeAsset.symbol })
      } else if (activeWallet.chain === 'ETHEREUM') {
        this.props.actions.getETHTokenBalance.requested({ ...activeWallet, contract: activeAsset.contract, assetSymbol: activeAsset.symbol, decimals: activeAsset.decimals })
      }
    } else {
      this.props.actions.getBalance.requested(activeWallet)
    }

    const contract = activeAsset.contract
    const assetSymbol = activeAsset.symbol
    this.props.actions.getTransactions.requested({ ...this.props.activeWallet, contract, assetSymbol })

    StatusBarManager.getHeight(response =>
      this.setState({ statusBarHeight: response.height })
    )

    this.listener = StatusBarIOS.addListener('statusBarFrameWillChange',
                                             (statusBarData) => {
                                               StatusBarManager.getHeight(response =>
                                                 this.setState({ statusBarHeight: response.height })
                                               )
                                             }
    )
  }

  componentWillUnmount () {
    if (this.listener) {
      this.listener.remove()
    }
  }

  toTransactionDetail = (id, pending, failed) => {
    this.props.actions.setActiveTransactionId(id)

    let statusText = '转账成功'
    if (pending) statusText = '转账中...'
    if (failed) statusText = '转账失败'

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionDetail',
        options: {
          topBar: {
            title: {
              text: `${this.props.activeAsset.symbol} ${statusText}`
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
    const { activeWallet, activeAsset } = this.props
    const contract = activeAsset.contract
    const assetSymbol = activeAsset.symbol
    this.props.actions.getTransactions.refresh({ ...this.props.activeWallet, contract, assetSymbol })

    if (activeAsset && activeAsset.contract) {
      if (activeWallet.chain === 'EOS') {
        this.props.actions.getEOSTokenBalance.requested({ ...activeWallet, contract: activeAsset.contract, assetSymbol: activeAsset.symbol })
      } else if (activeWallet.chain === 'ETHEREUM') {
        this.props.actions.getETHTokenBalance.requested({ ...activeWallet, contract: activeAsset.contract, assetSymbol: activeAsset.symbol, decimals: activeAsset.decimals })
      }
    } else {
      this.props.actions.getBalance.requested(activeWallet)
    }
  }

  loadMore = () => {
    const { activeWallet, activeAsset } = this.props
    const contract = activeAsset.contract
    const assetSymbol = activeAsset.symbol
    this.props.actions.getTransactions.requested({ ...this.props.activeWallet, contract, assetSymbol, loadMore: true })
  }

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  toChainXHistory = () => {
    const address = this.props.activeWallet.address
    const publicKey = chainxAccount.decodeAddress(address)
    const url = `https://scan.chainx.org/accounts/${publicKey}`
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WebView',
        passProps: {
          url: url
        },
        options: {
          topBar: {
            title: {
              text: 'ChainX历史记录'
            }
          }
        }
      }
    })
  }

  render() {
    const { ticker, walletBalance, activeWallet, activeAsset, intl, transactions, getTransactions, statusBarHeight, assetBalance, loadingMore, canLoadMore, currency } = this.props
    const balance = activeAsset.contract ? assetBalance : walletBalance
    const transactionCount = transactions && transactions.length
    const precision = balance.precision
    const symbol = balance.symbol
    const hasTransactions = !!transactions
    const loading = getTransactions.loading
    const refreshing = getTransactions.refreshing
    const emptyTransactions = !!transactions && transactions.length === 0
    const chain = activeWallet ? activeWallet.chain : ''

    let transactionCells = []

    if (transactionCount) {
      transactionCells = transactions.map((transaction: any, index: number) => (
        <Item
          reactModuleForCell="TransactionTableViewCell"
          height={60}
          key={transaction.id}
          id={transaction.id}
          change={intl.formatNumber(+transaction.change, { minimumFractionDigits: 0, maximumFractionDigits: precision })}
          date={transaction.timestamp && intl.formatDate(+transaction.timestamp, { year: 'numeric', month: 'numeric', day: 'numeric' })}
          time={transaction.timestamp && intl.formatTime(+transaction.timestamp, { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' })}
          transactionType={transaction.transactionType}
          targetAddress={transaction.targetAddress}
          failed={transaction.isError === '1'}
          pending={transaction.pending}
          symbol={symbol}
          componentId={this.props.componentId}
          showSeparator={true}
          onPress={this.toTransactionDetail.bind(this, transaction.id, transaction.pending, transaction.isError === '1')}
        />
      ))
    }

    if (canLoadMore) {
      transactionCells.push(
        <Item key="loadMore" reactModuleForCell="LoadMoreTableViewCell" selectionStyle={TableView.Consts.CellSelectionStyle.None} onPress={!loadingMore ? this.loadMore : () => {}} loadingMore={loadingMore} height={60} />
      )
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#F7F7F7', height: 136 }}>
          <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 16, paddingLeft: 16 }}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '60%' }}>
              <Text style={{ fontSize: 26, fontWeight: '500' }}>{balance && intl.formatNumber(balance.balance, { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })}</Text>
              {!assetBalance && <Text style={{ fontSize: 20, color: '#007AFF', marginTop: 4 }}>≈ {currency.sign}{(ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</Text>}
              {!!assetBalance && <Text style={{ fontSize: 20, color: '#007AFF', marginTop: 4 }}>≈ {currency.sign}{(ticker && ticker[`${activeWallet.chain}/${assetBalance.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${assetBalance.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</Text>}
            </View>
            {(!activeAsset || !activeAsset.contract) && !!chain && <FastImage source={assetIcons[chain.toLowerCase()]} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />}
            {(!!activeAsset && !!activeAsset.contract) && <View style={{ width: 60, height: 60, borderWidth: 0, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', borderRadius: 30 }}>
              <View style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
                <Text style={{ fontWeight: '500', fontSize: 28, color: 'white', paddingLeft: 1.6 }}>{activeAsset.symbol.slice(0, 1)}</Text>
              </View>
              <FastImage
                source={{ uri: activeAsset.icon_url }}
                style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: activeAsset.icon_url ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </View>}
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
                  <Text style={{ color: 'white', fontSize: 17 }}>{intl.formatMessage({ id: 'transfer_button_send' })}</Text>
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
                  <Text style={{ color: 'white', fontSize: 17 }}>{intl.formatMessage({ id: 'transfer_button_receive' })}</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
        </View>
        {chain === 'CHAINX' && (<View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{fontSize: 18, color: '#007AFF' }} onPress={this.toChainXHistory}>ChainX的更多记录请点击这里...</Text>
        </View>)}
        {chain !== 'CHAINX' && (
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
            {transactionCount && <Section>{transactionCells}</Section>}
          </TableView>
        )}
      </SafeAreaView>
    )
  }
}
