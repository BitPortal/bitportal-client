import React, { Component } from 'react'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'

const { Section, Item } = TableView

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet
  })
)

export default class NodeSetting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '节点设置'
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

  render() {
    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
      >
        <Section />
        <Section arrow>
          <Item>
            BTC 节点
          </Item>
          <Item>
            ETH 节点
          </Item>
          <Item>
            EOS 节点
          </Item>
        </Section>
      </TableView>
    )
  }
}
