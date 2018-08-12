import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonTitle } from 'components/NavigationBar'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import { IntlProvider } from 'react-intl'
import NewsList from './NewsList'
import messages from './messages'
import styles from './styles'

const PAGE_LENGTH = 10

@connect(
  state => ({
    locale: state.intl.get('locale'),
    listData: state.news.get('listData'),
    isRefreshing: state.news.get('isRefreshing'),
    loadingMore: state.news.get('loadingMore'),
    bannerData: state.news.get('bannerData'),
    nomore: state.news.get('nomore')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...newsActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Discovery extends Component {
  componentDidMount() {
    this.props.actions.getNewsListRequested({ startAt: 0, limit: PAGE_LENGTH, loadingMore: false })
  }

  getNewsListData = () => {
    try {
      const data = this.props.listData.toJS()

      return data.map(item => ({
        previewImage: item.img_url,
        title: item.title,
        // TODO: get some raw text from markdown ?
        subTitle: item.content.substr(0, 30),
        author: item.author && item.author.name,
        date: new Date(item.createdAt).toLocaleDateString(),
        id: item.id,
        mobile_type: item.mobile_type,
        mobile_jump_url: item.mobile_jump_url,
        content: item.content
      }))
    } catch (e) {
      return []
    }
  }

  onRefresh = () => {
    this.props.actions.getNewsListRequested({
      startAt: 0,
      limit: PAGE_LENGTH,
      loadingMore: false
    })
  }

  onRowPress = (item) => {
    if (item.mobile_type === 'link' && item.mobile_jump_url && item.mobile_jump_url.length > 0) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.BPWebView',
          passProps: {
            uri: item.mobile_jump_url,
            title: item.title
          }
        }
      })
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.Markdown',
          passProps: {
            markdown: item.content,
            title: item.title,
          }
        }
      })
    }
  }

  onBannerPress = (item) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DiscoveryArticle',
        passProps: {
          url: item.jump_url,
          title: item.title,
        }
      }
    })
  }

  onEndReached = () => {
    if (this.props.nomore || this.props.isRefreshing) {
      return
    }
    const length = this.props.listData.toJS().length
    this.props.actions.getNewsListRequested({ startAt: length, limit: PAGE_LENGTH, loadingMore: true })
  }

  render() {
    const { locale, loadingMore, isRefreshing, nomore } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonTitle title={messages[locale].discovery_title_name_dsc} />}
          />
          <NewsList
            data={this.getNewsListData()}
            onRefresh={this.onRefresh}
            onEndReached={this.onEndReached}
            refreshing={isRefreshing}
            onRowPress={this.onRowPress}
            nomore={nomore}
            loadingMore={loadingMore}
            componentId={this.props.componentId}
          />
        </View>
      </IntlProvider>
    )
  }
}
