import React, { PureComponent } from 'react'
import { View, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper'
import { loadInjectSync } from 'utils/inject'
import BannerCard from './BannerCard'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    bannerData: state.news.get('bannerData')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...newsActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class NewBanner extends PureComponent {
  componentWillMount() {
    this.props.actions.getLocalBanners()
    this.props.actions.getNewsBannerRequested()
  }

  UNSAFE_componentWillReceiveProps() {
    LayoutAnimation.easeInEaseOut()
  }

  onBannerPress = item => {
    const inject = loadInjectSync()
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappWebView',
        passProps: {
          uri: item.jump_url,
          title: item.title,
          inject
        }
      }
    })
  }

  getBanners = () => {
    const { bannerData } = this.props
    const banners = bannerData.toJS()
    return banners.map(item => (
      <BannerCard imageUrl={item.img_url} key={item.id} onPress={() => this.onBannerPress(item)} />
    ))
  }

  render() {
    const { bannerData } = this.props
    const banners = bannerData.toJS()
    if (!banners || banners.length < 1) {
      return null
    }
    return (
      <View style={styles.container}>
        <Swiper
          index={0}
          loop={true}
          bounces={true}
          pagingEnabled={true}
          autoplay
          autoplayTimeout={5}
          autoplayDirection
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
