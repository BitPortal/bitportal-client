import React, { Component } from 'react'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'

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
          text: gt('选择钱包体系')
        },
        backButton: {
          title: gt('返回')
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

  // toImportEOSWallet = () => {
  //   Navigation.push(this.props.componentId, {
  //     component: {
  //       name: 'BitPortal.ImportEOSWallet'
  //     }
  //   })
  // }
  //
  // toImportChainxWallet = () => {
  //   Navigation.push(this.props.componentId, {
  //     component: {
  //       name: 'BitPortal.ImportChainxWallet'
  //     }
  //   })
  // }


  render() {
    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
        cellSeparatorInset={{ left: 50 }}
      >
        <Section />
        <Section>
          <Item
            height={66}
            chain="bitcoin"
            reactModuleForCell="ChainTypeTableViewCell"
            onPress={this.toImportBTCWallet}
          />
          <Item
            height={66}
            chain="ethereum"
            reactModuleForCell="ChainTypeTableViewCell"
            onPress={this.toImportETHWallet}
          />
          {/*<Item*/}
          {/*  height={66}*/}
          {/*  chain="eos"*/}
          {/*  reactModuleForCell="ChainTypeTableViewCell"*/}
          {/*  onPress={this.toImportEOSWallet}*/}
          {/*/>*/}
          {/*<Item*/}
          {/*  height={66}*/}
          {/*  chain="chainx"*/}
          {/*  reactModuleForCell="ChainTypeTableViewCell"*/}
          {/*  onPress={this.toImportChainxWallet}*/}
          {/*/>*/}
        </Section>
      </TableView>
    )
  }
}
