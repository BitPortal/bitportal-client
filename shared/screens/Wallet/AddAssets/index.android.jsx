import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ActivityIndicator, ScrollView, TouchableNativeFeedback, Dimensions, Switch } from 'react-native'
import { Navigation } from 'components/Navigation'
import Modal from 'react-native-modal'
import * as assetActions from 'actions/asset'
import * as uiActions from 'actions/ui'
import FastImage from 'react-native-fast-image'
import { selectedAssetIdsSelector, assetsSelector, assetsSearchSelector } from 'selectors/asset'
import { activeWalletSelector, activeChainSelector } from 'selectors/wallet'
import IndicatorModal from 'components/Modal/IndicatorModal'
import Loading from 'components/Loading'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import SearchBar from 'components/Form/SearchBar'
import { injectIntl } from "react-intl";

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)
const searchDataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)

@injectIntl
@connect(
  state => ({
    ui: state.ui,
    getETHAsset: state.getETHAsset,
    getEOSAsset: state.getEOSAsset,
    getChainXAsset: state.getChainXAsset,
    chain: activeChainSelector(state),
    assets: assetsSelector(state),
    searchAssets: assetsSearchSelector(state),
    activeWallet: activeWalletSelector(state),
    selectedAssetId: selectedAssetIdsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...assetActions,
      ...uiActions
    }, dispatch)
  })
)

export default class AddAssets extends Component {
  static get options() {
    return {

    }
  }

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  subscription = Navigation.events().bindComponent(this)

