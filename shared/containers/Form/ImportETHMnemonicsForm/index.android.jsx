import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Text, Image, Alert, Dimensions, TouchableNativeFeedback, Keyboard } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import * as walletActions from 'actions/wallet'
import { FilledTextField, FilledTextArea } from 'components/Form'
import Modal from 'react-native-modal'
import IndicatorModal from 'components/Modal/IndicatorModal'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid mnemonics':
      return '无效的助记词'
    case 'Invalid keystore':
    case 'No keystore crypto':
    case 'No keystore crypto cipherparams':
    case 'No keystore crypto ciphertext':
    case 'No keystore crypto cipher':
    case 'No keystore crypto cipherparams iv':
      return '无效的 Keystore'
    case 'Invalid mnemonic path':
    case 'Invalid mnemonic path elements length':
    case 'Invalid mnemonic path 3th element':
    case 'Invalid mnemonic path 4th element':
    case 'Invalid mnemonic path 5th element':
    case 'Invalid index':
      return '无效的路径'
    case 'Invalid password':
      return 'Keystore 密码错误'
    case 'Keystore already exist in imported wallets':
    case 'Keystore already exist in identity wallets':
    case 'Wallet already exist':
      return '该钱包已存在'
    case 'Invalid WIF length':
    case 'Invalid compression flag':
    case 'private key length is invalid':
    case 'Invalid checksum':
      return '无效的私钥'
    default:
      return '导入失败'
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.mnemonic) {
    errors.mnemonic = '请输入助记词'
  }

  if (!values.path) {
    errors.path = '请输入路径'
  }

  if (!values.password) {
    errors.password = '请输入密码'
  } else if (values.password && values.password.length < 8) {
    errors.password = '密码不少于8位字符'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  return warnings
}

const shouldError = () => true

@injectIntl

@connect(
  state => ({
    importETHMnemonics: state.importETHMnemonics,
    formSyncWarnings: getFormSyncWarnings('importETHMnemonicsForm')(state),
    formValues: getFormValues('importETHMnemonicsForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'importETHMnemonicsForm', validate, shouldError, warn })

export default class ImportETHMnemonicsForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importETHMnemonics.loading !== prevState.importETHMnemonicsLoading
      || nextProps.importETHMnemonics.error !== prevState.importETHMnemonicsError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importETHMnemonicsLoading: nextProps.importETHMnemonics.loading,
        importETHMnemonicsError: nextProps.importETHMnemonics.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    invalid: false,
    pristine: false,
    importETHMnemonicsLoading: false,
    importETHMnemonicsError: null,
    activeIndex: null,
    pathEditable: false,
    pathSwitchLabel: '默认',
    showSimpleModal: false,
    pathIndex: 1
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importETHMnemonicsLoading !== this.state.importETHMnemonicsLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 1)
    ) {
      if (this.props.componentId) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'submit',
                icon: require('resources/images/check_android.png'),
                enabled: !this.state.invalid && !this.state.pristine && !this.state.importETHMnemonicsLoading
              }
            ]
          }
        })
      }
    }
  }

  clearError = () => {
    this.props.actions.importETHMnemonics.clearError()
  }

  onModalHide = () => {
    const error = this.state.importETHMnemonicsError

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

  componentDidMount() {
    this.props.initialize({
      path: `m/44'/60'/0'/0/0`
    })
  }

  scan = (field) => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.Camera',
     *         passProps: { from: 'import', form: 'importETHWalletForm', field }
     *       }
     *     }]
     *   }
     * })*/
  }

  onSwitchPath = (buttonIndex) => {
    const editable = this.state.pathEditable
    this.setState({ pathEditable: false, showSimpleModal: false })

    if (buttonIndex === 1) {
      this.props.change('path', `m/44'/60'/0'/0/0`)
      this.setState({ pathEditable: false, pathSwitchLabel: '默认', pathIndex: 1 })
    } else if (buttonIndex === 2) {
      this.props.change('path', `m/44'/60'/0'/0`)
      this.setState({ pathEditable: false, pathSwitchLabel: 'Ledger', pathIndex: 2 })
    } else if (buttonIndex === 3) {
      this.props.change('path', `m/44'/60'/1'/0/0`)
      this.setState({ pathEditable: true, pathSwitchLabel: '自定义', pathIndex: 3 })
    } else {
      this.setState({ pathEditable: editable })
    }
  }

  showSwitchPath = () => {
    this.setState({ showSimpleModal: true })

    if (this.state.pathIndex === 3) {
      Keyboard.dismiss()
      this.props.blur('path')
    }
  }

  onBackdropPress = () => {
    this.setState({ showSimpleModal: false })
  }

  render() {
    const { intl, formValues, change, isSegWit } = this.props
    const mnemonic = formValues && formValues.mnemonic
    const path = formValues && formValues.path
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: '100%' }}>
              <Field
                label="助记词"
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_mnemonics' })}
                name="mnemonic"
                fieldName="mnemonic"
                component={FilledTextArea}
                nonEmpty={!!mnemonic && mnemonic.length > 0}
                change={change}
                separator={true}
                trailingIcon={<TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <FastImage source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
            </View>
            <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>选择路径</Text>
              </View>
              <Field
                label="当前路径"
                switchLabel={this.state.pathSwitchLabel}
                name="path"
                fieldName="path"
                component={FilledTextField}
                nonEmpty={!!path && path.length > 0}
                change={change}
                selectable
                editable={this.state.pathEditable}
                onSwitch={this.showSwitchPath}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>设置密码</Text>
            </View>
            <Field
              label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd' })}
              placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
              name="password"
              fieldName="password"
              component={FilledTextField}
              nonEmpty={!!password && password.length > 0}
              change={change}
              secureTextEntry
              separator={true}
            />
            <Field
              label={intl.formatMessage({ id: 'identity_input_label_passwd_hint' })}
              placeholder={intl.formatMessage({ id: 'identity_input_placeholder_label_passwd_hint' })}
              name="passwordHint"
              fieldName="passwordHint"
              component={FilledTextField}
              nonEmpty={!!passwordHint && passwordHint.length > 0}
              change={change}
              separator={false}
            />
          </View>
          <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 16, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。</Text>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.importETHMnemonicsLoading} message="导入中..." onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
        <Modal
          isVisible={this.state.showSimpleModal}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
          onBackdropPress={this.onBackdropPress}
        >
          {(this.state.showSimpleModal) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 4, alignItem: 'center', elevation: 14, minWidth: 240 }}>
              <View style={{ paddingHorizontal: 24, paddingBottom: 9, paddingTop: 20 }}>
                <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>选择路径</Text>
              </View>
              <View style={{ paddingBottom: 12, paddingTop: 6, paddingHorizontal: 16 }}>
                <TouchableNativeFeedback onPress={this.onSwitchPath.bind(this, 1)} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingRight: 8 }}>
                    {this.state.pathIndex === 1 ? <FastImage source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <FastImage source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>m/44'/60'/0'/0/0 默认</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.onSwitchPath.bind(this, 2)} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingRight: 8 }}>
                    {this.state.pathIndex === 2 ? <FastImage source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <FastImage source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>m/44'/60'/0'/0 Ledger</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.onSwitchPath.bind(this, 3)} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingRight: 8 }}>
                    {this.state.pathIndex === 3 ? <FastImage source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <FastImage source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>m/44'/60'/1'/0/0 自定义路径</Text>
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
