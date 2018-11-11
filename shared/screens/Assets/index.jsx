import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import SplashScreen from 'react-native-splash-screen'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as balanceActions from 'actions/balance'
import * as versionActions from 'actions/version'
import * as currencyActions from 'actions/currency'
import * as eosAccountActions from 'actions/eosAccount'
import { selectedEOSTokenBalanceSelector, eosTotalAssetBalanceSelector } from 'selectors/balance'
import { eosPriceSelector } from 'selectors/ticker'
import { eosAccountSelector } from 'selectors/eosAccount'
import styles from './styles'

@connect(
  state => ({
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state),
    eosAssetBalance: selectedEOSTokenBalanceSelector(state),
    eosTotalAssetBalance: eosTotalAssetBalanceSelector(state),
    eosPrice: eosPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...tickerActions,
      ...balanceActions,
      ...versionActions,
      ...currencyActions,
      ...eosAccountActions,
      ...walletActions
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
    this.props.actions.syncWalletRequested()
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