  state = {
    searching: false,
    switching: false,
    showModal: false,
    showModalContent: false,
    selecting: false,
    unselecting: false,
    assetsCount: 0,
    searchAssetsCount: 0,
    getETHAssetLoading: false,
    getETHAssetError: false,
    getETHAssetLoaded: false,
    getEOSAssetLoaded: false,
    getEOSAssetLoading: false,
    getEOSAssetError: false,
    getChainXAssetLoaded: false,
    getChainXAssetLoading: false,
    getChainXAssetError: false,
    firstAppeared: false,
    dataProvider: dataProvider.cloneWithRows([]),
    searchDataProvider: searchDataProvider.cloneWithRows([]),
    extendedState: {
      selectedAssetId: []
    }
  }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  static getDerivedStateFromProps(nextProps, prevState) {
    const { assets, searchAssets, selectedAssetId } = nextProps
    let assetsCells = []

    if (assets) {
      assetsCells = assets.map(item => ({
        key: item.id,
        icon_url: item.icon_url,
        symbol: item.symbol,
        contract: item.contract,
        chain: item.chain
      }))
    }

    let searchAssetsCells = []

    if (searchAssets) {
      searchAssetsCells = searchAssets.map(item => ({
        key: item.id,
        icon_url: item.icon_url,
        symbol: item.symbol,
        contract: item.contract,
        chain: item.chain
      }))
    }

    if (
      nextProps.getEOSAsset.loading !== prevState.getEOSAssetLoading
      || nextProps.getEOSAsset.error !== prevState.getEOSAssetError
      || nextProps.getETHAsset.loading !== prevState.getETHAssetLoading
      || nextProps.getETHAsset.error !== prevState.getETHAssetError
      || nextProps.getChainXAsset.loading !== prevState.getChainXAssetLoading
      || nextProps.getChainXAsset.error !== prevState.getChainXAssetError
      || (nextProps.assets && nextProps.assets.length) !== prevState.assetsCount
      || (nextProps.searchAssets && nextProps.searchAssets.length) !== prevState.SearchAssetsCount
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
        assetsCount: (nextProps.assets && nextProps.assets.length),
        searchAssetsCount: (nextProps.searchAssets && nextProps.searchAssets.length),
        dataProvider: dataProvider.cloneWithRows(assetsCells),
        searchDataProvider: searchDataProvider.cloneWithRows(searchAssetsCells),
        extendedState: { selectedAssetId }
      }
    } else {
      return ({
        dataProvider: dataProvider.cloneWithRows(assetsCells),
        searchDataProvider: searchDataProvider.cloneWithRows(searchAssetsCells),
        extendedState: { selectedAssetId }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    /* if (
     *   prevState.getEOSAssetLoaded !== this.state.getEOSAssetLoaded
     *   || prevState.getETHAssetLoaded !== this.state.getETHAssetLoaded
     *   || prevState.getChainXAssetLoaded !== this.state.getChainXAssetLoaded
     *   || prevState.firstAppeared !== this.state.firstAppeared
     * ) {
     *   if ((this.state.getEOSAssetLoaded && this.props.chain === 'EOS') || (this.state.getETHAssetLoaded && this.props.chain === 'ETHEREUM') || (this.state.getChainXAssetLoaded && this.props.chain === 'CHAINX')) {
     *     setTimeout(() => {
     *       Navigation.mergeOptions(this.props.componentId, {
     *         topBar: {
     *           searchBar: true,
     *           searchBarHiddenWhenScrolling: true,
     *           searchBarPlaceholder: 'Search'
     *         }
     *       })
     *     })
     *   }
     * }*/
  }

  onRefresh = () => {

  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'search':
        this.toSearch()
        break
      default:
    }
  }

  toSearch = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        height: 64
      }
    })
    this.props.actions.showSearchBar()
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
      this.props.actions.getETHAsset.requested({ display_priority_gt: 0 })
    } else if (chain === 'EOS') {
      this.props.actions.getEOSAsset.requested()
    } else if (chain === 'CHAINX') {
      this.props.actions.getChainXAsset.requested()
    }
  }

  componentDidAppear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'search',
            icon: require('resources/images/search_android.png')
          }
        ]
      }
    })
  }

  componentDidDisappear() {
    this.onBackPress()

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: []
      }
    })
  }

  onSwitchAccessoryChanged = (item, switchOn) => {
    const { activeWallet, chain } = this.props
    const walletId = activeWallet.id
    const contract = item.contract
    const symbol = item.symbol
    const assetId = `${chain}/${contract}/${symbol}`

    if (switchOn) {
      this.props.actions.selectAsset({ walletId, assetId })

      this.setState({ showModal: true, selecting: true }, () => {
        setTimeout(() => {
          this.setState({ showModal: false, selecting: false })
        }, 500)
      })
    } else {
      this.props.actions.unselectAsset({ walletId, assetId })

      this.setState({ showModal: true, unselecting: true }, () => {
        setTimeout(() => {
          this.setState({ showModal: false, unselecting: false })
        }, 500)
      })
    }
  }

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  renderItem = (type, data) => {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 40, height: 40, marginRight: 10, borderWidth: 0, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', borderRadius: 20 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
              <Text style={{ fontWeight: '500', fontSize: 20, color: 'white', paddingLeft: 1.6 }}>{data.symbol.slice(0, 1)}</Text>
            </View>
            <FastImage
              source={{ uri: data.icon_url }}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: data.icon_url ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{data.symbol}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{t(this,'合约: {name}',{name:this.formatAddress(data.contract)})}</Text>
          </View>
        </View>
        <View style={{ position: 'absolute', right: 16 }}>
          <Switch
            value={this.state.extendedState.selectedAssetId && this.state.extendedState.selectedAssetId.indexOf(`${data.chain}/${data.contract}/${data.symbol}`) !== -1}
            onValueChange={this.onSwitchAccessoryChanged.bind(this, data, !(this.state.extendedState.selectedAssetId && this.state.extendedState.selectedAssetId.indexOf(`${data.chain}/${data.contract}/${data.symbol}`) !== -1))}
          />
        </View>
      </View>
    )
  }

  onBackPress = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        height: 56
      }
    })
    this.props.actions.handleAssetSearchTextChange({ text: '', chain: this.props.chain })
    this.props.actions.hideSearchBar()
  }

  searchBarCleared = () => {
    this.props.actions.handleAssetSearchTextChange({ text: '', chain: this.props.chain })
  }

  searchBarUpdated = (data) => {
    this.props.actions.handleAssetSearchTextChange({ text: data.text, chain: this.props.chain })
  }

  render() {
    const { assets, selectedAssetId, getETHAsset, getEOSAsset, getChainXAsset, chain, ui } = this.props

    if ((getEOSAsset.loading || getETHAsset.loading || getChainXAsset.loading) && !assets.length) {
      return (<Loading text={t(this,'加载资产')} />)
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Modal
          isVisible={ui.searchBarEnabled}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={100}
          backdropTransitionInTiming={100}
          animationOut="fadeOut"
          animationOutTiming={100}
          backdropTransitionOutTiming={100}
          style={{ margin: 0 }}
          onBackdropPress={this.onBackPress}
        >
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <SearchBar onBackPress={this.onBackPress} searchBarUpdated={this.searchBarUpdated} searchBarCleared={this.searchBarCleared} hasSearchResult={!!this.state.searchAssetsCount} />
            <View style={{ height: 60 * this.state.searchAssetsCount, width: '100%', paddingHorizontal: 8, maxHeight: (Dimensions.get('window').height - 16) }}>
              <View style={{ flex: 1, backgroundColor: 'white', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, overflow: 'hidden' }}>
                {!!this.state.searchAssetsCount && <RecyclerListView
                                                     style={{ backgroundColor: 'white', flex: 1 }}
                                                     layoutProvider={this.layoutProvider}
                                                     dataProvider={this.state.searchDataProvider}
                                                     rowRenderer={this.renderItem}
                                                     renderAheadOffset={60 * 10}
                                                     extendedState={this.state.extendedState}
                                                   />}
              </View>
            </View>
          </View>
        </Modal>
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={60 * 10}
          extendedState={this.state.extendedState}
        />
        {/* <IndicatorModal isVisible={this.state.showModal} message={this.state.selecting ? '添加中...' : '取消添加中...'} /> */}
      </View>
    )
  }
}
