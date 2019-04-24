import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'
import * as intlActions from 'actions/intl'

const { Section, Item } = TableView

@connect(
  state => ({
    locale: state.intl.locale
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...intlActions
    }, dispatch)
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

  setLocale = (locale) => {
    this.props.actions.setLocale(locale)
  }

  render() {
    const { locale } = this.props
    console.log(locale)

    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
      >
        <Section />
        <Section>
          <Item
            accessoryType={locale === 'en' ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
            onPress={this.setLocale.bind(this, 'en')}
          >
            English
          </Item>
          <Item
            accessoryType={locale === 'zh' ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
            onPress={this.setLocale.bind(this, 'zh')}
          >
            中文
          </Item>
        </Section>
      </TableView>
    )
  }
}
