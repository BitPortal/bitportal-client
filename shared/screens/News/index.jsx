import React, { Component } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
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
  }

  componentDidAppear() {
    this.props.actions.getNews.requested({ startAt: 0, limit: 10 })
  }

  fetchMore = () => {
    this.props.actions.getNews.requested({ startAt: 0, limit: 20 })
  }

  render() {
    const { news, intl } = this.props

    return (
      <View style={{ flex: 1 }}>
        <Text>
          {news.loading ? 'Fetching' : 'Fetched'} News
        </Text>

        {news.loading && <ActivityIndicator />}

        <TableView
          style={{ flex: 1, backgroundColor: 'white' }}
          reactModuleForCell="NewsTableViewCell"
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          headerBackgroundColor="white"
          headerTextColor="black"
          cellSeparatorInset={{ right: 16 }}
          canRefresh
          refreshing={news.loading}
          onRefresh={this.fetchMore}
        >
          <Section>
            { news.listData ? news.listData.map(
              item => <Item
                key={item.id}
                height={94}
                title={item.title}
                tags={(item.tags && item.tags[0]) || 'News'}
                author={item.publisher}
                img_url=""
                jump_url=""
                lang={intl}
                content={item.content}
                componentId={this.props.componentId}
              />
            ) : []
            }
          </Section>
        </TableView>
      </View>
    )
  }
}
