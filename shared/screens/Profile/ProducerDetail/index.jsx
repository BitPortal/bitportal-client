import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, AlertIOS, Alert, Text, ActivityIndicator, Animated } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import styles from './styles'

const { Section, Item } = TableView

@connect(
  state => ({
    identity: state.identity,
    deleteIdentity: state.deleteIdentity,
    backupIdentity: state.backupIdentity
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class ProducerDetail extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: '节点详情'
        },
        backButton: {
          title: '返回'
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  render() {
    const { identity, backupIdentity, deleteIdentity } = this.props
    const id = identity.id
    const backupIdentityLoading = backupIdentity.loading
    const deleteIdentityLoading = deleteIdentity.loading
    const loading = backupIdentityLoading || deleteIdentityLoading

    return (
      <View style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
        >
          <Section />
          <Section>
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              text="头像"
              type="avatar"
              height={60}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              text="身份名"
              type="name"
              detail={identity.name}
              height={60}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              text="身份ID"
              type="identifier"
              detail={identity.identifier}
              height={60}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
          </Section>
        </TableView>
      </View>
    )
  }
}
