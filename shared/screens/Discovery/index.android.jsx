import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import { Navigation } from 'components/Navigation'
import { Alert, View, Text, Dimensions, Image, FlatList, ScrollView, TouchableNativeFeedback } from 'react-native'
import * as dappActions from 'actions/dapp'
import * as walletActions from 'actions/wallet'
import * as uiActions from 'actions/ui'
import {
  dappSelector,
  newDappSelector,
  hotDappSelector,
  gameDappSelector,
  toolDappSelector,
  dappRecommendSelector,
  dappBookmarkSelector
} from 'selectors/dapp'
import ViewPager from '@react-native-community/viewpager'
import { loadScatter, loadScatterSync, loadMetaMask, loadMetaMaskSync } from 'utils/inject'
import LinearGradient from 'react-native-linear-gradient'
import { activeWalletSelector, bridgeWalletSelector, identityWalletSelector, importedWalletSelector } from 'selectors/wallet'
import FastImage from 'react-native-fast-image'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import { transfromUrlText } from 'utils'
import SearchBar from 'components/Form/SearchBar'
import Modal from 'react-native-modal'
import urlParse from 'url-parse'

const dataProvider = new DataProvider((r1, r2) => r1.name !== r2.name || r1.price_usd !== r2.price_usd || r1.percent_change_24h !== r2.percent_change_24h)

@connect(
  state => ({
    dapp: dappSelector(state),
    newDapp: newDappSelector(state),
    hotDapp: hotDappSelector(state),
    gameDapp: gameDappSelector(state),
    toolDapp: toolDappSelector(state),
    featured: dappRecommendSelector(state),
    bookmarked: dappBookmarkSelector(state),
    wallet: activeWalletSelector(state),
    bridgeWallet: bridgeWalletSelector(state),
    identityWallet: identityWalletSelector(state),
    importedWallet: importedWalletSelector(state),
    ui: state.ui
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...dappActions,
      ...walletActions,
      ...uiActions
    }, dispatch)
  })
)

