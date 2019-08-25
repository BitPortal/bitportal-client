import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import TableView from 'react-native-tableview'
import { Navigation } from 'react-native-navigation'
import { Alert } from 'react-native'
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
import { loadScatter, loadScatterSync, loadMetaMask, loadMetaMaskSync } from 'utils/inject'
import { activeWalletSelector } from 'selectors/wallet'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

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

  subscription = Navigation.events().bindComponent(this)

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
                }
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

  render() {
    const { dapp, newDapp, hotDapp, gameDapp, toolDapp, featured, bookmarked } = this.props

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        headerBackgroundColor="white"
        headerTextColor="black"
        separatorStyle={TableView.Consts.SeparatorStyle.None}
        onItemNotification={this.onItemNotification}
        onCollectionViewDidSelectItem={this.onCollectionViewDidSelectItem}
      >
        <Section>
          <Item
            height={318}
            containCollectionView
            collectionViewInsideTableViewCell="FeaturedDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="FeaturedDappCollectionViewCell"
          >
            <CollectionView>
              {featured.map(item =>
                <CollectionViewItem
                  reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                  height="315"
                  title={item.title}
                  description={item.title}
                  img={item.img_url}
                  url={item.jump_url}
                  key={item.id}
                  uid={item.id}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        {bookmarked && !!bookmarked.length && <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="我的收藏"
            buttonText="更多"
            category="bookmarked"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>}
        {bookmarked && !!bookmarked.length && <Section>
          <Item
            height={bookmarked.length >= 3 ? 234 : bookmarked.length * 78}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellNew"
          >
            <CollectionView>
              {bookmarked.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellNew"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % (bookmarked.length >= 3 ? 3 : bookmarked.length) !== ((bookmarked.length >= 3 ? 3 : bookmarked.length) - 1)}
                />
               )}
            </CollectionView>
          </Item>
        </Section>}
        {bookmarked && !!bookmarked.length && <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>}
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="最新上架"
            buttonText="更多"
            category="new"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellNew"
          >
            <CollectionView>
              {newDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellNew"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 3 !== 2}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="热门应用"
            buttonText="更多"
            category="hot"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="LargeDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="LargeDappCollectionViewCellHot"
          >
            <CollectionView>
              {hotDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="LargeDappCollectionViewCellNew"
                  height="117"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 2 !== 1}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="游戏"
            buttonText="更多"
            category="game"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellGame"
          >
            <CollectionView>
              {gameDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellGame"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 3 !== 2}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="工具"
            buttonText="更多"
            category="tool"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellTool"
          >
            <CollectionView>
              {toolDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellTool"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 3 !== 2}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="所有分类"
            buttonText="更多"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="system"
            name="系统"
            onPress={this.toDappList.bind(this, '系统', 'system')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="game"
            name="游戏"
            onPress={this.toDappList.bind(this, '游戏', 'game')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="exchange"
            name="去中心交易平台"
            onPress={this.toDappList.bind(this, '去中心交易平台', 'exchange')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="marketplace"
            name="市场"
            onPress={this.toDappList.bind(this, '市场', 'marketplace')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="tool"
            name="工具"
            onPress={this.toDappList.bind(this, '工具', 'tool')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="explorer"
            name="区块链浏览器"
            onPress={this.toDappList.bind(this, '区块链浏览器', 'explorer')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="news"
            name="资讯"
            onPress={this.toDappList.bind(this, '资讯', 'news')}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
      </TableView>
    )
  }
}
