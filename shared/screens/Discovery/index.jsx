import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import * as dAppActions from 'actions/dApp'
import TableView from 'react-native-tableview'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

@connect(
  state => ({
    locale: state.intl.get('locale'),
    listData: state.news.get('listData'),
    isRefreshing: state.news.get('isRefreshing'),
    loadingMore: state.news.get('loadingMore'),
    bannerData: state.news.get('bannerData'),
    nomore: state.news.get('nomore'),
    dAppList: state.dApp.get('data')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...newsActions,
      ...dAppActions
    }, dispatch)
  })
)

export default class Discovery extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '发现'
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search'
      }
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        canRefresh
        headerBackgroundColor="white"
        headerTextColor="black"
        cellSeparatorInset={{ right: 16 }}
      >
        <Section>
          <Item height={280} containCollectionView>
            <CollectionView>
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
            </CollectionView>
          </Item>
        </Section>
        <Section label="最新上架" headerHeight={48} headerButtonText="更多">
          <Item height={228} containCollectionView>
            <CollectionView>
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
            </CollectionView>
          </Item>
        </Section>
        <Section label="热门Dapp" headerHeight={48} headerButtonText="更多">
          <Item height={228} containCollectionView>
            <CollectionView>
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                showSeparator
              />
            </CollectionView>
          </Item>
        </Section>
        <Section label="所有分类" headerHeight={48} headerButtonText="更多">
          <Item image={require('resources/images/contact.png')}>fomo</Item>
          <Item image={require('resources/images/contact.png')}>竞猜</Item>
          <Item image={require('resources/images/contact.png')}>游戏</Item>
          <Item image={require('resources/images/contact.png')}>区块链浏览器</Item>
          <Item image={require('resources/images/contact.png')}>工具</Item>
        </Section>
      </TableView>
    )
  }
}
