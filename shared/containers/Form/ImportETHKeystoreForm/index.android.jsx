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

  if (!values.keystore) {
    errors.keystore = '请输入keystore'
  }

  if (!values.keystorePassword) {
    errors.keystorePassword = '请输入密码'
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
    importETHKeystore: state.importETHKeystore,
    formSyncWarnings: getFormSyncWarnings('importETHKeystoreForm')(state),
    formValues: getFormValues('importETHKeystoreForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'importETHKeystoreForm', validate, shouldError, warn })

export default class ImportETHKeystoreForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importETHKeystore.loading !== prevState.importETHKeystoreLoading
      || nextProps.importETHKeystore.error !== prevState.importETHKeystoreError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importETHKeystoreLoading: nextProps.importETHKeystore.loading,
        importETHKeystoreError: nextProps.importETHKeystore.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    invalid: false,
    pristine: false,
    importETHKeystoreLoading: false,
    importETHKeystoreError: null,
    activeIndex: null,
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importETHKeystoreLoading !== this.state.importETHKeystoreLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 0)
    ) {
      if (this.props.componentId) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'submit',
                icon: require('resources/images/check_android.png'),
                enabled: !this.state.invalid && !this.state.pristine && !this.state.importETHKeystoreLoading
              }
            ]
          }
        })
      }
    }
  }

  clearError = () => {
    this.props.actions.importETHKeystore.clearError()
  }

  onModalHide = () => {
    const error = this.state.importETHKeystoreError

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

  render() {
    const { intl, formValues, change, isSegWit } = this.props
    const keystore = formValues && formValues.keystore
    const keystorePassword = formValues && formValues.keystorePassword

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: '100%' }}>
              <Field
                label="Keystore 文件内容"
                name="keystore"
                fieldName="keystore"
                component={FilledTextArea}
                nonEmpty={!!keystore && keystore.length > 0}
                change={change}
                separator={true}
                trailingIcon={<TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
            </View>
            <Field
              label="Keystore 密码"
              placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
              name="keystorePassword"
              fieldName="keystorePassword"
              component={FilledTextField}
              nonEmpty={!!keystorePassword && keystorePassword.length > 0}
              change={change}
              secureTextEntry
              separator={true}
            />
          </View>
          <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 16, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。</Text>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.importETHKeystoreLoading} message="导入中..." onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
