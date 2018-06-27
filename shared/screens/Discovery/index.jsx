import React from 'react'
import { connect } from 'react-redux'
import BaseScreen from 'components/BaseScreen'
import { View } from 'react-native'
import NavigationBar, { CommonTitle } from 'components/NavigationBar'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import { IntlProvider } from 'react-intl'
import NewsList from './NewsList'
import NewsBanner from './NewsBanner'
import NewsBannerCard from './NewsBannerCard'
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
  })
)

export default class Discovery extends BaseScreen {
  componentDidMount() {
    this.props.actions.getNewsListRequested({ startAt: 0, limit: PAGE_LENGTH, loadingMore: false })
    this.props.actions.getNewsBannerRequested()
  }

  getNewsListData = () => {
    try {
      const data = this.props.listData.toJS()

      return data.map(item => ({
        previewImage: item.img_url,
        title: item.title,
        // TODO: get some raw text from markdown ?
        subTitle: item.content.substr(0, 30),
        author: item.publisher,
        date: new Date(item.createdAt).toLocaleDateString(),
        id: item.id,
        type: item.type,
        jumpUrl: item.jump_url,
        content: item.content
      }))
    } catch (e) {
      return []
    }
  }

  getBanner = () => {
    try {
      const data = this.props.bannerData.toJS()
      return data.map(item =>
        <NewsBannerCard
          imageUrl={item.img_url}
          title={item.title}
          // api don't have subtitle
          subTitle={item.subTitle || ''}
          key={item.id}
          onPress={() => this.onBannerPress(item)}
        />
      )
    } catch (e) {
      return []
    }
  }

  onRefresh = () => {
    this.props.actions.getNewsListRequested({ startAt: 0, limit: PAGE_LENGTH, loadingMore: false })
  }

  onRowPress = (item) => {
    if (item.type === 'link' && item.jumpUrl && item.jumpUrl.length > 0) {
      this.push({
        screen: 'BitPortal.DiscoveryArticle',
        passProps: {
          url: item.jumpUrl,
          title: item.title,
        }
      })
    } else {
      this.push({
        screen: 'BitPortal.Markdown',
        passProps: {
          markdown: item.content,
          title: item.title,
        }
      })
    }
  }

  onBannerPress = (item) => {
    this.push({
      screen: 'BitPortal.DiscoveryArticle',
      passProps: {
        url: item.jump_url,
        title: item.tittle || item.title,
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
          <NewsBanner autoplay={true} style={{ paddingVertical: 20 }}>
            {this.getBanner()}
          </NewsBanner>
          <NewsList
            data={this.getNewsListData()}
            onRefresh={this.onRefresh}
            onEndReached={this.onEndReached}
            refreshing={isRefreshing}
            onRowPress={this.onRowPress}
            nomore={nomore}
            loadingMore={loadingMore}
          />
        </View>
      </IntlProvider>
    )
  }
}