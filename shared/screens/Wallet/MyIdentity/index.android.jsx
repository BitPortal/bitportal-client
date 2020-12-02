import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Alert, Text, ActivityIndicator, Animated, SectionList, TouchableNativeFeedback, TextInput, Image } from 'react-native'
import { Navigation } from 'components/Navigation'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import IndicatorModal from 'components/Modal/IndicatorModal'
import styles from './styles'

export const errorMessages = (error) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return gt('pwd_wrong')
    default:
      return gt('operation_failed')
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
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            color: 'white'
          }
        ],
        title: {
          text: t(this,'identity_id_user')
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { showPrompt: false, password: '', requestPasswordAction: null }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  toggleSideMenu() {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: true
        }
      }
    })
  }

  componentDidAppear() {
    if (this.props.fromCard) {
      this.props.actions.setActiveWallet(this.props.wallet.id)
    }
  }

  deleteIdentity = () => {
    const { identity } = this.props
    const id  = identity.id
    const password = this.state.password

    this.props.actions.deleteIdentity.requested({
      password,
      id,
      delay: 500,
      componentId: this.props.componentId,
      fromModal: true
    })
  }

  backupIdentity = () => {
    const { identity } = this.props
    const id  = identity.id
    const password = this.state.password

    this.props.actions.backupIdentity.requested({ id, password, delay: 500, componentId: this.props.componentId })
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

  renderHeader = ({ section: { isFirst } }) => {
    return !isFirst ? <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} /> : null
  }

  onPress = (type) => {
    this.requestPassword(type)
  }

  requestPassword = (requestPasswordAction) => {
    this.setState({ showPrompt: true, showSimpleModal: false, password: '', requestPasswordAction })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

  clearPassword = () => {
    this.setState({ password: '', showPrompt: false })
  }

  submitPassword = () => {
    this.setState({ showPrompt: false })
    const type = this.state.requestPasswordAction

    switch (type) {
      case 'mnemonic':
        this.backupIdentity()
        return
      case 'delete':
        this.deleteIdentity()
        return
    }
  }

  hidePrompt = () => {
    this.setState({ showPrompt: false })
  }

  renderItem = ({ item, index }) => {
    if (item.actionType) {
      return (
        <TouchableNativeFeedback onPress={this.onPress.bind(this, item.actionType)} background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2, height: 48 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
                <Text style={{ fontSize: 14, color: item.actionType === 'delete' ? '#FF5722' : 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{item.text}</Text>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2, height: 48 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{item.text}</Text>
            </View>
            <View style={{ position: 'absolute', right: 16 }}>
              {item.type === 'avatar' && <Image source={require('resources/images/profile_placeholder_android.png')} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.12)' }} />}
              {item.type !== 'avatar' && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', maxWidth: 300, textAlign: 'right' }}>{item.detail}</Text>}
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    const { intl, identity, backupIdentity, deleteIdentity } = this.props
    const id = identity.id
    const backupIdentityLoading = backupIdentity.loading
    const deleteIdentityLoading = deleteIdentity.loading
    const loading = backupIdentityLoading || deleteIdentityLoading

    const sections = []
    sections.push({ data: [{ key: 'avatar', type: 'avatar', text: intl.formatMessage({ id: 'identity_text_avatar' }) }, { key: 'name', type: 'name', text: intl.formatMessage({ id: 'identity_text_name' }), detail: identity.name }, { type: 'identifier', text: intl.formatMessage({ id: 'identity_text_id' }), detail: identity.identifier }] })
    sections.push({ data: [{ key: 'mnemonic', actionType: 'mnemonic', text: intl.formatMessage({ id: 'identity_button_backup_identity' }) }, { key: 'delete', actionType: 'delete', text: intl.formatMessage({ id: 'identity_button_delete_identity' }) }] })
    sections[0].isFirst = true

    return (
      <View style={{ flex: 1, paddingTop: 12, backgroundColor: 'white' }}>
        <SectionList
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          sections={sections}
          keyExtractor={(item, index) => item.key}
        />
        <IndicatorModal onModalHide={this.onModalHide} isVisible={loading} message={t(this,'pwd_verify')} />
        <Modal
          isVisible={this.state.showPrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>{t(this,'pwd_enter')}</Text>
                {/* <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', marginBottom: 12 }}>This is a prompt</Text> */}
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 0,
                    width: '100%',
                    borderBottomWidth: 2,
                    borderColor: '#169689'
                  }}
                  autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholder="Password"
                  keyboardType="default"
                  secureTextEntry={true}
                  onChangeText={this.changePassword}
                  onSubmitEditing={this.submitPassword}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.clearPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'button_cancel')}</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'button_ok')}</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
