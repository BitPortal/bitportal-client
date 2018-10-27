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

export default class Profile extends Component {
  static get options() {
    return {
      topBar: {
        drawBehind: true,
        title: {
          text: 'Profile'
        },
        largeTitle: {
          visible: true,
          fontSize: 30,
          fontFamily: 'SFNSDisplay'
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
        >
          <Section arrow label="数字身份">
            <Item image={require('resources/images/contact.png')}>设置</Item>
          </Section>
          <Section arrow>
            <Item image={require('resources/images/contact.png')}>通讯录</Item>
            <Item image={require('resources/images/contact.png')}>帮助中心</Item>
            <Item image={require('resources/images/contact.png')}>关于我们</Item>
            <Item image={require('resources/images/contact.png')}>设置</Item>
          </Section>
          <Section arrow>
            <Item image={require('resources/images/contact.png')}>通讯录</Item>
            <Item image={require('resources/images/contact.png')}>帮助中心</Item>
            <Item image={require('resources/images/contact.png')}>关于我们</Item>
            <Item image={require('resources/images/contact.png')}>设置</Item>
          </Section>
        </TableView>
      </View>
    )
  }
}
