import React, { Component } from 'react'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'
import styles from './styles'

const { Section, Item } = TableView

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: state.currency.symbol,
    identity: state.identity
  })
)

export default class Profile extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '我的'
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  toLanguageSetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.LanguageSetting'
      }
    })
  }

  toCurrencySetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CurrencySetting'
      }
    })
  }

  toNodeSetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.NodeSetting'
      }
    })
  }

  toContacts = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Contacts'
      }
    })
  }

  toMyIdentity = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.MyIdentity'
      }
    })
  }

  toAddIdentity = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.AddIdentity'
          }
        }]
      }
    })
  }

  render() {
    const { identity, locale, currencySymbol } = this.props
    const hasIdentity = !!identity.id

    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
        tableViewCellStyle={TableView.Consts.CellStyle.Value1}
        cellSeparatorInset={{ left: 61 }}
        onSwitchAccessoryChanged={() => {}}
      >
        <Section />
        <Section>
          <Item
            height={78}
            reactModuleForCell="IdentityTableViewCell"
            name={hasIdentity ? identity.name : '数字身份'}
            identifier={hasIdentity ? identity.identifier : '创建或恢复数字身份'}
            onPress={hasIdentity ? this.toMyIdentity : this.toAddIdentity}
            arrow
          />
        </Section>
        <Section>
          <Item
            height={44}
            key="addressBook"
            type="addressBook"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toContacts}
            text="联系人"
            isSetting
          />
          <Item
            key="language"
            type="language"
            detail={locale === 'zh' ? '中文' : 'English'}
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toLanguageSetting}
            isSetting
            text="语言设置"
          />
          <Item
            key="currency"
            type="currency"
            detail={currencySymbol}
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toCurrencySetting}
            isSetting
            text="货币单位"
          />
          <Item
            key="node"
            type="node"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toNodeSetting}
            isSetting
            text="节点设置"
          />
        </Section>
        <Section>
          <Item
            key="privacyMode"
            type="privacyMode"
            reactModuleForCell="IdentityTableViewCell"
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={5}
            switchOn={false}
            isSetting
            text="隐私模式"
          />
          <Item
            key="darkMode"
            type="darkMode"
            reactModuleForCell="IdentityTableViewCell"
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            accessoryType={5}
            switchOn={false}
            isSetting
            text="夜间模式"
          />
        </Section>
        <Section arrow>
          <Item
            key="inviteFrends"
            type="inviteFrends"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            isSetting
            text="邀请好友"
          />
          <Item
            key="helpCenter"
            type="helpCenter"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            isSetting
            text="帮助中心"
          />
          <Item
            key="aboutUs"
            type="aboutUs"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            isSetting
            text="关于我们"
          />
        </Section>
      </TableView>
    )
  }
}
