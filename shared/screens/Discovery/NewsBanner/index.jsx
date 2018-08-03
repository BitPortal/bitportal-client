/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from 'react'
import { View, Text, ScrollView, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import { connect } from 'react-redux'
import BannerCard from './BannerCard'
import Swiper from 'react-native-swiper'
import Colors from 'resources/colors'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    bannerData: state.news.get('bannerData')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...newsActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class NewBanner extends PureComponent {

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.getNewsBannerRequested()
    }, 3000);
  }

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  onBannerPress = (item) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
        passProps: {
          uri: item.jump_url,
          title: item.title,
        }
      }
    })
  }

  getBanners = () => {
    const { bannerData } = this.props
    const banners = bannerData.toJS()
    return banners.map(item => (
      <BannerCard
        imageUrl={item.img_url}
        title={item.title}
        subTitle={item.subTitle || ''}
        key={item.id}
        onPress={() => this.onBannerPress(item)}
      />
    ))
  }

  render() {
    const { bannerData } = this.props
    const banners = bannerData.toJS()
    if (!banners || banners.length < 1) return null
    return (
      <View style={styles.container}>
        <Swiper
          index={0}
          loop={true}
          bounces={true}
          pagingEnabled={true}
          containerStyle={styles.container}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={styles.paginationStyle}
        >
          {this.getBanners()}
        </Swiper>
      </View>
    )
  }
}

