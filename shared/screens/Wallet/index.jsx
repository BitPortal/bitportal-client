import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
// import FastImage from 'react-native-fast-image'
import SplashScreen from 'react-native-splash-screen'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionActions from 'actions/version'
import * as currencyActions from 'actions/currency'
import * as eosAccountActions from 'actions/eosAccount'
import { selectedEOSTokenBalanceSelector, eosTotalAssetBalanceSelector } from 'selectors/balance'
import { eosPriceSelector } from 'selectors/ticker'
import { eosAccountSelector } from 'selectors/eosAccount'
import styles from './styles'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

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

  async componentDidMount() {
    this.props.actions.syncWalletRequested()
    SplashScreen.hide()
  }

  componentDidAppear() {

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
