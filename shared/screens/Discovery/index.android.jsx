import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import { Navigation } from 'react-native-navigation'
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
          text: '应用'
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
          '暂无EOS钱包',
          '',
          [
            { text: '确定', onPress: () => {} }
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
    const { dapp, newDapp, hotDapp, gameDapp, toolDapp, featured, bookmarked } = this.props

    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 206, width: '100%', justifyContent: 'flex-end' }}>
          <ViewPager
            style={{ height: 190, width: '100%', overflow: 'visible' }}
            pageMargin={16}
            ref={(ref) => { this.viewPager = ref }}
            onPageSelected={this.onPageSelected}
          >
            {featured.map(item =>
              <View key={item.id} style={{ backgroundColor: 'white', width: Dimensions.get('window').width - 32, height: 176, borderRadius: 4, elevation: 3, overflow: 'hidden' }}>
                <FastImage
                  source={{ uri: item.img_url }}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  resizeMethod="resize"
                  resizeMode="cover"
                />
                {/* <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.50)', 'rgba(0,0,0,0.75)']}
                    locations={[0, 0.3, 0.5, 0.75, 1]}
                    style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                    />
                    <View style={{ height: 51, width: Dimensions.get('window').width - 32, paddingHorizontal: 16, justifyContent: 'center', position: 'absolute', bottom: 16, left: 0 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item.title}</Text>
                    <Text style={{ fontSize: 24, color: 'rgba(255,255,255,1)' }}>{item.sub_title}</Text>
                    </View> */}
              </View>
             )}
          </ViewPager>
        </View>
        {bookmarked && !!bookmarked.length && <View style={{ height: 300 }}>
          <View style={{ height: 48 }}>
            <Text>我的收藏</Text>
            <Text>更多</Text>
          </View>
          <View style={{ height: 248, marginTop: 4 }}>

          </View>
        </View>}
        <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 + 48 }}>
          <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)', fontWeight: 'bold' }}>最新上架</Text>
            <Image
              source={require('resources/images/arrow_forward_android.png')}
              style={{
                width: 24,
                height: 24
              }}
            />
          </View>
          <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={newDapp}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </View>
        </View>
        <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 + 48 }}>
          <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)', fontWeight: 'bold' }}>热门应用</Text>
            <Image
              source={require('resources/images/arrow_forward_android.png')}
              style={{
                width: 24,
                height: 24
              }}
            />
          </View>
          <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={hotDapp}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </View>
        </View>
        <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 + 48 }}>
          <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)', fontWeight: 'bold' }}>游戏</Text>
            <Image
              source={require('resources/images/arrow_forward_android.png')}
              style={{
                width: 24,
                height: 24
              }}
            />
          </View>
          <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={gameDapp}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </View>
        </View>
        <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 + 48 }}>
          <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)', fontWeight: 'bold' }}>工具</Text>
            <Image
              source={require('resources/images/arrow_forward_android.png')}
              style={{
                width: 24,
                height: 24
              }}
            />
          </View>
          <View style={{ height: (Dimensions.get('window').width - 48) / 3 + 52 + 4 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={toolDapp}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </View>
        </View>
        <View>
          <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)', fontWeight: 'bold' }}>所有分类</Text>
          </View>
          <View style={{ }}>

          </View>
        </View>
      </ScrollView>
    )
  }
}
