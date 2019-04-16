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

export default class Contact extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: ''
        },
        rightButtons: [
          {
            id: 'edit',
            text: '编辑'
          }
        ],
        noBorder: true
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  deleteIdentity = (id) => {
    /* AlertIOS.prompt(
     *   '请输入钱包密码',
     *   null,
     *   [
     *     {
     *       text: '取消',
     *       onPress: () => console.log('Cancel Pressed'),
     *       style: 'cancel'
     *     },
     *     {
     *       text: '确认',
     *       onPress: password => this.props.actions.deleteIdentity.requested({
     *         password,
     *         id,
     *         delay: 500,
     *         componentId: this.props.componentId
     *       })
     *     }
     *   ],
     *   'secure-text'
     * )*/
  }

  backupIdentity = (id) => {
    AlertIOS.prompt(
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
    const { identity, backupIdentity, deleteIdentity, statusBarHeight } = this.props
    const id = identity.id
    const backupIdentityLoading = backupIdentity.loading
    const deleteIdentityLoading = deleteIdentity.loading
    const loading = backupIdentityLoading || deleteIdentityLoading

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#F7F7F7', width: '100%', height: 180 + +statusBarHeight, paddingTop: +statusBarHeight + 44, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          <View style={{ height: 61 }}>
            <FastImage
              source={require('resources/images/Userpic2.png')}
              style={{ width: 60, height: 60, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
          <View style={{ height: 61, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }} numberOfLines={1}>Terence Ge</Text>
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.5)', paddingTop: 3 }} numberOfLines={1}>自己</Text>
          </View>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
        </View>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
        >
          <Section />
          <Section label="BTC 地址">
            <Item
              reactModuleForCell="AddressTableViewCell"
              address="3LtEVW6VPKU1Qe9RsHU6kfKKWDY9cCHHPB"
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="AddressTableViewCell"
              address="3LtEVW6VPKU1Qe9RsHU6kfKKWDY9cCHHPB"
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
          </Section>
          <Section label="ETH 地址">
            <Item
              reactModuleForCell="AddressTableViewCell"
              address="0xD375Da74415A1098fEDcA560F782bc1D11B4B782"
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="AddressTableViewCell"
              address="0xD375Da74415A1098fEDcA560F782bc1D11B4B782"
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
          </Section>
          <Section label="EOS 账户">
            <Item
              reactModuleForCell="AddressTableViewCell"
              address="terencegehui"
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="AddressTableViewCell"
              address="terencegehui"
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
          </Section>
          <Section>
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              key="delete"
              actionType="delete"
              text="删除联系人"
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
