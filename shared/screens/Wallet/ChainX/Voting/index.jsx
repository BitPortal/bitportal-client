import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, Button } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import { activeWalletSelector, identityBTCWalletSelector } from 'selectors/wallet'
import FastImage from 'react-native-fast-image'
import * as walletActions from 'actions/wallet'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    // backgroundColor: 'white'
  },
  textFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 138'
  },
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
})

@injectIntl

@connect(
  state => ({
    activeWallet: activeWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)


export default class ChainXVoting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'ChainX 投票选举'
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  componentDidAppear() {
  }

  componentDidDisappear() {
  }

  componentDidMount() {
  }

  onRefresh = () => {
  }

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  toVote = () => {

  }

  render() {
    const { intl } = this.props

    const isIdentityWallet = true
    const currentChainXAddress = '5Swfu6aH44gbu9Kt8KwY8AcrbWaZ4qXXFEwd23xbCJB49AR5'
    const bindedBTCAddress = ['3FK7PJiukCS57aPhMdtc6soqKTrQogX2Zz']

    return (
      <View style={styles.container}>
        <View styles={styles.container, { margin: '20%' }}>
          <Text>更多功能正在开发中</Text>
          <Text>Coming Soon</Text>
        </View>
      </View>
    )
  }
}
