import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
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
  TouchableNativeFeedback
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import { FilledTextField, FilledTextArea } from 'components/Form'
import IndicatorModal from 'components/Modal/IndicatorModal'
import * as walletActions from 'actions/wallet'

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
  } else if (values.password.length < 8) {
    errors.password = '密码不少于8位字符'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

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
            color: 'white',
            enabled: false
          }
        ],
        title: {
          text: '导入EOS钱包'
        },
        drawBehind: false
      }
    }
  }

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
              color: 'white',
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
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.Camera',
     *         passProps: { from: 'import', form: 'importEOSWalletForm', field }
     *       }
     *     }]
     *   }
     * })*/
  }

  render() {
    const { formValues, change } = this.props
    const privateKey = formValues && formValues.privateKey
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: '100%' }}>
              <Field
                label="私钥"
                name="privateKey"
                fieldName="privateKey"
                component={FilledTextArea}
                change={change}
                nonEmpty={!!privateKey && privateKey.length > 0}
                trailingIcon={<TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                  <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <FastImage source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableNativeFeedback>}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>设置密码</Text>
            </View>
            <Field
              label="钱包密码"
              placeholder="不少于8位字符，建议混合大小写字母，数字，符号"
              name="password"
              fieldName="password"
              change={change}
              component={FilledTextField}
              nonEmpty={!!password && password.length > 0}
              secureTextEntry
            />
            <Field
              label="密码提示"
              placeholder="选填"
              name="passwordHint"
              fieldName="passwordHint"
              change={change}
              component={FilledTextField}
              nonEmpty={!!passwordHint && passwordHint.length > 0}
            />
          </View>
          <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 16, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>如果要在导入的同时修改密码，请在输入框内输入新密码，旧密码将在导入后失效。</Text>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.getKeyAccountsLoading} message="获取帐户中..." onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
