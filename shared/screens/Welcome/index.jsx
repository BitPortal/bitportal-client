import React, { Component } from 'react'
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { startTabBasedApp } from 'navigators'
import { View, Text, Image, ImageBackground, TouchableHighlight } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Images from 'resources/images'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import VersionNumber from 'react-native-version-number'
import storage from 'utils/storage'
import styles from './styles'

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

const Page2 = () => (
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
  }),
  null,
  null,
  { withRef: true }
)

export default class Welcome extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  goToHomePage = async () => {
    if (this.props.from === 'about') {
      Navigation.pop(this.props.componentId)
      return
    }

    await storage.setItem('bitportal_welcome', { localVersion: VersionNumber.appVersion }, true)
    startTabBasedApp(this.props.locale)
  }

  componentDidMount() {
    SplashScreen.hide()
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
