import React, { Component } from 'react'
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
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
  },
  textFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 138'
  },
  noLable: {
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
  isDarkMode,
  onSwitch
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    {!!label && !switchable && <Text style={{ fontSize: 17, marginRight: 16, width: 70 , color: isDarkMode ? 'white' : 'black'}}>{label}</Text>}
    {!!label && !!switchable &&
     <View style={{ borderRightWidth: 0.5, borderColor: '#C8C7CC', height: '100%', marginRight: 16, width: 70, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
       <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.7} onPress={onSwitch} style={{ width: 57, height: '100%', justifyContent: 'center' }}>
         <Text style={{ fontSize: 15, color: '#007AFF' }}>{label}</Text>
       </TouchableHighlight>
       <Image
         source={require('resources/images/arrowRight.png')}
         style={{ width: 8, height: 13, marginRight: 10 }}
       />
     </View>
    }
    <TextInput
      style={[styles.textFiled, !label ? styles.noLable : {}, { color: isDarkMode ? 'white' : 'black'}]}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      editable={typeof editable === 'boolean' ? editable : true}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
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
  isDarkMode,
  separator
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 88, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <TextInput
      style={[styles.textAreaFiled, { color: isDarkMode ? 'white' : 'black' }]}
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
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid WIF length':
    case 'Invalid compression flag':
    case 'private key length is invalid':
    case 'No getKeyAccounts function':
      return '当前EOS节点无法获取帐户，请切换节点后再试'
    case 'Invalid private key':
      return '无效的私钥'
    default:
      return '请求失败'
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.privateKey) {
    errors.privateKey = '请输入私钥'
  }

  if (!values.password) {
    errors.password = '请输入密码'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  if (values.password && values.password.length < 8) {
    warnings.password = '密码不少于8位字符'
  }

  return warnings
}

const shouldError = () => true

@reduxForm({ form: 'importEOSWalletForm', validate, shouldError, warn })

@connect(
  state => ({
    getKeyAccounts: state.getEOSKeyAccounts,
    formSyncWarnings: getFormSyncWarnings('importEOSWalletForm')(state),
    formValues: getFormValues('importEOSWalletForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class ImportEOSWallet extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'next',
            text: '下一步',
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
          text: '导入EOS钱包'
        },
        drawBehind: false
      }
    }
  }
  static contextType = DarkModeContext
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.getKeyAccounts.loading !== prevState.getKeyAccountsLoading
      || nextProps.getKeyAccounts.error !== prevState.getKeyAccountsError
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        getKeyAccountsLoading: nextProps.getKeyAccounts.loading,
        getKeyAccountsError: nextProps.getKeyAccounts.error
      }
    } else {
      return null
    }
  }

  state = {
    selectedIndex: 0,
    getKeyAccountsLoading: false,
    invalid: false,
    pristine: false,
    getKeyAccountsError: null
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'next') {
      const { formSyncWarnings } = this.props
      if (typeof formSyncWarnings === 'object') {
        const warning = formSyncWarnings.password
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
    this.props.actions.getEOSKeyAccounts.requested({ ...data, componentId: this.props.componentId, delay: 500 })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.getKeyAccountsLoading !== this.state.getKeyAccountsLoading
      || prevState.selectedIndex !== this.state.selectedIndex
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'next',
              text: '下一步',
              fontWeight: '400',
              enabled: !this.state.invalid && !this.state.pristine && !this.state.getKeyAccountsLoading
            }
          ]
        }
      })
    }
  }

  clearError = () => {
    this.props.actions.getEOSKeyAccounts.clearError()
  }

  componentDidAppear() {
    this.props.actions.getEOSKeyAccounts.succeeded()
  }

  onModalHide = () => {
    const error = this.state.getKeyAccountsError

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

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'importEOSWalletForm', field }
          }
        }]
      }
    })
  }

  render() {
    const { formValues, change } = this.props
    const privateKey = formValues && formValues.privateKey
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#666666' }}>输入私钥</Text>
              </View>
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: isDarkMode ? 'black' : 'white' }}>
                <Field
                  placeholder="必填"
                  name="privateKey"
                  fieldName="privateKey"
                  component={TextAreaField}
                  change={change}
                  isDarkMode={isDarkMode}
                  showClearButton={!!privateKey && privateKey.length > 0}
                />
                <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.scan.bind(this, 'privateKey')} style={{ width: 30, height: 30, position: 'absolute', right: 16, top: 4 }} activeOpacity={0.42}>
                  <FastImage
                    source={require('resources/images/scan2_right.png')}
                    style={{ width: 30, height: 30 }}
                  />
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
                  isDarkMode={isDarkMode}
                  showClearButton={!!password && password.length > 0}
                  secureTextEntry
                />
                <Field
                  label="密码提示"
                  placeholder="选填"
                  name="passwordHint"
                  fieldName="passwordHint"
                  change={change}
                  component={TextField}
                  isDarkMode={isDarkMode}
                  showClearButton={!!passwordHint && passwordHint.length > 0}
                  separator={false}
                />
              </View>
              <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 13, color: '#666666', lineHeight: 18 }}>如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。</Text>
              </View>
            </View>
          </ScrollView>
          <Modal
            isVisible={this.state.getKeyAccountsLoading}
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
            {(this.state.getKeyAccountsLoading) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>获取帐户中...</Text>
              </View>
            </View>}
          </Modal>
        </View>
      </SafeAreaView>
    )
  }
}
