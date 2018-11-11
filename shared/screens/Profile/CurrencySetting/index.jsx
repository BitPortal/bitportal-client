import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'
import styles from './styles'

const { Section, Item } = TableView

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet
  })
)

export default class CurrencySetting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '货币单位'
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
        <Section>
          <Item selected>
            USD
          </Item>
          <Item>
            CNY
          </Item>
        </Section>
      </TableView>
    )
  }
}
