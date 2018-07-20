

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { Logo, Description, Details, ListedExchange } from './TokenComponents'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class TokenDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={
            <CommonButton iconName="md-arrow-back" title="Token Details" onPress={() => Navigation.pop(this.props.componentId)} />
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
