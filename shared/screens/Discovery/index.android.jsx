import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import { Navigation } from 'components/Navigation'
import { Alert, View, Text, Dimensions, Image, FlatList, ScrollView, TouchableNativeFeedback } from 'react-native'
import * as dappActions from 'actions/dapp'
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
import { activeWalletSelector } from 'selectors/wallet'
import FastImage from 'react-native-fast-image'
import { injectIntl } from "react-intl";

@injectIntl
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
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...dappActions
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

  toDapp = (data) => {
    const { url, id, display_name } = data
    const inject = loadScatterSync()
    // const inject = loadMetaMaskSync()

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: { url, inject, id },
            options: {
              topBar: {
                title: {
                  text: display_name.zh
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
	<Text>Hello BitPortal-client</Text>
      </View>
    )
  }
}
