import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  SegmentedControlIOS,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import Modal from 'react-native-modal'
import * as walletActions from 'actions/wallet'
import { DarkModeContext } from 'utils/darkMode'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
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
  },
  textFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 138'
  },
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
  },
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
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <Text style={{ fontSize: 17, marginRight: 16, width: 70, color: isDarkMode ? 'white' : 'dark' }}>{label}</Text>
    <TextInput
      style={[styles.textFiled, { color: isDarkMode ? 'white' : 'black'}]}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
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

const TextAreaField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  placeholder,
  fieldName,
  change,
  showClearButton,
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 88, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <TextInput
      style={[styles.textAreaFiled, { color: isDarkMode ? 'white' : 'black'}]}
      placeholderTextColor={isDarkMode ? 'white' : 'black'}
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
  </View>
)

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid mnemonics':
      return '无效的助记词'
    case 'Invalid WIF length':
    case 'Invalid compression flag':
    case 'private key length is invalid':
    case 'Invalid checksum':
      return '无效的私钥'
    case 'SegWit requires compressed private key':
      return '隔离见证需要压缩的公钥格式'
    case 'Wallet already exist':
      return '该钱包已存在'
    default:
      return '导入失败'
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.mnemonic) {
    errors.mnemonic = '请输入助记词'
  }

  if (!values.privateKey) {
    errors.privateKey = '请输入私钥'
  }

  if (!values.password) {
    errors.password = '请输入密码'
  }

  if (!values.passwordConfirm) {
    errors.password = gt('请输入确认密码');
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  if (values.password && values.password.length < 8) {
    warnings.password = '密码不少于8位字符'
  }
  const {password,passwordConfirm} = values || {};
  if (password && password !== passwordConfirm) {
    warnings.passwordConfirm = gt('两次密码输入不一致');
  }

  return warnings
}

const shouldError = () => true

@reduxForm({ form: 'importBTCWalletForm', validate, shouldError, warn })

