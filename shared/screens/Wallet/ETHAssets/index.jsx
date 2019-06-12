import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as assetActions from 'actions/asset'
// import FastImage from 'react-native-fast-image'
import { assetSelector, selectedAssetIdsSelector } from 'selectors/asset'
import { activeWalletSelector } from 'selectors/wallet'
import styles from './styles'

@connect(
  state => ({
    ethAsset: assetSelector(state),
    activeWallet: activeWalletSelector(state),
    selectedAssetId: selectedAssetIdsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...assetActions
    }, dispatch)
  })
)

export default class ETHAssets extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '添加ETH资产'
        },
      },
      bottomTabs: {
        visible: false,
        drawBehind: true,
        animate: true
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { searching: false }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searching: isFocused })

  }

  onRefresh = () => {

  }

  onSwitchAccessoryChanged = (data) => {
    /* const { account, symbol, current_supply, max_supply, icon_url, rank_url } = data
     * this.props.actions.toggleEOSAssetForStorage({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
     * this.pendingAssetQueue.push({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })*/
  }

  componentDidAppear() {
    // this.props.actions.getEOSAssetRequested()
    /* Navigation.mergeOptions(this.props.componentId, {
     *   topBar: {
     *     searchBar: true,
     *     searchBarHiddenWhenScrolling: true,
     *     searchBarPlaceholder: 'Search'
     *   }
     * })*/
  }

  componentWillUnmount() {
    /* if (this.pendingAssetQueue.length) {
     *   this.props.actions.toggleEOSAssetList(this.pendingAssetQueue)
     *   this.pendingAssetQueue = []
     * }*/
  }

  componentDidMount() {
    this.props.actions.getETHAsset.requested()
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'add') {
      const { account, symbol } = data

      const chain = this.props.activeWallet.chain
      const address = this.props.activeWallet.address
      const walletId = `${chain}/${address}`
      const assetId = `${chain}/${account}/${symbol}`
      this.props.actions.selectAsset({ walletId, assetId })
    } else if (action === 'remove') {
      const { account, symbol } = data

      const chain = this.props.activeWallet.chain
      const address = this.props.activeWallet.address
      const walletId = `${chain}/${address}`
      const assetId = `${chain}/${account}/${symbol}`
      this.props.actions.unselectAsset({ walletId, assetId })
    }
  }

  render() {
    const { ethAsset, selectedAssetId } = this.props

    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          canRefresh={false && !this.state.searching}
          refreshing={false}
          onRefresh={this.onRefresh}
          detailTextColor="#666666"
          cellSeparatorInset={{ left: 66 }}
          onItemNotification={this.onItemNotification}
        >
          <TableView.Section>
            {ethAsset.map(item => (
               <TableView.Item
                 key={item.id}
                 height={60}
                 reactModuleForCell="AssetTableViewCell"
                 selectionStyle={TableView.Consts.CellSelectionStyle.None}
                 icon_url={item.icon_url}
                 symbol={item.symbol}
                 account={item.address}
                 current_supply={item.current_supply}
                 max_supply={item.max_supply}
                 rank_url={item.rank_url}
                 selected={selectedAssetId && selectedAssetId.indexOf(`${item.chain}/${item.contract}/${item.symbol}`) !== -1}
               />
             ))}
          </TableView.Section>
        </TableView>
      </View>
    )
  }
}
