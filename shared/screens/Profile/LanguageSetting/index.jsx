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

export default class LanguageSetting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '语言设置'
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
          <Item>
            English
          </Item>
          <Item selected>
            中文
          </Item>
          <Item>
            한국어
          </Item>
        </Section>
      </TableView>
    )
  }
}