@connect(
  state => ({
    importBTCMnemonics: state.importBTCMnemonics,
    importBTCPrivateKey: state.importBTCPrivateKey,
    formSyncWarnings: getFormSyncWarnings('importBTCWalletForm')(state),
    formValues: getFormValues('importBTCWalletForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class ImportBTCWallet extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'submit',
            text: '确认',
            fontWeight: '400',
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        backButton: {
          title: '返回'
        },
        title: {
          text: '导入BTC钱包'
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
      || nextProps.importBTCPrivateKey.loading !== prevState.importBTCPrivateKeyLoading
      || nextProps.importBTCMnemonics.loading !== prevState.importBTCMnemonicsLoading
      || nextProps.importBTCMnemonics.error !== prevState.importBTCMnemonicsError
      || nextProps.importBTCPrivateKey.error !== prevState.importBTCPrivateKeyError
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        importBTCPrivateKeyLoading: nextProps.importBTCPrivateKey.loading,
        importBTCMnemonicsLoading: nextProps.importBTCMnemonics.loading,
        importBTCPrivateKeyError: nextProps.importBTCPrivateKey.error,
        importBTCMnemonicsError: nextProps.importBTCMnemonics.error
      }
    } else {
      return null
    }
  }

  state = {
    selectedIndex: 0,
    isSegWit: true,
    importBTCPrivateKeyLoading: false,
    importBTCMnemonicsLoading: false,
    invalid: false,
    pristine: false,
    importBTCPrivateKeyError: null,
    importBTCMnemonicsError: null
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
              { text: '确定', onPress: () => console.log('OK Pressed') }
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
      this.props.actions.importBTCMnemonics.requested({ ...data, componentId: this.props.componentId, isSegWit: this.state.isSegWit, delay: 500 })
    } else {
      delete data.mnemonic
      this.props.actions.importBTCPrivateKey.requested({ ...data, componentId: this.props.componentId, isSegWit: this.state.isSegWit, delay: 500 })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.importBTCMnemonicsLoading !== this.state.importBTCMnemonicsLoading
      || prevState.importBTCPrivateKeyLoading !== this.state.importBTCPrivateKeyLoading
      || prevState.selectedIndex !== this.state.selectedIndex
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              text: '确认',
              fontWeight: '400',
              enabled: !this.state.invalid && !this.state.pristine && !(prevState.selectedIndex === 0 ? this.state.importBTCMnemonicsLoading : this.state.importBTCPrivateKeyLoading)
            }
          ]
        }
      })
    }
  }

  clearError = () => {
    if (this.state.selectedIndex === 0) {
      this.props.actions.importBTCMnemonics.clearError()
    } else {
      this.props.actions.importBTCPrivateKey.clearError()
    }
  }

  onModalHide = () => {
    const error = this.state.importBTCMnemonicsError || this.state.importBTCPrivateKeyError

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

  onModalShow = () => {

  }

  changeSelectedIndex = (e) => {
    this.setState({ selectedIndex: e.nativeEvent.selectedSegmentIndex })
  }

  changeAddressType = (isSegWit) => {
    this.setState({ isSegWit })
  }

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'importBTCWalletForm', field }
          }
        }]
      }
    })
  }

  render() {
    const { formValues, change } = this.props
    const mnemonic = formValues && formValues.mnemonic
    const privateKey = formValues && formValues.privateKey
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
              values={['助记词', '私钥']}
              selectedIndex={this.state.selectedIndex}
              onChange={this.changeSelectedIndex}
              style={{ width: '100%' }}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
                {this.state.selectedIndex === 0 && <Text style={{ fontSize: 13, color: '#666666' }}>输入助记词</Text>}
                {this.state.selectedIndex === 1 && <Text style={{ fontSize: 13, color: '#666666' }}>输入私钥</Text>}
              </View>
              {this.state.selectedIndex === 0 && <Fragment>
                <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : 'white' }}>
                  <Field
                    placeholder="用空格分隔"
                    name="mnemonic"
                    fieldName="mnemonic"
                    component={TextAreaField}
                    change={change}
                    showClearButton={!!mnemonic && mnemonic.length > 0}
                    scan={this.scan}
                    isDarkMode={isDarkMode}
                  />
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.scan.bind(this, 'mnemonic')} style={{ width: 30, height: 30, position: 'absolute', right: 16, top: 4 }} activeOpacity={0.42}>
                    <FastImage
                      source={require('resources/images/scan2_right.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableHighlight>
                </View>
              </Fragment>}
              {this.state.selectedIndex === 1 && <Fragment>
                <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : 'white' }}>
                  <Field
                    placeholder="必填"
                    name="privateKey"
                    fieldName="privateKey"
                    component={TextAreaField}
                    change={change}
                    showClearButton={!!privateKey && privateKey.length > 0}
                    isDarkMode={isDarkMode}
                  />
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.scan.bind(this, 'privateKey')} style={{ width: 30, height: 30, position: 'absolute', right: 16, top: 4 }} activeOpacity={0.42}>
                    <FastImage
                      source={require('resources/images/scan2_right.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableHighlight>
                </View>
              </Fragment>}
              <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#666666' }}>选择地址类型</Text>
              </View>
              <View style={{ width: '100%', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : 'white' }}>
                <TouchableHighlight underlayColor={isDarkMode ? 'black' : '#D9D9D9'} style={{ width: '100%', height: 44 }} onPress={this.changeAddressType.bind(this, true)}>
                  <View style={{ height: 44, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                    <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'dark' }}>隔离见证</Text>
                    {this.state.isSegWit && <FastImage source={require('resources/images/radio_checked.png')} style={{ width: 24, height: 24 }} />}
                    {!this.state.isSegWit && <FastImage source={require('resources/images/radio_unchecked.png')} style={{ width: 24, height: 24 }} />}
                    <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={isDarkMode ? 'black' : '#D9D9D9'} style={{ width: '100%', height: 44 }} onPress={this.changeAddressType.bind(this, false)}>
                  <View style={{ height: 44, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                    <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'dark' }}>普通</Text>
                    {this.state.isSegWit && <FastImage source={require('resources/images/radio_unchecked.png')} style={{ width: 24, height: 24 }} />}
                    {!this.state.isSegWit && <FastImage source={require('resources/images/radio_checked.png')} style={{ width: 24, height: 24 }} />}
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#666666' }}>设置密码</Text>
              </View>
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : 'white' }}>
                <Field
                  label="钱包密码"
                  placeholder="不少于8位字符，建议混合大小写字母，数字，符号"
                  name="password"
                  fieldName="password"
                  change={change}
                  component={TextField}
                  separator={true}
                  showClearButton={!!password && password.length > 0}
                  secureTextEntry
                  isDarkMode={isDarkMode}
                />
                <Field
                  label={t(this,'确认密码')}
                  placeholder={t(this,'不少于8位字符，建议混合大小写字母，数字，符号')}
                  name="passwordConfirm"
                  fieldName="passwordConfirm"
                  change={change}
                  component={TextField}
                  separator={true}
                  showClearButton={!!passwordConfirm && passwordConfirm.length > 0}
                  secureTextEntry
                  isDarkMode={isDarkMode}
                />
                <Field
                  label="密码提示"
                  placeholder="选填"
                  name="passwordHint"
                  fieldName="passwordHint"
                  change={change}
                  component={TextField}
                  showClearButton={!!passwordHint && passwordHint.length > 0}
                  separator={false}
                  isDarkMode={isDarkMode}
                />
              </View>
              <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 13, color: '#666666', lineHeight: 18 }}>如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。</Text>
              </View>
            </View>
          </ScrollView>
          <Modal
            isVisible={this.state.importBTCPrivateKeyLoading || this.state.importBTCMnemonicsLoading}
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
            {(this.state.importBTCPrivateKeyLoading || this.state.importBTCMnemonicsLoading) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>导入中...</Text>
              </View>
            </View>}
          </Modal>
        </View>
      </SafeAreaView>
    )
  }
}
