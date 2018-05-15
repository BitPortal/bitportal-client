import React from 'react'
import { connect } from 'react-redux'
import BaseScreen from 'components/BaseScreen'
import { View } from 'react-native'
import * as newsActions from 'actions/news'
import NewsList from 'components/NewsList'
import NewsBanner from 'components/NewsBanner'
import NewsBannerCard from 'components/NewsBannerCard'
import NavigationBar, { CommonRightButton, CommonTitle } from 'components/NavigationBar'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import Colors from 'resources/colors'
import styles from './styles'
const PAGE_LENGTH = 10

class Discovery extends BaseScreen {
  componentDidMount() {
    this.props.getNews(0, PAGE_LENGTH)
    this.props.getBanner()
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
        onRowPress: item.onRowPress,
        id: item.id
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
        />
      )
    } catch (e) {
      return []
    }
  }

  onRefresh = () => {
    this.props.getNews(0, PAGE_LENGTH, true)
  }

  onEndReached = () => {
    if (this.props.nomore || this.props.listDataRefreshing) {
      return
    }
    const length = this.props.listData.toJS().length
    this.props.getNews(length, PAGE_LENGTH)
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonTitle title="Discovery" />}
          rightButton={<CommonRightButton iconName="md-search" onPress={() => {}} />}
        />
        <NewsBanner autoplay={false} style={{ paddingVertical: 20 }}>
          {this.getBanner()}
        </NewsBanner>
        <NewsList
          data={this.getNewsListData()}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          refreshing={this.props.listDataRefreshing}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  listData: state.news.get('listData'),
  listDataRefreshing: state.news.get('listLoading'),
  bannerData: state.news.get('bannerData'),
  nomore: state.news.get('nomore'),
})

const mapDispatchToProps = dispatch => ({
  getNews: (startAt, limit, isRefresh = false) => {
    dispatch(newsActions.getNewsListRequested({ startAt, limit, isRefresh }))
  },
  getBanner: () => dispatch(newsActions.getNewsBannerRequested())
})

export default connect(mapStateToProps, mapDispatchToProps)(Discovery)
