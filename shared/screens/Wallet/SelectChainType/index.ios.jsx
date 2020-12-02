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
          text: gt('select_wallet_type')
        },
        backButton: {
          title: gt('button_back')
        },
        // leftButtons: [
        //   {
        //     id: 'cancel',
        //     text: gt('button_cancel')
        //   }
        // ],
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
  toImportRioChainWallet = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ImportRioChainWallet'
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
          <Item
            height={66}
            chain="riochain"
            reactModuleForCell="ChainTypeTableViewCell"
            onPress={this.toImportRioChainWallet}
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