export default class Discovery extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('应用')
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        rightImage: require('resources/images/ETHWallet.png')
      }
    }
  }

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 48
    }
  )

  state = {
    dataProvider: dataProvider.cloneWithRows([
      { title: 'MakerDAO', url: 'https://cdp.makerdao.com', chain: 'ETHEREUM' },
      { title: '0x Protocol', url: 'https://0x.org/portal/account', chain: 'ETHEREUM' },
      { title: 'KyberSwap', url: 'https://kyberswap.com/swap/eth_knc', chain: 'ETHEREUM' },
      { title: 'KyberSwap', url: 'https://kyberswap.com/swap/eth_knc', chain: 'ETHEREUM' },
      { title: 'Crypto Kitties', url: 'http://www.cryptokitties.co', chain: 'ETHEREUM' },
      { title: 'PRA Candy Box', url: 'https://chain.pro/candybox', chain: 'EOS' },
      { title: 'Newdex', url: 'https://newdex.340wan.com', chain: 'EOS' },
      { title: 'WhaleEx', url: 'https://w.whaleex.com.cn/wallet', chain: 'EOS' },
      { title: 'EOSX', url: 'https://www.myeoskit.com', chain: 'EOS' }
    ]),
    searchUrl: ''
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toDappList') {
      const { categoryTitle, category } = data

      this.toDappList(categoryTitle, category)
    } else if (action === 'toDapp') {
      const { url, title, id } = data
      const { wallet } = this.props
      if (!wallet) {
        Alert.alert(
          t(this,'暂无EOS钱包'),
          '',
          [
            { text: t(this,'确定'), onPress: () => {} }
          ]
        )
      }
      /* else if (wallet.chain !== 'EOS') {
       *   Alert.alert(
       *     '请切换到EOS钱包',
       *     '',
       *     [
       *       { text: '确定', onPress: () => {} }
       *     ]
       *   )
       * }*/
      else {
        // const inject = loadScatterSync()
        const inject = loadMetaMaskSync()

        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.WebView',
            passProps: { url, inject, id },
            options: {
              topBar: {
                title: {
                  text: title
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    icon: require('resources/images/cancel_android.png')
                  }
                ]
              }
            }
          }
        })
      }
    }
  }

  onCollectionViewDidSelectItem = (data) => {
    const { url, title, uid } = data

    if (title) {
      const inject = loadScatterSync()
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.WebView',
          passProps: { url, inject, id: uid },
          options: {
            topBar: {
              title: {
                text: title
              }
            }
          }
        }
      })
    }
  }

  toDappList = (title, category) => {
    this.props.actions.setDappFilter(category)
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList',
        options: {
          topBar: {
            title: {
              text: title
            }
          }
        }
      }
    })
  }

  async componentDidMount() {
    this.props.actions.getDapp.requested()
    this.props.actions.getDappRecommend.requested()
    await loadScatter()
    await loadMetaMask()
  }

  componentDidAppear() {
    this.props.actions.getDapp.requested()
    this.props.actions.getDappRecommend.requested()
  }

  rowRenderer = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.toDapp.bind(this, { title: data.title, id: data.title, url: data.url, chain: data.chain })} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ color: '#673AB7' }}>{data.title}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  selectWallet = (chain) => {
    const selectedIdentityWallet = this.props.identityWallet.filter(wallet => wallet.address && wallet.chain === chain)
    const selectedImportedWallet = this.props.importedWallet.filter(wallet => wallet.address && wallet.chain === chain)
    return selectedIdentityWallet[0] || selectedImportedWallet[0]
  }

  toDapp = (data) => {
    const { url, id, title, chain } = data

    if (!this.props.bridgeWallet || this.props.bridgeWallet.chain !== chain) {
      const selectedWallet = this.selectWallet(chain)

      if (selectedWallet) {
        this.props.actions.setBridgeWallet(selectedWallet.id)
        this.props.actions.setBridgeChain(selectedWallet.chain)
      }
    }

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebViewBridge',
            passProps: { url, id, chain },
            options: {
              topBar: {
                title: {
                  text: title
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    icon: require('resources/images/cancel_android.png')
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  parseUrlTitle = (data) => {
    try {
      if (data) {
        const url = urlParse(data)
        console.log('onSubmit url', url)
        const hostname = url.hostname
        return hostname.indexOf('www.') === 0 ? hostname.slice(4) : hostname
      }
    } catch(error) {
      return null
    }

    return null
  }

  onSubmit = (event) => {
    event.persist()
    const text = event.nativeEvent.text
    const url = transfromUrlText(text)
    const title = this.parseUrlTitle(url)

    this.onBackPress()

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebViewBridge',
            passProps: { url, title },
            options: {
              topBar: {
                title: {
                  text: title
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    icon: require('resources/images/cancel_android.png')
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableNativeFeedback onPress={this.toDapp.bind(this, item)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
        <View style={{ marginRight: 8, marginLeft: !index ? 16 : 0, width: (Dimensions.get('window').width - 48) / 3, marginVertical: 4, elevation: 2, backgroundColor: 'white', overflow: 'hidden', borderRadius: 4 }}>
          <FastImage
            source={{ uri: item.icon_url }}
            style={{ width: (Dimensions.get('window').width - 48) / 3, height: (Dimensions.get('window').width - 48) / 3 }}
            resizeMethod="resize"
            resizeMode="cover"
          />
          <View style={{ width: '100%', height: 52, justifyContent: 'center', paddingHorizontal: 8 }}>
            <Text style={{ width: '100%', fontSize: 12, color: 'rgba(0,0,0,0.87)', lineHeight: 16 }} numberOfLines={2} ellipsizeMode="tail">
              {item.display_name.zh} - {item.description.zh}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  onBackPress = () => {
    this.setState({ searchUrl: '' })
    this.props.actions.hideSearchBar()
  }

  searchBarUpdated = ({ text }) => {
    this.setState({ searchUrl: text })
  }

  searchBarCleared = () => {
    this.setState({ searchUrl: '' })
  }

  render() {
    const { ui } = this.props

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
            <SearchBar
              onBackPress={this.onBackPress}
              searchBarUpdated={this.searchBarUpdated}
              searchBarCleared={this.searchBarCleared}
              placeholder="输入Dapp Url"
              onSubmit={this.onSubmit}
            />
          </View>
        </Modal>
        <View style={{ paddingLeft: 16, width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 15, fontWeight: '500' }}>热门应用</Text>
        </View>
        <RecyclerListView
          style={{ flex: 1, backgroundColor: 'white' }}
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.rowRenderer}
        />
      </View>
    )
  }
}
