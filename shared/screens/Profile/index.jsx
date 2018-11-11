import React, { Component } from 'react'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
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

  goToLanguageSetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.LanguageSetting'
      }
    })
  }

  goToCurrencySetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CurrencySetting'
      }
    })
  }

  goToNodeSetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.NodeSetting'
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
          tableViewCellStyle={TableView.Consts.CellStyle.Value1}
          onSwitchAccessoryChanged={() => {}}
        >
          <Section />
          <Section>
            <Item
              image={require('resources/images/contact.png')}
              arrow
            >
              联系人
            </Item>
          </Section>
          <Section>
            <Item
              image={require('resources/images/contact.png')}
              detail="中文"
              arrow
              onPress={this.goToLanguageSetting}
            >
              语言设置
            </Item>
            <Item
              image={require('resources/images/contact.png')}
              detail="CNY"
              arrow
              onPress={this.goToCurrencySetting}
            >
              货币单位
            </Item>
            <Item
              image={require('resources/images/contact.png')}
              arrow
              onPress={this.goToNodeSetting}
            >
              节点设置
            </Item>
          </Section>
          <Section>
            <Item
              image={require('resources/images/contact.png')}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              accessoryType={5}
              switchOn={false}
            >
              红涨绿跌
            </Item>
            <Item
              image={require('resources/images/contact.png')}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              accessoryType={5}
              switchOn={false}
            >
              隐藏余额
            </Item>
            <Item
              image={require('resources/images/contact.png')}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              accessoryType={5}
              switchOn={false}
            >
              夜间模式
            </Item>
          </Section>
          <Section arrow>
            <Item
              image={require('resources/images/contact.png')}
              arrow
            >
              邀请好友
            </Item>
            <Item
              image={require('resources/images/contact.png')}
              arrow
            >
              帮助中心
            </Item>
            <Item
              image={require('resources/images/contact.png')}
              arrow
            >
              关于我们
            </Item>
          </Section>
        </TableView>
      </View>
    )
  }
}
