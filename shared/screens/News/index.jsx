import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TableView from 'react-native-tableview'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

@connect(
  state => ({
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

export default class News extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '资讯'
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
          <Item height={280} containCollectionView collectionViewInsideTableViewCell="FeaturedDappCollectionViewCell">
            <CollectionView>
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="FeaturedDappCollectionViewCell1"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="FeaturedDappCollectionViewCell2"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="FeaturedDappCollectionViewCell3"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                height="280"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="FeaturedDappCollectionViewCell4"
              />
            </CollectionView>
          </Item>
        </Section>
        <Section label="最新上架" headerHeight={48} headerButtonText="更多">
          <Item height={228} containCollectionView collectionViewInsideTableViewCell="SmallDappCollectionViewCell">
            <CollectionView>
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="SmallDappCollectionView1"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="SmallDappCollectionView2"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                uid="SmallDappCollectionView3"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="SmallDappCollectionView4"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="SmallDappCollectionView5"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="SmallDappCollectionView6"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                height="76"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="SmallDappCollectionView7"
                showSeparator
              />
            </CollectionView>
          </Item>
        </Section>
        <Section label="热门Dapp" headerHeight={48} headerButtonText="更多">
          <Item height={228} containCollectionView collectionViewInsideTableViewCell="LargeDappCollectionViewCell">
            <CollectionView>
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="LargeDappCollectionViewCell1"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                uid="LargeDappCollectionViewCell2"
                name="Bitcoin"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="LargeDappCollectionViewCell3"
                showSeparator
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="LargeDappCollectionViewCell4"
              />
              <CollectionViewItem
                reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                height="114"
                balance="1.23000000"
                amount="567.00 USD"
                symbol="BTC"
                name="Bitcoin"
                uid="LargeDappCollectionViewCell5"
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
