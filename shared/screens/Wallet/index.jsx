import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, Text, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import FastImage from 'react-native-fast-image'
import SplashScreen from 'react-native-splash-screen'
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
const { Section, Item, Cell, CollectionView, CollectionViewItem } = TableView
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
        title: {
          text: '钱包'
        },
        leftButtons: [
          {
            id: 'manage',
            text: '管理'
          }
        ],
        rightButtons: [
          {
            id: 'scanQrCode',
            icon: require('resources/images/scan.png')
          }
        ]
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

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'manage') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.WalletList'
            }
          }]
        }
      })
    }
  }

  componentDidMount() {
    this.props.actions.syncWalletRequested()
    SplashScreen.hide()
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
        name: 'BitPortal.WalletAssets'
      }
    })
  }

  vote = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Voting'
          },
          options: {
            topBar: {
              searchBar: true,
              searchBarHiddenWhenScrolling: false,
              searchBarPlaceholder: 'Search'
            }
          }
        }]
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
          <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FastImage
                source={require('resources/images/BTCLogo.png')}
                style={{ width: 40, height: 40, borderRadius: 4, marginRight: 10 }}
              />
              <View>
                <Text style={{ color: 'white', fontSize: 17 }}>BTC-Wallet</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 15, opacity: 0.9, marginRight: 6 }}>terencegehui</Text>
                  <FastImage
                    source={require('resources/images/copy.png')}
                    style={{ width: 13, height: 10.5, marginTop: 3 }}
                  />
                </View>
              </View>
            </View>
            <FastImage
              source={require('resources/images/circle_more.png')}
              style={{ width: 28, height: 28, borderRadius: 4 }}
            />
          </View>
          <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ color: 'white', fontSize: 28 }}>$1,900.00</Text>
            <Text style={{ color: 'white', fontSize: 17, marginTop: 8 }}>总资产</Text>
          </View>
        </View>
      </View>
    )
  }

  handlePress = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WalletAssets'
      }
    })
  }

  handlePressIn = ({ reactTag }) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WalletAssets',
        options: {
          preview: {
            reactTag
          }
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1, height: 44 * 20 + 22 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          canRefresh
          headerBackgroundColor="white"
          headerTextColor="black"
          headerFontSize={22}
          cellSeparatorInset={{ left: 16, right: 16 }}
        >
          <Section>
            <Item
              height="205"
              containCollectionView
            >
              <CollectionView>
                <CollectionViewItem
                  height="190"
                  reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                />
                <CollectionViewItem
                  height="190"
                  reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                />
                <CollectionViewItem
                  height="190"
                  reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                />
                <CollectionViewItem
                  height="190"
                  reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                />
                <CollectionViewItem
                  height="190"
                  reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                />
              </CollectionView>
            </Item>
          </Section>
          <Section label="资产" headerHeight={48} headerButtonIcon="Add">
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.vote}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
            <Item
              onPress={this.addAssets}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance="1.23000000"
              amount="567.00 USD"
              symbol="BTC"
              name="Bitcoin"
              componentId={this.props.componentId}
            />
          </Section>
        </TableView>
      </View>
    )
  }
}
