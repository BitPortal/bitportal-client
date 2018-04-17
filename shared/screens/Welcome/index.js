/* @tsx */

import React, { Component } from 'react'
import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { startTabBasedApp } from 'navigators'
import styles from './styles'

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
      onPress={() => goToHomePage()} 
    >
      <Text style={styles.text}>
        前往体验
      </Text>
    </TouchableOpacity>
  </View>
)

export default class Welcome extends Component {

  goToHomePage = () => {
    AsyncStorage.setItem('Welcome', JSON.stringify({ isFirst: true }),() => {
      startTabBasedApp()
    })
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
