import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import styles from './styles'
import { injectIntl } from "react-intl";

const { Section, Item } = TableView

@injectIntl
export default class MyIdentity extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: gt('节点详情')
        },
        backButton: {
          title: gt('返回')
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  render() {
    console.log(this.props)
    const { owner, info, producer_key } = this.props
    const title = info && info.title
    const location = info && info.org && info.org.location

    const items = []
    items.push(
      <Item
        reactModuleForCell="ProducerDetailTableViewCell"
        text="Logo"
        type="avatar"
        key="avatar"
        height={60}
        logo={info && info.org && info.org.branding && info.org.branding.logo}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    if (title) {
      items.push(
        <Item
          reactModuleForCell="ProducerDetailTableViewCell"
          text={t(this,'节点名称')}
          type="title"
          key="title"
          detail={title}
          height={60}
          selectionStyle={TableView.Consts.CellSelectionStyle.None}
        />
      )
    }

    items.push(
      <Item
        reactModuleForCell="ProducerDetailTableViewCell"
        text={t(this,'合约帐号')}
        key="owner"
        type="owner"
        detail={owner}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    if (location) {
      items.push(
        <Item
          reactModuleForCell="ProducerDetailTableViewCell"
          text={t(this,'节点位置')}
          key="location"
          type="location"
          detail={location}
          height={60}
          selectionStyle={TableView.Consts.CellSelectionStyle.None}
        />
      )
    }

    items.push(
      <Item
        reactModuleForCell="ProducerDetailTableViewCell"
        text={t(this,'节点公钥')}
        type="identifier"
        key="identifier"
        detail={producer_key}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    return (
      <View style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
        >
          <Section />
          <Section>
            {items}
          </Section>
        </TableView>
      </View>
    )
  }
}
