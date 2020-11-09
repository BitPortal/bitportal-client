import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import Modal from 'react-native-modal'
import * as assetActions from 'actions/asset'
// import FastImage from 'react-native-fast-image'
import { selectedAssetIdsSelector, assetsWithSearchSelector } from 'selectors/asset'
import { activeWalletSelector, activeChainSelector } from 'selectors/wallet'
import { DarkModeContext } from 'utils/darkMode'
import styles from './styles'
import { injectIntl } from "react-intl";

@injectIntl
@connect(
  state => ({
    getETHAsset: state.getETHAsset,
    getEOSAsset: state.getEOSAsset,
    getChainXAsset: state.getChainXAsset,
    chain: activeChainSelector(state),
    assets: assetsWithSearchSelector(state),
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
      topBar: {
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: 'Search',
        hideOnScroll:true
      },
      bottomTabs: {
        visible: false,
        drawBehind: true,
        animate: true
      }
    }
  }
  static contextType = DarkModeContext
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
    getETHAssetLoaded: false,
    getEOSAssetLoaded: false,
    getEOSAssetLoading: false,
    getEOSAssetError: false,
    getChainXAssetLoaded: false,
    getChainXAssetLoading: false,
    getChainXAssetError: false,
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
      || nextProps.getChainXAsset.loading !== prevState.getChainXAssetLoading
      || nextProps.getChainXAsset.error !== prevState.getChainXAssetError
      || (nextProps.assets && nextProps.assets.length) !== prevState.assetsCount
    ) {
      return {
        getChainXAssetLoading: nextProps.getChainXAsset.loading,
        getChainXAssetLoaded: nextProps.getChainXAsset.loaded,
        getChainXAssetError: nextProps.getChainXAsset.error,
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

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     prevState.getEOSAssetLoaded !== this.state.getEOSAssetLoaded
  //     || prevState.getETHAssetLoaded !== this.state.getETHAssetLoaded
  //     || prevState.getChainXAssetLoaded !== this.state.getChainXAssetLoaded
  //     || prevState.firstAppeared !== this.state.firstAppeared
  //   ) {
  //     if ((this.state.getEOSAssetLoaded && this.props.chain === 'EOS') || (this.state.getETHAssetLoaded && this.props.chain === 'ETHEREUM') || (this.state.getChainXAssetLoaded && this.props.chain === 'CHAINX')) {
  //       setTimeout(() => {
  //         Navigation.mergeOptions(this.props.componentId, {
  //           topBar: {
  //             searchBar: true,
  //             searchBarHiddenWhenScrolling: true,
  //             searchBarPlaceholder: 'Search'
  //           }
  //         })
  //       })
  //     }
  //   }
  // }

  searchBarUpdated({ text, isFocused }) {
    if (isFocused) {
      this.props.actions.handleAssetSearchTextChange({ text, chain: this.props.chain })
    } else {
      this.props.actions.handleAssetSearchTextChange({ text: '', chain: this.props.chain })
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
    const { chain, assets} = this.props

    if (chain === 'ETHEREUM') {
      this.props.actions.getETHAsset.requested({ display_priority_gt: 0})
    } else if (chain === 'EOS') {
      this.props.actions.getEOSAsset.requested()
    } else if (chain === 'CHAINX') {
      this.props.actions.getChainXAsset.requested()
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
    const { assets, selectedAssetId, getETHAsset, getEOSAsset, getChainXAsset, chain } = this.props
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    if ((getEOSAsset.loading || getETHAsset.loading || getChainXAsset.loading) && !assets.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 80 }}>
            <ActivityIndicator size="small" color="#666666" />
            <Text style={{ marginTop: 10, color: '#666666' }}>text={t(this,'加载资产')}</Text>
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
                accessoryType={5}
                switchOn={selectedAssetId && selectedAssetId.indexOf(`${chain}/${item.contract}/${item.symbol}`) !== -1}
                isDarkMode={isDarkMode}
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
              {this.state.selecting && <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{t(this,'添加中...')}</Text>}
              {this.state.unselecting && <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{t(this,'取消添加中...')}</Text>}
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
