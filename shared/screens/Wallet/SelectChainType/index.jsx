import React, { Component } from 'react'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'

const { Section, Item } = TableView

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
        backButton: {
          title: '返回'
        },
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
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

  render() {
    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
      >
        <Section />
        <Section arrow>
          <Item onPress={this.toImportBTCWallet}>
            BTC 钱包
          </Item>
          <Item onPress={this.toImportETHWallet}>
            ETH 钱包
          </Item>
          <Item onPress={this.toImportEOSWallet}>
            EOS 钱包
          </Item>
        </Section>
      </TableView>
    )
  }
}
