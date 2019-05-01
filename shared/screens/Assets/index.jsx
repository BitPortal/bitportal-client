import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import * as assetActions from 'actions/asset'
import { selectedEOSTokenBalanceSelector, eosTotalAssetBalanceSelector } from 'selectors/balance'
import styles from './styles'

@connect(
  state => ({

  }),
  dispatch => ({
    actions: bindActionCreators({
      ...assetActions
    }, dispatch)
  })
)

export default class Wallet extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '钱包'
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  componentDidMount() {
    SplashScreen.hide()
  }

  componentDidAppear() {

  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>hello</Text>
        </ScrollView>
      </View>
    )
  }
}
