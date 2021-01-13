import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Text, Image, Alert, Dimensions, TouchableNativeFeedback, Keyboard } from 'react-native'
import { Navigation } from 'components/Navigation'

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
      return gt('invalid_mnemonic')
    case 'Invalid keystore':
    case 'No keystore crypto':
    case 'No keystore crypto cipherparams':
    case 'No keystore crypto ciphertext':
    case 'No keystore crypto cipher':
    case 'No keystore crypto cipherparams iv':
      return gt('invalid_keystore')
    case 'Invalid password':
      return gt('keystore_error_pwd')
    case 'Keystore already exist in imported wallets':
    case 'Keystore already exist in identity wallets':
    case 'Wallet already exist':
      return gt('wallet_exsited')
    case 'Invalid WIF length':
    case 'Invalid compression flag':
    case 'private key length is invalid':
    case 'Invalid checksum':
      return gt('invalid_pk')
    default:
      return gt('import_failed')
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.mnemonic) {
    errors.mnemonic = gt('mnemonic_caution_enter')
  }

  if (!values.path) {
    errors.path = gt('path_enter')
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
    importRioChainMnemonics: state.importRioChainMnemonics,
    formSyncWarnings: getFormSyncWarnings('importRioChainMnemonicsForm')(state),
    formValues: getFormValues('importRioChainMnemonicsForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'importRioChainMnemonicsForm', validate, shouldError, warn })

export default class ImportRioChainMnemonicsForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importRioChainMnemonics.loading !== prevState.importRioChainMnemonicsLoading
      || nextProps.importRioChainMnemonics.error !== prevState.importRioChainMnemonicsError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importRioChainMnemonicsLoading: nextProps.importRioChainMnemonics.loading,
        importRioChainMnemonicsError: nextProps.importRioChainMnemonics.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    invalid: false,
    pristine: false,
    importRioChainMnemonicsLoading: false,
    importRioCHainMnemonicsError: null,
    activeIndex: null,
    pathEditable: false,
    pathSwitchLabel: gt('default'),
    showSimpleModal: false,
    pathIndex: 1
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importRioChainMnemonicsLoading !== this.state.importRioChainMnemonicsLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 1)
    ) {
      if (this.props.componentId) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'submit',
                icon: require('resources/images/check_android.png'),
                enabled: !this.state.invalid && !this.state.pristine && !this.state.importRioChainMnemonicsLoading
              }
            ]
          }
        })
      }
    }
  }

  clearError = () => {
    this.props.actions.importRioChainMnemonics.clearError()
  }

  onModalHide = () => {
    const error = this.state.importRioChainMnemonicsError

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

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'importRioChainMnemonicsForm', field }
          }
        }]
      }
    })
  }

  onBackdropPress = () => {
    this.setState({ showSimpleModal: false })
  }

  render() {
    const { intl, formValues, change, isSegWit } = this.props
    const mnemonic = formValues && formValues.mnemonic
    const path = formValues && formValues.path
    const password = formValues && formValues.password
    const passwordConfirm = formValues && formValues.passwordConfirm
    const passwordHint = formValues && formValues.passwordHint

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: '100%' }}>
              <Field
                label={t(this,'mnemonic')}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_mnemonics' })}
                name="mnemonic"
                fieldName="mnemonic"
                component={FilledTextArea}
                nonEmpty={!!mnemonic && mnemonic.length > 0}
                change={change}
                separator={true}
                trailingIcon={<TouchableNativeFeedback onPress={this.scan.bind(this, 'mnemonic')} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
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
        <IndicatorModal isVisible={this.state.importRioChainMnemonicsLoading} message={t(this,'import_importing')} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
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
                <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{t(this,'path_select')}</Text>
              </View>
              <View style={{ paddingBottom: 12, paddingTop: 6, paddingHorizontal: 16 }}>
                <TouchableNativeFeedback onPress={this.onSwitchPath.bind(this, 1)} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingRight: 8 }}>
                    {this.state.pathIndex === 1 ? <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>m/44'/60'/0'/0/0 {t(this,'default')}</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.onSwitchPath.bind(this, 2)} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingRight: 8 }}>
                    {this.state.pathIndex === 2 ? <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>m/44'/60'/0'/0 Ledger</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.onSwitchPath.bind(this, 3)} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingRight: 8 }}>
                    {this.state.pathIndex === 3 ? <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>m/44'/60'/1'/0/0 {t(this,'path_custom')}</Text>
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
