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
// import chainxAccount from '@chainx/account'
import { DarkModeContext } from 'utils/darkMode'
import styles from './styles'
import { rioTokenIcons } from '../../../resources/images'
import {RioChainURL} from 'core/chain/polkadot'
const { StatusBarManager } = NativeModules
const { Section, Item } = TableView

const chainxAccount = {}

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
  static contextType = DarkModeContext

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
                  text: t(this,'send_token_symbol',{symbol:this.props.activeAsset.symbol})
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: t(this,'button_cancel')
                  }
                ]
              }
            }
          }
        }]
      }
    })
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
              text: `${t(this,'receive')} ${this.props.activeAsset.symbol}`
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

    let statusText = t(this,'tx_suscess')
    if (pending) statusText = t(this,'tx_transfering')
    if (failed) statusText = t(this,'tx_failed')

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
              text: t(this,'tx_history_symbol',{symbol:'ChainX'})
            }
          }
        }
      }
    })
  }

  toRioChainHistory = () => {
    const address = this.props.activeWallet.address
    const url = RioChainURL.rio_scan_url +`/rio/account/${address}`
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WebView',
        passProps: {
          url: url
        },
        options: {
          topBar: {
            title: {
              text: t(this,'tx_history_symbol',{symbol:'RioChain'})
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
    const symbol = balance.symbol || ''
    const hasTransactions = !!transactions
    const loading = getTransactions.loading
    const refreshing = getTransactions.refreshing
    const emptyTransactions = !!transactions && transactions.length === 0
    const chain = activeWallet ? activeWallet.chain : ''

    let icon 
    if (chain === 'POLKADOT') {
      icon = rioTokenIcons[symbol.toLowerCase()]
    }

    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

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
          isDarkMode={isDarkMode}
          onPress={this.toTransactionDetail.bind(this, transaction.id, transaction.pending, transaction.isError === '1')}
        />
      ))
    }

    if (canLoadMore) {
      transactionCells.push(
        <Item key="loadMore" reactModuleForCell="LoadMoreTableViewCell" selectionStyle={TableView.Consts.CellSelectionStyle.None} onPress={!loadingMore ? this.loadMore : () => {}} loadingMore={loadingMore} height={60} isDarkMode={isDarkMode} />
      )
    }

    const symbolBalance = (ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
    const cuySymbolBalance = (ticker && ticker[`${activeWallet.chain}/${assetBalance.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${assetBalance.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
    const syFontSzie = symbolBalance.toString().length > 10 ? 20 : 26
    const cyFontSzie = cuySymbolBalance.toString().length > 10 ? 16 : 20

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : '#FFFFFF' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: isDarkMode ? 'black' : '#FFFFFF', height: 136 }}>
          <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', paddingRight: 16, paddingLeft: 16 ,}}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '80%'}}>
              <Text style={{ fontSize: syFontSzie, fontWeight: '500', color: isDarkMode ? 'white' : 'black' }}>{balance && intl.formatNumber(balance.balance, { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })}</Text>
              {!assetBalance && <Text style={{ color: '#007AFF', marginTop: 4 }}>≈ {currency.sign}{symbolBalance}</Text>}
              {!!assetBalance && <Text style={{ fontSize: cyFontSzie, color: '#007AFF', marginTop: 4 }}>≈ {currency.sign}{cuySymbolBalance}</Text>}
            </View>
            {(!activeAsset || !activeAsset.contract) && !!chain && <FastImage source={assetIcons[chain.toLowerCase()]} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />}
            {(!!activeAsset && !!activeAsset.contract) && <View style={{ width: 60, height: 60, borderWidth: 0, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', borderRadius: 30 }}>
              <View style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
                <Text style={{ fontWeight: '500', fontSize: 28, color: 'white', paddingLeft: 1.6 }}>{activeAsset.symbol && activeAsset.symbol.length ? activeAsset.symbol.slice(0, 1): ''}</Text>
              </View>
              <FastImage
                source={icon ? icon : { uri: activeAsset.icon_url }}
                style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: activeAsset.icon_url || icon ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
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
          <Text style={{fontSize: 18, color: '#007AFF' }} onPress={this.toChainXHistory}>{t(this,'tx_history_more_symbol',{symbol:'ChainX'})}</Text>
        </View>)}
        {chain === 'POLKADOT' && (<View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{fontSize: 18, color: '#007AFF' }} onPress={this.toRioChainHistory}>{t(this,'tx_history_more_symbol',{symbol:'RioChain'})}</Text>
        </View>)}
        {chain !== 'CHAINX' && chain !== 'POLKADOT' && (
          <TableView
            style={{ flex: 1 }}
            tableViewCellStyle={TableView.Consts.CellStyle.Default}
            detailTextColor="#666666"
            headerBackgroundColor="white"
            headerTextColor={isDarkMode ? 'white' : 'black'}
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
                title={emptyTransactions ? t(this,'tx_no_history') : t(this,'tx_history')}
                loading={(!refreshing && loading) && (!hasTransactions || emptyTransactions)}
                loadingTitle={t(this,'tx_fetch_history')}
                height={48}
                componentId={this.props.componentId}
                isDarkMode={isDarkMode}
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
