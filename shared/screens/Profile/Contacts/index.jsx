import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
// import FastImage from 'react-native-fast-image'
import styles from './styles'

const { Section, Item } = TableView

@connect(
  state => ({
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

export default class Contacts extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '地址簿'
        },
        rightButtons: [
          {
            id: 'edit',
            text: '编辑'
          }
        ],
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { editting: false }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'edit') {
      this.setState({ editting: true }, () => {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'done',
                text: '完成'
              }
            ]
          }
        })
      })
    } else if (buttonId === 'done') {
      this.setState({ editting: false }, () => {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'edit',
                text: '编辑'
              }
            ]
          }
        })
      })
    }
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toManageWallet') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet'
        }
      })
    }
  }

  render() {
    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
        tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
        detailTextColor="#666666"
        showsVerticalScrollIndicator={false}
        cellSeparatorInset={{ left: 16 }}
        onItemNotification={this.onItemNotification}
        editing={this.state.editting}
        moveWithinSectionOnly
      >
        <Section />
        <Section canMove canEdit>
          <Item
            height={44}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            detail="main"
          >
            terencegehui
          </Item>
          <Item
            height={44}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            detail="test"
          >
            terencegehui
          </Item>
          <Item
            height={44}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
          >
            terencegehui
          </Item>
          <Item
            height={44}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
          >
            terencegehui
          </Item>
          <Item
            height={44}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
          >
            terencegehui
          </Item>
          <Item
            height={44}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            reactModuleForCell="WalletTableViewCell"
            type="add"
            text="添加新地址..."
            canEdit={false}
          />
        </Section>
      </TableView>
    )
  }
}
