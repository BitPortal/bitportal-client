import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import { View, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { categoryDappSelector } from 'selectors/dapp'
import * as dappActions from 'actions/dapp'
import TableView from 'react-native-tableview'
const { Section, Item } = TableView

@connect(
  state => ({
    categoryDapp: categoryDappSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...dappActions
    }, dispatch)
  })
)

export default class DappList extends Component {
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

  componentWillUnmount() {
    this.props.actions.clearDappFilter()
  }

  render() {
    const { categoryDapp } = this.props

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        headerBackgroundColor="white"
        headerTextColor="black"
        separatorStyle={TableView.Consts.SeparatorStyle.None}
      >
        {categoryDapp && categoryDapp.length && <Section>
          {categoryDapp.map((item, index) =>
            <Item
              reactModuleForCell="SmallDappTableViewCell"
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              key={item.id}
              height="78"
              description={item.description.zh}
              name={item.display_name.zh}
              icon={item.icon_url}
              showSeparator={categoryDapp.length - 1 !== index}
            />
           )}
        </Section>}
      </TableView>
    )
  }
}
