import React, { Component } from 'react'
import { View, Text, FlatList, TouchableNativeFeedback, Image } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import { chainIcons } from 'resources/images'

@connect(
  state => ({
    locale: state.intl.locale,
    wallet: state.wallet
  })
)

export default class SelectChainType extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '选择钱包体系'
        },
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      },
      sideMenu: {
        left: {
          enabled: false
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  toImportBTCWallet = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ImportBTCWallet'
      }
    })
  }

  toImportETHWallet = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ImportETHWallet'
      }
    })
  }

  toImportEOSWallet = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ImportEOSWallet'
      }
    })
  }

  toImportChainxWallet = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ImportChainxWallet'
      }
    })
  }

  onPress = (chain) => {
    switch (chain) {
      case 'bitcoin':
        this.toImportBTCWallet()
        return
      case 'ethereum':
        this.toImportETHWallet()
        return
      case 'eos':
        this.toImportEOSWallet()
        return
      default:
    }
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, marginTop: 8, marginBottom: item.isLast ? 8 : 0 }}>
        <TouchableNativeFeedback onPress={this.onPress.bind(this, item.chain)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', false)} useForeground={true}>
          <View style={{ width: '100%', backgroundColor: 'white', borderRadius: 4, padding: 8, alignItems: 'center', justifyContent: 'center', elevation: 2 }}>
            <Image
              source={chainIcons[item.chain]}
              style={{ width: 200, height: 60 }}
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={[{ key: 'bitcoin', chain: 'bitcoin' }, { key: 'ethereum', chain: 'ethereum' }, { key: 'eos', chain: 'eos' }, { key: 'chainx', chain: 'chainx', isLast: true }]}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
