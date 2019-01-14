import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import TableView from 'react-native-tableview'
import { Navigation } from 'react-native-navigation'
import * as dappActions from 'actions/dapp'
import {
  dappSelector,
  newDappSelector,
  hotDappSelector,
  gameDappSelector,
  toolDappSelector,
  dappRecommendSelector
} from 'selectors/dapp'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

@connect(
  state => ({
    dapp: dappSelector(state),
    newDapp: newDappSelector(state),
    hotDapp: hotDappSelector(state),
    gameDapp: gameDappSelector(state),
    toolDapp: toolDappSelector(state),
    featured: dappRecommendSelector(state)
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
        searchBarPlaceholder: 'Search'
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  componentDidMount() {
    this.props.actions.getDapp.requested()
    this.props.actions.getDappRecommend.requested()
  }

  componentDidAppear() {
    this.props.actions.getDapp.requested()
    this.props.actions.getDappRecommend.requested()
  }

  render() {
    const { dapp, newDapp, hotDapp, gameDapp, toolDapp, featured } = this.props

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        headerBackgroundColor="white"
        headerTextColor="black"
        separatorStyle={TableView.Consts.SeparatorStyle.None}
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
                  key={item.id}
                  uid={item.id}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title="最新上架"
            buttonText="更多"
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
          <Item image={require('resources/images/contact.png')}>系统</Item>
          <Item image={require('resources/images/contact.png')}>游戏</Item>
          <Item image={require('resources/images/contact.png')}>去中心交易平台</Item>
          <Item image={require('resources/images/contact.png')}>市场</Item>
          <Item image={require('resources/images/contact.png')}>工具</Item>
          <Item image={require('resources/images/contact.png')}>区块链浏览器</Item>
          <Item image={require('resources/images/contact.png')}>资讯</Item>
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
