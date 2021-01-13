import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Text, Image, Alert, Dimensions, TouchableNativeFeedback, UIManager } from 'react-native'
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
      return gt('invalid_mnemonic')
    case 'Invalid WIF length':
    case 'Invalid compression flag':
    case 'private key length is invalid':
    case 'Invalid checksum':
      return gt('invalid_pk')
    case 'SegWit requires compressed private key':
      return gt('format_segwit_publickey')
    case 'Wallet already exist':
      return gt('wallet_exsited')
    default:
      return gt('import_failed')
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.mnemonic) {
    errors.mnemonic = gt('mnemonic_caution_enter')
  }

  if (!values.password) {
    errors.password = gt('pwd_enter')
  } else if (values.password && values.password.length < 8) {
    errors.password = gt('pwd_error_tooshort')
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = gt('pwd_confirm')
  }else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = gt('pwd_confirm_matcherror');
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
    importBTCPrivateKey: state.importBTCPrivateKey,
    formSyncWarnings: getFormSyncWarnings('importBTCPrivateKeyForm')(state),
    formValues: getFormValues('importBTCPrivateKeyForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'importBTCPrivateKeyForm', validate, shouldError, warn })

export default class ImportBTCPrivateKeyForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importBTCPrivateKey.loading !== prevState.importBTCPrivateKeyLoading
      || nextProps.importBTCPrivateKey.error !== prevState.importBTCPrivateKeyError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importBTCPrivateKeyLoading: nextProps.importBTCPrivateKey.loading,
        importBTCPrivateKeyError: nextProps.importBTCPrivateKey.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    invalid: false,
    pristine: false,
    importBTCPrivateKeyLoading: false,
    importBTCPrivateKeyError: null,
    activeIndex: null
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importBTCPrivateKeyLoading !== this.state.importBTCPrivateKeyLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 1)
    ) {
      if (this.props.componentId) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'submit',
                icon: require('resources/images/check_android.png'),
                enabled: !this.state.invalid && !this.state.pristine && !this.state.importBTCPrivateKeyLoading
              }
            ]
          }
        })
      }
    }
  }

  clearError = () => {
    this.props.actions.importBTCPrivateKey.clearError()
  }

  onModalHide = () => {
    const error = this.state.importBTCPrivateKeyError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: t(this,'button_ok'), onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  onModalShow = () => {

  }

  changeAddressType = (isSegWit) => {
    if (this.props.changeAddressType) this.props.changeAddressType(isSegWit)
  }

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'importBTCPrivateKeyForm', field }
          }
        }]
      }
    })
  }

  render() {
    const { intl, formValues, change, isSegWit } = this.props
    const privateKey = formValues && formValues.privateKey
    const password = formValues && formValues.password
    const passwordConfirm = formValues && formValues.passwordConfirm
    const passwordHint = formValues && formValues.passwordHint

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: '100%' }}>
              <Field
                label={t(this,'pk_privatekey')}
                name="privateKey"
                fieldName="privateKey"
                component={FilledTextArea}
                nonEmpty={!!privateKey && privateKey.length > 0}
                change={change}
                separator={true}
                trailingIcon={<TouchableNativeFeedback onPress={this.scan.bind(this, 'privateKey')} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
            </View>
            <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'select_addr_type')}</Text>
              </View>
              <TouchableNativeFeedback onPress={this.changeAddressType.bind(this, true)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                  {isSegWit && <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  {!isSegWit && <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{t(this,'segwit')}</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={this.changeAddressType.bind(this, false)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                  {!isSegWit && <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  {isSegWit && <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{t(this,'ordinary')}</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'pwd_set')}</Text>
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
              label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd_confirm' })}
              placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
              name="passwordConfirm"
              fieldName="passwordConfirm"
              component={FilledTextField}
              nonEmpty={!!passwordConfirm && passwordConfirm.length > 0}
              change={change}
              secureTextEntry
              separator={true}
            />
            {/*<Field*/}
            {/*  label={intl.formatMessage({ id: 'identity_input_label_passwd_hint' })}*/}
            {/*  placeholder={intl.formatMessage({ id: 'identity_input_placeholder_label_passwd_hint' })}*/}
            {/*  name="passwordHint"*/}
            {/*  fieldName="passwordHint"*/}
            {/*  component={FilledTextField}*/}
            {/*  nonEmpty={!!passwordHint && passwordHint.length > 0}*/}
            {/*  change={change}*/}
            {/*  separator={false}*/}
            {/*/>*/}
          </View>
          <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 16, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>{t(this,'import_pwd_reset_hint')}</Text>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.importBTCPrivateKeyLoading} message={t(this,'import_importing')} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
