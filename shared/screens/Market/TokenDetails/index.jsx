/* @jsx */

import React from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import { Logo, Description, Details, ListedExchange } from './TokenComponents'
import styles from './styles'

export default class TokenDetails extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={
            <CommonButton iconName="md-arrow-back" title="Token Details" onPress={() => this.pop()} />
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Logo />
            <Description />
            <Details />
            <ListedExchange />
          </ScrollView>
        </View>
      </View>
    )
  }
}
