import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import Modal from 'react-native-modal'
import * as assetActions from 'actions/asset'
// import FastImage from 'react-native-fast-image'
import { selectedAssetIdsSelector, assetsSelector } from 'selectors/asset'
import { activeWalletSelector, activeChainSelector } from 'selectors/wallet'
import styles from './styles'

@connect(
  state => ({
    getETHAsset: state.getETHAsset,
    getEOSAsset: state.getEOSAsset,
    chain: activeChainSelector(state),
    assets: assetsSelector(state),
    activeWallet: activeWalletSelector(state),
    selectedAssetId: selectedAssetIdsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...assetActions
    }, dispatch)
  })
)

export default class AddAssets extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false,
        drawBehind: true,
        animate: true
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    searching: false,
    switching: false,
    showModal: false,
    showModalContent: false,
    selecting: false,
    unselecting: false,
    assetsCount: 0,
    getETHAssetLoading: false,
    getETHAssetError: false,
    getEOSAssetLoaded: false,
    getEOSAssetLoading: false,
    getEOSAssetError: false,
    getETHAssetLoaded: false,
    firstAppeared: false
  }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.getEOSAsset.loading !== prevState.getEOSAssetLoading
      || nextProps.getEOSAsset.error !== prevState.getEOSAssetError
      || nextProps.getETHAsset.loading !== prevState.getETHAssetLoading
      || nextProps.getETHAsset.error !== prevState.getETHAssetError
      || (nextProps.assets && nextProps.assets.length) !== prevState.assetsCount
    ) {
      return {
        getEOSAssetLoading: nextProps.getEOSAsset.loading,
        getEOSAssetLoaded: nextProps.getEOSAsset.loaded,
        getEOSAssetError: nextProps.getEOSAsset.error,
        getETHAssetLoading: nextProps.getETHAsset.loading,
        getETHAssetLoaded: nextProps.getETHAsset.loaded,
        getETHAssetError: nextProps.getETHAsset.error,
        assetsCount: (nextProps.assets && nextProps.assets.length)
      }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.getEOSAssetLoaded !== this.state.getEOSAssetLoaded
      || prevState.getETHAssetLoaded !== this.state.getETHAssetLoaded
      || prevState.firstAppeared !== this.state.firstAppeared
    ) {
      if ((this.state.getEOSAssetLoaded && this.props.chain === 'EOS') || (this.state.getETHAssetLoaded && this.props.chain === 'ETHEREUM')) {
        setTimeout(() => {
          Navigation.mergeOptions(this.props.componentId, {
            topBar: {
              searchBar: true,
              searchBarHiddenWhenScrolling: true,
              searchBarPlaceholder: 'Search'
            }
          })
        })
      }
    }
  }

  searchBarUpdated({ text, isFocused }) {
    if (isFocused) {
      this.props.actions.handleAssetSearchTextChange(text)
    } else {
      this.props.actions.handleAssetSearchTextChange('')
    }

    if (this.tableViewRef) {
      this.tableViewRef.scrollToIndex({ index: 0, section: 0, animated: true })
    }
  }

  onRefresh = () => {

  }

  onSwitchAccessoryChanged = (data) => {
    /* const { account, symbol, current_supply, max_supply, icon_url, rank_url } = data
     * this.props.actions.toggleEOSAssetForStorage({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
     * this.pendingAssetQueue.push({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })*/
  }

  componentDidAppear() {
    this.setState({ firstAppeared: true })
  }

  componentWillUnmount() {
    /* if (this.pendingAssetQueue.length) {
     *   this.props.actions.toggleEOSAssetList(this.pendingAssetQueue)
     *   this.pendingAssetQueue = []
     * }*/
  }

  componentDidMount() {
    const { chain, assets } = this.props

    if (chain === 'ETHEREUM') {
      this.props.actions.getETHAsset.requested()
    } else if (chain === 'EOS') {
      this.props.actions.getEOSAsset.requested()
    }
  }

  onSwitchAccessoryChanged = (item) => {
    const { activeWallet, chain } = this.props
    const walletId = activeWallet.id
    const contract = item.contract
    const symbol = item.symbol
    const assetId = `${chain}/${contract}/${symbol}`

    if (item.switchOn) {
      this.props.actions.selectAsset({ walletId, assetId })

      this.setState({ showModal: true, showModalContent: true, selecting: true }, () => {
        setTimeout(() => {
          this.setState({ showModal: false, selecting: false }, () => {
            this.setState({ showModalContent: false })
          })
        }, 500)
      })
    } else {
      this.props.actions.unselectAsset({ walletId, assetId })

      this.setState({ showModal: true, showModalContent: true, unselecting: true }, () => {
        setTimeout(() => {
          this.setState({ showModal: false, unselecting: false }, () => {
            this.setState({ showModalContent: false })
          })
        }, 500)
      })
    }
  }

  render() {
    const { assets, selectedAssetId, getETHAsset, getEOSAsset, chain } = this.props

    if ((getEOSAsset.loading || getETHAsset.loading) && !assets.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 80 }}>
            <ActivityIndicator size="small" color="#666666" />
            <Text style={{ marginTop: 10, color: '#666666' }}>加载资产</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <TableView
          ref={(ref) => { this.tableViewRef = ref }}
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          canRefresh={false && !this.state.searching}
          refreshing={false}
          onRefresh={this.onRefresh}
          detailTextColor="#666666"
          cellSeparatorInset={{ left: 66 }}
          onSwitchAccessoryChanged={this.onSwitchAccessoryChanged}
          reactModuleForCell="AssetTableViewCell"
        >
          <TableView.Section>
            {assets.map(item => (
               <TableView.Item
                 key={item.id}
                 height={60}
                 selectionStyle={TableView.Consts.CellSelectionStyle.None}
                 icon_url={item.icon_url}
                 symbol={item.symbol}
                 contract={item.contract}
                 current_supply={item.current_supply}
                 max_supply={item.max_supply}
                 rank_url={item.rank_url}
                 accessoryType={5}
                 switchOn={selectedAssetId && selectedAssetId.indexOf(`${chain}/${item.contract}/${item.symbol}`) !== -1}
               />
             ))}
          </TableView.Section>
        </TableView>
        <Modal
          isVisible={this.state.showModal}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
        >
          {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14 }}>
              {this.state.selecting && <Text style={{ fontSize: 17, fontWeight: 'bold' }}>添加中...</Text>}
              {this.state.unselecting && <Text style={{ fontSize: 17, fontWeight: 'bold' }}>取消添加中...</Text>}
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
