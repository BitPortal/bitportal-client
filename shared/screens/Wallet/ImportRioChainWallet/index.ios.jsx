import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SegmentedControlIOS,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import Modal from 'react-native-modal'
import * as walletActions from 'actions/wallet'
import { DarkModeContext } from 'utils/darkMode'
import {PasswordStrong} from 'components/passwordExtension'


const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
  textFiled: {
    height: '100%',
    fontSize: 17,
    flex:1,
    // width: '100% - 138'
  },
  noLable: {
    width: '100% - 52'
  },
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  placeholder,
  separator,
  secureTextEntry,
  fieldName,
  change,
  showClearButton,
  editable,
  switchable,
  onSwitch,
  showStrongLevel,
  showEyes,
  onChangeEntry,
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    {!!label && !switchable && <Text style={{ fontSize: 17, marginRight: 16, width: 80, color: isDarkMode ? 'white' : 'black'  }}>{label}</Text>}
    {!!label && !!switchable &&
    <View style={{ borderRightWidth: 0.5, borderColor: '#C8C7CC', height: '100%', marginRight: 16, width: 70, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.7} onPress={onSwitch} style={{ width: 57, height: '100%', justifyContent: 'center' }}>
        <Text style={{ fontSize: 15, color: '#007AFF'}}>{label}</Text>
      </TouchableHighlight>
      <Image
        source={require('resources/images/arrowRight.png')}
        style={{ width: 8, height: 13, marginRight: 10 }}
      />
    </View>
    }
    <TextInput
      style={[styles.textFiled, !label ? styles.noLable : {}, { color: isDarkMode ? 'white' : 'black' }]}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      editable={typeof editable === 'boolean' ? editable : true}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: showStrongLevel || showEyes ? 55:16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {showStrongLevel && <PasswordStrong password={restInput.value || ''} style={{marginHorizontal:5}}/>}
    {showEyes && <View style={{ height: '100%',marginHorizontal:5, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={onChangeEntry}>
        <FastImage
          source={ secureTextEntry?require('resources/images/eyes_close.png') : require('resources/images/eyes_open.png')}
          style={{ width: 24, height: 15 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const TextAreaField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  placeholder,
  fieldName,
  change,
  showClearButton,
  separator,
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 88, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <TextInput
      style={[styles.textAreaFiled, { color: isDarkMode ? 'white' : 'black' }]}
      placeholderTextColor={'#ADADAD'}
      multiline={true}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      {...restInput}
    />
    {showClearButton && active && <View style={{ position: 'absolute', right: 13, bottom: 4, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

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
    default:
      return gt('import_failed')
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.keystore) {
    errors.keystore = gt('keystore_enter')
  }

  if (!values.keystorePassword) {
    errors.keystorePassword = gt('keystore_pwd_enter')
  }

  if (!values.mnemonic) {
    errors.mnemonic = gt('mnemonic_caution_enter')
  }

  if (!values.password) {
    errors.password = gt('pwd_enter')
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = gt('pwd_confirm')
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  if (values.password && values.password.length < 8) {
    warnings.password = gt('pwd_error_tooshort')
  }
  if (values.password !== values.passwordConfirm) {
    warnings.passwordConfirm = gt('pwd_confirm_matcherror');
  }

  return warnings
}

const shouldError = () => true

@reduxForm({ form: 'importRioChainWalletForm', validate, shouldError, warn })

@connect(
  state => ({
    importRioChainKeystore: state.importRioChainKeystore,
    importRioChainMnemonics: state.importRioChainMnemonics,
    formSyncWarnings: getFormSyncWarnings('importRioChainWalletForm')(state),
    formValues: getFormValues('importRioChainWalletForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class ImportRioChainWallet extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'submit',
            text: gt('button_confirm'),
            fontWeight: '400',
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        backButton: {
          title: gt('button_back')
        },
        title: {
          text: gt('import_wallet_rio')
        },
        noBorder: true,
        drawBehind: false
      },
      bottomTabs: {
        visible: false
      }
    }
  }
  static contextType = DarkModeContext
  static getDerivedStateFromProps(nextProps, prevState) {

    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.importRioChainKeystore.loading !== prevState.importRioChainKeystoreLoading
      || nextProps.importRioChainMnemonics.loading !== prevState.importRioChainMnemonicsLoading
      || nextProps.importRioChainMnemonics.error !== prevState.importRioChainMnemonicsError
      || nextProps.importRioChainKeystore.error !== prevState.importRioChainKeystoreError
    ) {

      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importRioChainKeystoreLoading: nextProps.importRioChainKeystore.loading,
        importRioChainMnemonicsLoading: nextProps.importRioChainMnemonics.loading,
        importRioChainMnemonicsError: nextProps.importRioChainMnemonics.error,
        importRioChainKeystoreError: nextProps.importRioChainKeystore.error
      }
    } else {
      return null
    }
  }

  state = {
    selectedIndex: 0,
    importRioChainMnemonicsLoading: false,
    importRioChainKeystoreLoading: false,
    invalid: false,
    pristine: false,
    importRioChainMnemonicsError: null,
    importRioChainKeystoreError: null,
    pathEditable: false,
    pathSwitchLabel: gt('default'),
    secureTextEntry:true,
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      const { formSyncWarnings } = this.props
      if (typeof formSyncWarnings === 'object') {
        const warning = formSyncWarnings.password || formSyncWarnings.passwordConfirm
        if (warning) {
          Alert.alert(
            warning,
            '',
            [
              { text: t(this,'button_ok'), onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      Keyboard.dismiss()
      this.props.handleSubmit(this.submit)()
    }
  }

  submit = (data) => {
    if (this.state.selectedIndex === 0) {
      delete data.privateKey
      delete data.path
      delete data.mnemonic
      this.props.actions.importRioChainKeystore.requested({ ...data, componentId: this.props.componentId, delay: 500 })
    } else if (this.state.selectedIndex === 1) {
      delete data.privateKey
      delete data.keystorePrivateKey
      delete data.keystore
      this.props.actions.importRioChainMnemonics.requested({ ...data, componentId: this.props.componentId, delay: 500 })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importRioChainKeystoreLoading !== this.state.importRioChainKeystoreLoading
      || prevState.importRioChainMnemonicsLoading !== this.state.importRioChainMnemonicsLoading
      || prevState.selectedIndex !== this.state.selectedIndex
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              text: t(this,'button_confirm'),
              fontWeight: '400',
              enabled: !this.state.invalid && !this.state.pristine && !((prevState.selectedIndex === 0 && this.state.importRioChainKeystoreLoading) || (prevState.selectedIndex === 1 && this.state.importRioChainMnemonicsLoading))
            }
          ]
        }
      })
    }
  }

  clearError = () => {
    if (this.state.selectedIndex === 0) {
      this.props.actions.importRioChainKeystore.clearError()
    } else if (this.state.selectedIndex === 1) {
      this.props.actions.importRioChainMnemonics.clearError()
    }
  }

  onModalHide = () => {
    const error = this.state.importRioChainMnemonicsError || this.state.importRioChainKeystoreError

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

  changeSelectedIndex = (e) => {
    this.setState({ selectedIndex: e.nativeEvent.selectedSegmentIndex })
  }

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'importRioChainWalletForm', field }
          }
        }]
      }
    })
  }

  resetEntry = () => this.setState({secureTextEntry:!this.state.secureTextEntry})

  render() {
    const { formValues, change } = this.props
    const mnemonic = formValues && formValues.mnemonic
    const keystore = formValues && formValues.keystore
    const keystorePassword = formValues && formValues.keystorePassword
    const password = formValues && formValues.password
    const passwordConfirm = formValues && formValues.passwordConfirm
    const passwordHint = formValues && formValues.passwordHint
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ height: 52, width: '100%', justifyContent: 'center', paddingTop: 5, paddingBottom: 13, paddingLeft: 16, paddingRight: 16, backgroundColor: isDarkMode ? 'black' : '#F7F7F7', borderColor: '#C8C7CC', borderBottomWidth: 0.5 }}>
            <SegmentedControlIOS
              values={['Keystore', t(this,'mnemonic')]}
              selectedIndex={this.state.selectedIndex}
              onChange={this.changeSelectedIndex}
              style={{ width: '100%' }}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
    {this.state.selectedIndex === 0 && <Text style={{ fontSize: 13, color: '#666666' }}>{t(this,'keystore_content')}</Text>}
    {this.state.selectedIndex === 1 && <Text style={{ fontSize: 13, color: '#666666' }}>{t(this,'mnemonic_enter')}</Text>}
              </View>
              {this.state.selectedIndex === 0 && <Fragment>
                <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : '#F7F7F7' }}>
                  <Field
                    placeholder={t(this,'required')}
                    name="keystore"
                    fieldName="keystore"
                    component={TextAreaField}
                    change={change}
                    isDarkMode={isDarkMode}
                    showClearButton={!!keystore && keystore.length > 0}
                  />
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.scan.bind(this, 'keystore')} style={{ width: 30, height: 30, position: 'absolute', right: 16, top: 4 }} activeOpacity={0.42}>
                    <FastImage
                      source={require('resources/images/scan2_right.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableHighlight>
                </View>
                <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: '#666666' }}>{t(this,'keystore_pwd')}</Text>
                </View>
                <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : '#F7F7F7' }}>
                  <Field
                    placeholder={t(this,'required')}
                    name="keystorePassword"
                    fieldName="keystorePassword"
                    change={change}
                    component={TextField}
                    showClearButton={!!keystorePassword && keystorePassword.length > 0}
                    isDarkMode={isDarkMode}
                    secureTextEntry
                  />
                </View>
              </Fragment>}
              {this.state.selectedIndex === 1 && <Fragment>
                <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : '#F7F7F7' }}>
                  <Field
                    placeholder={t(this,'mnemonic_caution_separate')}
                    name="mnemonic"
                    fieldName="mnemonic"
                    component={TextAreaField}
                    change={change}
                    isDarkMode={isDarkMode}
                    showClearButton={!!mnemonic && mnemonic.length > 0}
                  />
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.scan.bind(this, 'mnemonic')} style={{ width: 30, height: 30, position: 'absolute', right: 16, top: 4 }} activeOpacity={0.42}>
                    <FastImage
                      source={require('resources/images/scan2_right.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableHighlight>
                </View>
              </Fragment>}
              {this.state.selectedIndex !== 0 && <Fragment>
                <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: '#666666' }}>{t(this,'pwd_set')}</Text>
                </View>
                <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : '#F7F7F7' }}>
                  <Field
                    label={t(this,'pwd_wallet')}
                    placeholder={t(this,'pwd_enter')}
                    name="password"
                    fieldName="password"
                    change={change}
                    component={TextField}
                    separator={true}
                    isDarkMode={isDarkMode}
                    showClearButton={!!password && password.length > 0}
                    showStrongLevel
                    secureTextEntry={this.state.secureTextEntry}
                  />
                  <Field
                    label={t(this,'pwd_confirm_confirm')}
                    placeholder={t(this,'pwd_confirm')}
                    name="passwordConfirm"
                    fieldName="passwordConfirm"
                    change={change}
                    component={TextField}
                    separator={false}
                    isDarkMode={isDarkMode}
                    showClearButton={!!passwordConfirm && passwordConfirm.length > 0}
                    secureTextEntry={this.state.secureTextEntry}
                    showEyes={true}
                    onChangeEntry={this.resetEntry}
                  />
                  {/*<Field*/}
                  {/*  label={t(this,'pwd_set_hint')}*/}
                  {/*  placeholder={t(this,'optional')}*/}
                  {/*  name="passwordHint"*/}
                  {/*  fieldName="passwordHint"*/}
                  {/*  change={change}*/}
                  {/*  component={TextField}*/}
                  {/*  showClearButton={!!passwordHint && passwordHint.length > 0}*/}
                  {/*  isDarkMode={isDarkMode}*/}
                  {/*  separator={false}*/}
                  {/*/>*/}
                </View>
                <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-start' }}>
                  <Text children={t(this,'identity_input_placeholder_wallet_passwd')} style={{
                    marginVertical:5,
                    fontSize:13,
                    color:'#666666',
                  }}/>
                  <Text style={{ fontSize: 13, color: '#666666', lineHeight: 18 }}>{t(this,'import_pwd_reset_hint')}</Text>
                </View>
              </Fragment>}
            </View>
          </ScrollView>
          <Modal
            isVisible={this.state.importRioChainMnemonicsLoading || this.state.importRioChainKeystoreLoading}
            backdropOpacity={0.4}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
            onModalHide={this.onModalHide}
            onModalShow={this.onModalShow}
          >
            {(this.state.importRioChainMnemonicsLoading || this.state.importRioChainKeystoreLoading) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ActivityIndicator size="small" color="#000000" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{t(this,'import_importing')}</Text>
              </View>
            </View>}
          </Modal>
        </View>
      </SafeAreaView>
    )
  }
}
