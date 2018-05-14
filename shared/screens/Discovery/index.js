import React from 'react'
import { connect } from 'react-redux'
import BaseScreen from 'components/BaseScreen'
import { View, Text, TouchableOpacity } from 'react-native'
import * as newsActions from 'actions/news'
import NewsList from 'components/NewsList'
import NavigationBar, { CommonRightButton, CommonTitle } from 'components/NavigationBar'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

class Discovery extends BaseScreen {
  componentDidMount() {
    this.props.getNews(0, 10)
  }

  getNewsListData = () => {
    try {
      const data = this.props.newsData.toJS()
      return data.map(item => ({
        previewImage: item.img_url,
        // TODO: the api key is 'tittle' and should be corrected
        title: item.title || item.tittle,
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

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={ <CommonTitle title="Discovery" /> }
          rightButton={ <CommonRightButton iconName="md-search" /> }
        />
        <NewsList
          data={this.getNewsListData()}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  newsData: state.news.get('data')
})

const mapDispatchToProps = dispatch => ({
  getNews: (startAt, limit) => dispatch(newsActions.getNewsRequested({ startAt, limit }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Discovery)
