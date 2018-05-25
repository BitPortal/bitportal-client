/* @tsx */

import React, { Component } from 'react'
import styles from './styles'
import Swiper from 'react-native-swiper'
import messages from 'navigators/messages'
import BaseScreen from 'components/BaseScreen'
import { connect } from 'react-redux'
import { startTabBasedApp } from 'navigators'
import { View, Text, Image, ImageBackground, TouchableHighlight } from 'react-native'
import Images from 'resources/images'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'

const NextButton = ({ goToHomePage }) => (
  <LinearGradientContainer type="right" style={[styles.btn, styles.btnContainer]}>
    <TouchableHighlight style={styles.btn} underlayColor={Colors.linearUnderlayColor} onPress={goToHomePage}>
      <Text style={styles.text14}> 前往体验 </Text>
    </TouchableHighlight>
  </LinearGradientContainer>
)

const Page1 = () => (
  <View style={[styles.pageContainer, styles.center]}>
    <ImageBackground source={Images.guide_asset} resizeMode="contain" style={styles.imageBg}>
      <Image source={Images.guide_asset_card} resizeMode="contain" style={styles.imageCard} />
    </ImageBackground>
    <Image source={Images.guide_asset_title} resizeMode="contain" style={styles.imageTitle} />
  </View>
)

const Page2= () => ( 
  <View style={[styles.pageContainer, styles.center]}>
    <ImageBackground source={Images.guide_market} resizeMode="contain" style={styles.imageBg}>
      <Image source={Images.guide_market_card} resizeMode="contain" style={styles.imageCard2} />
    </ImageBackground>
    <Image source={Images.guide_market_title} resizeMode="contain" style={styles.imageTitle} />
  </View>
)

const Page3 = ({ goToHomePage }) => (
  <View style={[styles.pageContainer, styles.center]}>
    <ImageBackground source={Images.guide_discovery} resizeMode="contain" style={styles.imageBg}>
      <Image source={Images.guide_discovery_card} resizeMode="contain" style={styles.imageCard3} />
    </ImageBackground>
    <Image source={Images.guide_discovery_title} resizeMode="contain" style={styles.imageTitle} />
    <NextButton goToHomePage={goToHomePage} />
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class Welcome extends BaseScreen {

  constructor(props, context) {
    super(props, context)
    this.goToHomePage = this.goToHomePage.bind(this)
  }

  goToHomePage() {
    const tabLabels = messages[this.props.locale]
    startTabBasedApp(tabLabels)
  }

  render() {
    return (
      <View style={styles.imageBackground}>
        <ImageBackground source={Images.guide_bg} resizeMode="stretch" style={styles.imageBackground} />
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
          <Page1 />
          <Page2 />
          <Page3 goToHomePage={this.goToHomePage} />
        </Swiper>
      </View>
    )
  }
}
