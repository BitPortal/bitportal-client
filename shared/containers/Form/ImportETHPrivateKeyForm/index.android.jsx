import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Text, Image, Alert, Dimensions, TouchableNativeFeedback, Keyboard } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import * as walletActions from 'actions/wallet'
import { FilledTextField, FilledTextArea } from 'components/Form'
import IndicatorModal from 'components/Modal/IndicatorModal'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid mnemonics':
      return gt('无效的助记词')
    case 'Invalid keystore':
    case 'No keystore crypto':
    case 'No keystore crypto cipherparams':
    case 'No keystore crypto ciphertext':
    case 'No keystore crypto cipher':
    case 'No keystore crypto cipherparams iv':
      return gt('无效的 Keystore')
    case 'Invalid mnemonic path':
    case 'Invalid mnemonic path elements length':
    case 'Invalid mnemonic path 3th element':
    case 'Invalid mnemonic path 4th element':
    case 'Invalid mnemonic path 5th element':
    case 'Invalid index':
      return gt('无效的路径')
    case 'Invalid password':
      return 'Keystore 密码错误'
    case 'Keystore already exist in imported wallets':
    case 'Keystore already exist in identity wallets':
    case 'Wallet already exist':
      return gt('该钱包已存在')
    case 'Invalid WIF length':
    case 'Invalid compression flag':
    case 'private key length is invalid':
    case 'Invalid checksum':
      return gt('无效的私钥')
    default:
      return gt('导入失败')
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.privateKey) {
    errors.privateKey = gt('请输入助记词')
  }

  if (!values.password) {
    errors.password = gt('请输入密码')
  } else if (values.password && values.password.length < 8) {
    errors.password = gt('密码不少于8位字符')
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
    importETHPrivateKey: state.importETHPrivateKey,
    formSyncWarnings: getFormSyncWarnings('importETHPrivateKeyForm')(state),
    formValues: getFormValues('importETHPrivateKeyForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'importETHPrivateKeyForm', validate, shouldError, warn })

export default class ImportETHPrivateKeyForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importETHPrivateKey.loading !== prevState.importETHPrivateKeyLoading
      || nextProps.importETHPrivateKey.error !== prevState.importETHPrivateKeyError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importETHPrivateKeyLoading: nextProps.importETHPrivateKey.loading,
        importETHPrivateKeyError: nextProps.importETHPrivateKey.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    invalid: false,
    pristine: false,
    importETHPrivateKeyLoading: false,
    importETHPrivateKeyError: null,
    activeIndex: null,
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importETHPrivateKeyLoading !== this.state.importETHPrivateKeyLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 2)
    ) {
      if (this.props.componentId) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'submit',
                icon: require('resources/images/check_android.png'),
                enabled: !this.state.invalid && !this.state.pristine && !this.state.importETHPrivateKeyLoading
              }
            ]
          }
        })
      }
    }
  }

  clearError = () => {
    this.props.actions.importETHPrivateKey.clearError()
  }

  onModalHide = () => {
    const error = this.state.importETHPrivateKeyError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: t(this,'确定'), onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  componentDidMount() {

  }

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'importETHPrivateKeyForm', field }
          }
        }]
      }
    })
  }

  render() {
    const { intl, formValues, change, isSegWit } = this.props
    const privateKey = formValues && formValues.privateKey
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: '100%' }}>
              <Field
                label={t(this,'私钥')}
                name="privateKey"
                fieldName="privateKey"
                component={FilledTextArea}
                nonEmpty={!!privateKey && privateKey.length > 0}
                change={change}
                trailingIcon={<TouchableNativeFeedback onPress={this.scan.bind(this, 'privateKey')} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'设置密码')}</Text>
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
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>{t(this,'如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。')}</Text>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.importETHPrivateKeyLoading} message={t(this,'导入中...')} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
