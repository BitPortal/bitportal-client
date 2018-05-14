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

class Discovery extends BaseScreen {
  componentDidMount() {
    this.props.getNews(0, 10)
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
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  listData: state.news.get('listData'),
  bannerData: state.news.get('bannerData'),
})

const mapDispatchToProps = dispatch => ({
  getNews: (startAt, limit) => dispatch(newsActions.getNewsListRequested({ startAt, limit })),
  getBanner: () => dispatch(newsActions.getNewsBannerRequested())
})

export default connect(mapStateToProps, mapDispatchToProps)(Discovery)
