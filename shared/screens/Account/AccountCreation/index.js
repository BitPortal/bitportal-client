/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { BackButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import Tips from './Tips'

export default class AccountCreation extends BaseScreen {

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
          leftButton={<BackButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          title="Create Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Tips />
            
          </ScrollView>
        </View>
        
      </View>
    )
  }

}
