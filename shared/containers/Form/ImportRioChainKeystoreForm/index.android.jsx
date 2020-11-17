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
    case 'Invalid password':
      return gt('Keystore 密码错误')
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

  if (!values.keystore) {
    errors.keystore = gt('请输入keystore')
  }

  if (!values.keystorePassword) {
    errors.keystorePassword = gt('请输入密码')
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
    importRioChainKeystore: state.importRioChainKeystore,
    formSyncWarnings: getFormSyncWarnings('importRioChainKeystoreForm')(state),
    formValues: getFormValues('importRioChainKeystoreForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'importRioChainKeystoreForm', validate, shouldError, warn })

export default class ImportRioChainKeystoreForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importRioChainKeystore.loading !== prevState.importRioChainKeystoreLoading
      || nextProps.importRioChainKeystore.error !== prevState.importRioChainKeystoreError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importRioChainKeystoreLoading: nextProps.importRioChainKeystore.loading,
        importRioChainKeystoreError: nextProps.importRioChainKeystore.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    invalid: false,
    pristine: false,
    importRioChainKeystoreLoading: false,
    importRioChainKeystoreError: null,
    activeIndex: null,
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importRioChainKeystoreLoading !== this.state.importRioChainKeystoreLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 0)
    ) {
      if (this.props.componentId) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'submit',
                icon: require('resources/images/check_android.png'),
                enabled: !this.state.invalid && !this.state.pristine && !this.state.importRioChainKeystoreLoading
              }
            ]
          }
        })
      }
    }
  }

  clearError = () => {
    this.props.actions.importRioChainKeystore.clearError()
  }

  onModalHide = () => {
    const error = this.state.importRioChainKeystoreError

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
            passProps: { from: 'import', form: 'importRioChainKeystoreForm', field }
          }
        }]
      }
    })
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
                label={t(this,'Keystore 文件内容')}
                name="keystore"
                fieldName="keystore"
                component={FilledTextArea}
                nonEmpty={!!keystore && keystore.length > 0}
                change={change}
                separator={true}
                trailingIcon={<TouchableNativeFeedback onPress={this.scan.bind(this, 'keystore')} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
            </View>
            <Field
              label={t(this,'Keystore 密码')}
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
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>{t(this,'如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。')}</Text>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.importRioChainKeystoreLoading} message={t(this,'导入中...')} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
