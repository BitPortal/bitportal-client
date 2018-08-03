/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from 'react'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper'
import { styles } from './style'

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
    this.props.actions.getNewsBannerRequested()
  }

  componentWillUnmount(){
    if (this.timer) clearInterval(this.timer)
  }

  render() {
    const { bannerData } = this.props
    return (
      <View style={styles.container}>
        <Swiper
          index={0}
          loop={false}
          bounces={true}
          pagingEnabled={true}
          containerStyle={styles.wrapper}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={styles.paginationStyle}
        >
          {bannerData.map(() => (
            <NewsBannerCard
              imageUrl={item.img_url}
              title={item.title}
              subTitle={item.subTitle || ''}
              key={item.id}
              onPress={() => this.onBannerPress(item)}
            />
          ))}
        </Swiper>
      </View>
    )
  }
}

