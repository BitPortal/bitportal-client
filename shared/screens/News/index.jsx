import React, { Component, View, Text } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import TableView from 'react-native-tableview'
import * as newsActions from 'actions/news'

const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    news: state.news
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...newsActions
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

  async componentDidMount() {
    this.props.actions.getNews.requested({ startAt: 0, limit: 10 })
  }

  componentDidAppear() {
    this.props.actions.getNews.requested({ startAt: 0, limit: 10 })
  }

  fetchMore = () => {
    this.props.actions.getNews.requested({ startAt: 0, limit: 10 })
  }

  render() {
    const { news, intl } = this.props

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        reactModuleForCell="NewsTableViewCell"
        tableViewCellStyle={TableView.Consts.CellStyle.Default}
        headerBackgroundColor="white"
        headerTextColor="black"
        cellSeparatorInset={{ right: 16 }}
        refreshing={news.refreshing}
        onRefresh={this.fetchMore}
      >
        <Section>
          { news.listData ? news.listData.map(
            item => <Item
              key={item.id}
              height={94}
              title={item.title}
              tags={item.tags[0] || 'News'}
              author={item.author}
              img_url=""
              jump_url=""
              content={item.content}
              componentId={this.props.componentId}
            />
          ) : []
          }
        </Section>
      </TableView>
    )
  }
}
