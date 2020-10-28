import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import styles from './styles'

const { Section, Item } = TableView

export const errorMessages = (error) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return gt('密码错误')
    default:
      return gt('操作失败')
  }
}

@injectIntl

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
          text: gt('我的身份')
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  deleteIdentity = (id) => {
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
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
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
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
    const { intl } = this.props
    const deleteIdentityError = this.props.deleteIdentity.error
    const backupIdentityError = this.props.backupIdentity.error
    const error = deleteIdentityError || backupIdentityError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: intl.formatMessage({ id: 'alert_button_confirm' }), onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  render() {
    const { intl, identity, backupIdentity, deleteIdentity } = this.props
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
              text={intl.formatMessage({ id: 'identity_text_avatar' })}
              type="avatar"
              height={60}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              text={intl.formatMessage({ id: 'identity_text_name' })}
              type="name"
              detail={identity.name}
              height={60}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              text={intl.formatMessage({ id: 'identity_text_id' })}
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
              text={intl.formatMessage({ id: 'identity_button_backup_identity' })}
              onPress={this.backupIdentity.bind(this, id)}
            />
            <Item
              reactModuleForCell="IdentityDetailTableViewCell"
              key="delete"
              actionType="delete"
              text={intl.formatMessage({ id: 'identity_button_delete_identity' })}
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
              {deleteIdentityLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'identity_loading_hint_verifying_password' })}</Text>}
              {!deleteIdentityLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'identity_loading_hint_exporting' })}</Text>}
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
