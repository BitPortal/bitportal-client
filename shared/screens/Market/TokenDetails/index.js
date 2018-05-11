/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { BackButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import { Logo, Description, Details, ListedExchange } from './TokenComponents'

export default class TokenDetails extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={
            <BackButton iconName="md-arrow-back" title="Token Details" onPress={() => this.goBack()} />
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
