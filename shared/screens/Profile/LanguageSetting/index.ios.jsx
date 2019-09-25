import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import * as intlActions from 'actions/intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'

const { Section, Item } = TableView

@injectIntl

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
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: messages[locale].top_bar_title_language_setting
        },
        backButton: {
          title: messages[locale].top_bar_title_profile
        }
      }
    })
  }

  render() {
    const { locale } = this.props

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
