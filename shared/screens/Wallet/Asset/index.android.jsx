import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableNativeFeedback, RefreshControl, Dimensions } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'react-native-navigation'
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
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import chainxAccount from '@chainx/account'
import styles from './styles'

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)

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
        noBorder: true,
        elevation: 0,
        /* rightButtons: [
         *   {
         *     id: 'qrcode',
         *     icon: require('resources/images/qrcode_android.png')
         *   }
         * ]*/
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  layoutProvider = new LayoutProvider(
    index => {
      if (index === 0) {
        return 0
      } else {
        return 1
      }
    },
    (type, dim) => {
      switch (type) {
        case 0:
          dim.width = Dimensions.get('window').width
          dim.height = 48
          break
        default:
          dim.width = Dimensions.get('window').width
          dim.height = 60
      }
    }
  )

  state = {
    dataProvider: dataProvider.cloneWithRows([]),
    refreshing: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { walletBalance, activeAsset, intl, transactions, assetBalance, loadingMore, canLoadMore } = nextProps
    const balance = activeAsset.contract ? assetBalance : walletBalance
    const transactionCount = transactions && transactions.length
    const precision = balance.precision
    const symbol = balance.symbol

    let transactionCells = []

    if (transactionCount) {
      transactionCells = transactions.map((transaction: any, index: number) => ({
        key: transaction.id,
        id: transaction.id,
        change: intl.formatNumber(+transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision }),
        date: transaction.timestamp && intl.formatDate(+transaction.timestamp, { year: 'numeric', month: 'numeric', day: 'numeric' }),
        time: transaction.timestamp && intl.formatTime(+transaction.timestamp, { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' }),
        transactionType: transaction.transactionType,
        targetAddress: transaction.targetAddress,
        failed: transaction.isError === '1',
        pending: transaction.pending,
        symbol: symbol
      }))
    }

    /* if (canLoadMore) {
     *   transactionCells.push({
     *     key: 'loadMore'
     *   })
     * }*/

    return { dataProvider: dataProvider.cloneWithRows([{ title: '交易记录' }, ...transactionCells]) }
  }

  toTransferAsset = () => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.TransferAsset',
     *         options: {
     *           topBar: {
     *             title: {
     *               text: `发送${this.props.activeAsset.symbol}到`
     *             },
     *             leftButtons: [
     *               {
     *                 id: 'cancel',
     *                 text: '取消'
     *               }
     *             ]
     *           }
     *         }
     *       }
     *     }]
     *   }
     * })*/
  }

  toReceiveAsset = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.ReceiveAsset',
     *     options: {
     *       topBar: {
     *         title: {
     *           text: `接收 ${this.props.activeAsset.symbol}`
     *         },
     *         noBorder: this.props.activeWallet.chain === 'BITCOIN' && this.props.childAddress && this.props.activeWallet.address !== this.props.childAddress
     *       }
     *     }
     *   }
     * })*/
  }

  componentDidAppear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'qrcode',
            icon: require('resources/images/qrcode_android.png')
          }
        ]
      }
    })
  }

  componentDidDisappear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: []
      }
    })
  }

  componentDidMount() {
    this.props.actions.setActiveWallet(this.props.activeWallet.id)
    const { activeAsset, activeWallet, chain } = this.props

    if (activeAsset && activeAsset.contract) {
      if (activeWallet.chain === 'EOS') {
        this.props.actions.getEOSTokenBalance.requested({ ...activeWallet, contract: activeAsset.contract, assetSymbol: activeAsset.symbol })
      } else if (activeWallet.chain === 'ETHEREUM') {
        this.props.actions.getETHTokenBalance.requested({ ...activeWallet, contract: activeAsset.contract, assetSymbol: activeAsset.symbol })
      }
    } else {
      this.props.actions.getBalance.requested(activeWallet)
    }

    const contract = activeAsset.contract
    const assetSymbol = activeAsset.symbol
    this.props.actions.getTransactions.requested({ ...this.props.activeWallet, contract, assetSymbol })
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
    this.props.actions.getTransactions.requested({ ...this.props.activeWallet, contract, assetSymbol })
  }

  loadMore = () => {
    const { activeWallet, activeAsset } = this.props
    const contract = activeAsset.contract
    const assetSymbol = activeAsset.symbol
    this.props.actions.getTransactions.requested({ ...this.props.activeWallet, contract, assetSymbol, loadMore: true })
  }

  formatAddress = (address, splitLength) => {
    const sl = splitLength || 20
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

  renderItem = (type, data) => {
    if (!type) return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
        <Text style={{ color: 'rgba(0,0,0,0.87)', fontSize: 15 }}>{data.title}</Text>
      </View>
    )

    return (
      <TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)} useForeground={true}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 17, marginBottom: 4, color: 'black' }}>{this.formatAddress(data.targetAddress)}</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {data.transactionType === 'send' && !data.failed && <FastImage source={require('resources/images/sent.png')} style={{ width: 20, height: 20 }} />}
                {data.transactionType === 'receive' && !data.failed && <FastImage source={require('resources/images/received.png')} style={{ width: 20, height: 20 }} />}
                {!!data.failed && <FastImage source={require('resources/images/error_android.png')} style={{ width: 20, height: 20, marginRight: 2 }} />}
                {data.transactionType === 'send' && !data.failed && !data.pending && <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)', lineHeight: 20 }}>发送</Text>}
                {data.transactionType === 'receive' && !data.failed && !data.pending && <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)', lineHeight: 20 }}>接收</Text>}
                {!!data.failed && <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)', lineHeight: 20 }}>转账失败</Text>}
                {!!data.pending && <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)', lineHeight: 20 }}>转账中...</Text>}
                {!data.pending && <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)', lineHeight: 20 }}> {data.date} {data.time}</Text>}
              </View>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end', height: 44 }}>
            {data.transactionType === 'send' && <Text style={{ fontSize: 17, color: 'black' }}>{data.change}</Text>}
            {data.transactionType === 'receive' && <Text style={{ fontSize: 17, color: '#4CD964' }}>+{data.change}</Text>}
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { ticker, walletBalance, activeWallet, activeAsset, intl, transactions, getTransactions, assetBalance, loadingMore, canLoadMore, currency } = this.props
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
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#673AB7', paddingTop: 0, paddingBottom: 20, elevation: 4 }}>
          <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', paddingRight: 16, paddingLeft: 16 }}>
            {(!activeAsset || !activeAsset.contract) && !!chain &&
             <View style={{ width: 56, height: 56, backgroundColor: 'white', borderRadius: 28 }}>
               <FastImage source={assetIcons[chain.toLowerCase()]} style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'white' }} />
             </View>
            }
            {(!!activeAsset && !!activeAsset.contract) && <View style={{ width: 56, height: 56, backgroundColor: 'white', borderRadius: 28 }}>
              <View style={{ position: 'absolute', top: 0, left: 0, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
                <Text style={{ fontWeight: '500', fontSize: 28, color: 'white', paddingLeft: 1.6 }}>{activeAsset.symbol.slice(0, 1)}</Text>
              </View>
              <FastImage
                source={{ uri: activeAsset.icon_url }}
                style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: activeAsset.icon_url ? 'white' : 'rgba(0,0,0,0)' }}
              />
            </View>}
        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{balance && intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })}</Text>
          {!assetBalance && <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>≈ {currency.sign}{(ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</Text>}
          {!!assetBalance && <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>≈ {currency.sign}{(ticker && ticker[`${activeWallet.chain}/${assetBalance.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${assetBalance.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</Text>}
          {/* <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{this.formatAddress(activeWallet.address)}</Text> */}
        </View>
          </View>
        </View>
        <TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.3)', true)} useForeground={true}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 48, right: 16, backgroundColor: '#FF5722', elevation: 10, zIndex: 1 }}>
            <FastImage
              source={require('resources/images/send_android.png')}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableNativeFeedback>
        {chain !== 'CHAINX' && <RecyclerListView
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={60 * 10}
          scrollViewProps={{ refreshControl: <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} /> }}
        />}
      </View>
    )
  }
}
