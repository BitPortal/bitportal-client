import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import * as dAppActions from 'actions/dApp'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    listData: state.news.get('listData'),
    isRefreshing: state.news.get('isRefreshing'),
    loadingMore: state.news.get('loadingMore'),
    bannerData: state.news.get('bannerData'),
    nomore: state.news.get('nomore'),
    dAppList: state.dApp.get('data')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...newsActions,
      ...dAppActions
    }, dispatch)
  })
)

export default class Discovery extends Component {
  static get options() {
    return {
      topBar: {
        drawBehind: true,
        title: {
          text: 'Discovery'
        },
        background: {
          translucent: false
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        largeTitle: {
          visible: true,
          fontSize: 30,
          fontFamily: 'SFNSDisplay'
        }
      }
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <ScrollView style={styles.container} />
    )
  }
}
