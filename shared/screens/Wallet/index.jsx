import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import FastImage from 'react-native-fast-image'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionActions from 'actions/version'
import * as currencyActions from 'actions/currency'
import * as eosAccountActions from 'actions/eosAccount'
import { selectedEOSTokenBalanceSelector, eosTotalAssetBalanceSelector } from 'selectors/balance'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import { eosPriceSelector } from 'selectors/ticker'
import { eosAccountSelector } from 'selectors/eosAccount'
import styles from './styles'

const dataProvider = new DataProvider((r1, r2) => r1 !== r2)

@connect(
  state => ({
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state),
    eosAssetBalance: selectedEOSTokenBalanceSelector(state),
    eosTotalAssetBalance: eosTotalAssetBalanceSelector(state),
    eosPrice: eosPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...tickerActions,
      ...balanceActions,
      ...versionActions,
      ...currencyActions,
      ...eosAccountActions,
      ...walletActions
    }, dispatch)
  })
)

export default class Wallet extends Component {
  static get options() {
    return {
      topBar: {
        // noBorder: true,
        drawBehind: true,
        title: {
          text: '钱包'
        },
        largeTitle: {
          visible: true,
          fontSize: 30,
          fontFamily: 'SFNSDisplay'
        }
      }
    }
  }

  state = {
    dataProvider: dataProvider.cloneWithRows([
      {
        title: 1
      },
      {
        title: 2
      },
      {
        title: 3
      },
      {
        title: 4
      },
      {
        title: 5
      },
      {
        title: 6
      },
      {
        title: 7
      }
    ])
  }

  subscription = Navigation.events().bindComponent(this)

  componentDidMount() {
    this.props.actions.syncWalletRequested()
  }

  componentDidAppear() {
  }

  _renderItem ({ item, index }) {
    const imageList = [require('resources/images/BTCCard.png'), require('resources/images/ETHCard.png'), require('resources/images/BTCCard.png')]
    return (
      <View style={styles.slideContainer}>
        <View style={styles.slide}>
          <FastImage
            source={imageList[index]}
            style={styles.slideBackground}
          />
          <Text style={styles.slideText}>{item.title}</Text>
        </View>
      </View>
    )
  }

  addAssets = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WalletAssets',
        /* options: {
         *   customTransition: {
         *     animations: [
         *       { type: 'sharedElement', fromId: 'image1', toId: 'image2', startDelay: 0, springVelocity: 0.2, duration: 0.5 }
         *     ],
         *     duration: 0.8
         *   }
         * }*/
      }
    })
  }

  recyclerListViewRef = React.createRef()

  layoutProvider = new LayoutProvider(
    index => index % 1,
    (type, dim) => {
      dim.width = Dimensions.get('window').width - 24
      dim.height = 190
    }
  )

  rowRenderer = (type, item) => {
    const imageList = [require('resources/images/BTCCard.png'), require('resources/images/ETHCard.png'), require('resources/images/BTCCard.png')]

    return (
      <View style={styles.slideContainer}>
        <View style={styles.slide}>
          <FastImage
            source={imageList[0]}
            style={styles.slideBackground}
          />
          <Text style={styles.slideText}>{item.title}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.swiperContainer}>
          <RecyclerListView
            isHorizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.swiper}
            ref={this.recyclerListViewRef}
            layoutProvider={this.layoutProvider}
            dataProvider={this.state.dataProvider}
            rowRenderer={this.rowRenderer}
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={this.addAssets}>
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={this.addAssets}>
            <Text style={styles.actionButtonText}>Received</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
