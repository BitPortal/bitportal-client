import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import styles from './styles'

const { Section, Item } = TableView

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    default:
      return '操作失败'
  }
}

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

export default class MyIdentity extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: '我的身份'
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  deleteIdentity = (id) => {
    Alert.prompt(
      '请输入钱包密码',
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: password => this.props.actions.deleteIdentity.requested({
            password,
            id,
            delay: 500,
            componentId: this.props.componentId
          })
        }
      ],
      'secure-text'
    )
  }

  backupIdentity = (id) => {
    Alert.prompt(
      '请输入钱包密码',
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: password => this.props.actions.backupIdentity.requested({ id, password, delay: 500, componentId: this.props.componentId })
        }
      ],
      'secure-text'
    )
  }

  clearError = () => {
    this.props.actions.deleteIdentity.clearError()
    this.props.actions.backupIdentity.clearError()
  }

  onModalHide = () => {
    const deleteIdentityError = this.props.deleteIdentity.error
    const backupIdentityError = this.props.backupIdentity.error
    const error = deleteIdentityError || backupIdentityError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

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
          <Section>
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              key="mnemonic"
              actionType="mnemonic"
              text="备份身份"
              onPress={this.backupIdentity.bind(this, id)}
            />
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              key="delete"
              actionType="delete"
              text="删除身份"
              onPress={this.deleteIdentity.bind(this, id)}
            />
          </Section>
        </TableView>
        <Modal
          isVisible={loading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              {deleteIdentityLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>验证密码...</Text>}
              {!deleteIdentityLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>导出中...</Text>}
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
