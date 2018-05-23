/* @tsx */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { startTabBasedApp } from 'navigators'
import styles from './styles'
import BaseScreen from 'components/BaseScreen'
import messages from 'navigators/messages'

const Page1 = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.text}>
      Page1
    </Text>
  </View>
)

const Page2= () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.text}>
      Page2
    </Text>
  </View>
)

const Page3 = ({ goToHomePage }) => (
  <View style={[styles.container, styles.center]}>
    <TouchableOpacity
      style={styles.center}
      onPress={goToHomePage}
    >
      <Text style={styles.text}>
        前往体验
      </Text>
    </TouchableOpacity>
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
      <Swiper
        containerStyle={styles.wrapper}
        index={0}
        loop={false}
        pagingEnabled={true}
      >
        <Page1 />
        <Page2 />
        <Page3 goToHomePage={this.goToHomePage} />
      </Swiper>
    )
  }
}
