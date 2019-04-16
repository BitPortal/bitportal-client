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
          text: '联系人'
        },
        rightButtons: [
          {
            id: 'add',
            icon: require('resources/images/Add.png')
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
    if (buttonId === 'add') {

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

  onChange = (data) => {
    console.log(data)
  }

  onPress = async () => {
    const constants = await Navigation.constants()

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Contact',
        passProps: {
          statusBarHeight: constants.statusBarHeight
        }
      }
    })
  }

  render() {
    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        tableViewCellStyle={TableView.Consts.CellStyle.Default}
        detailTextColor="#666666"
        showsVerticalScrollIndicator={false}
        cellSeparatorInset={{ left: 16 }}
        onItemNotification={this.onItemNotification}
        onChange={this.onChange}
        moveWithinSectionOnly
      >
        <Section label="T">
          <Item
            height={60}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            reactModuleForCell="ContactTableViewCell"
            name="Terence Ge"
            description="自己"
            onPress={this.onPress}
          />
          <Item
            height={60}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            reactModuleForCell="ContactTableViewCell"
            name="Jamie Chen"
            description="同事"
            onPress={this.onPress}
          />
          <Item
            height={60}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            reactModuleForCell="ContactTableViewCell"
            name="Errance Liu"
            description="同事"
            onPress={this.onPress}
          />
          <Item
            height={60}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            reactModuleForCell="ContactTableViewCell"
            name="Binance"
            description="交易所"
            onPress={this.onPress}
          />
          <Item
            height={60}
            accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
            reactModuleForCell="ContactTableViewCell"
            name="OKEX"
            description="交易所"
            onPress={this.onPress}
          />
        </Section>
      </TableView>
    )
  }
}
