import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as identityActions from 'actions/identity'
import { DarkModeContext } from 'utils/darkMode'

const styles = EStyleSheet.create({
  container: {
    flex: 1
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
  }
})

const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  showClearButton,
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 56, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <Text style={{ fontSize: 17, fontWeight: 'bold', marginRight: 16, width: 70, color: isDarkMode ? 'white' : 'black' }}>{label}</Text>
    <TextInput
      style={[styles.textFiled, { color: isDarkMode ? 'white' : 'black' }]}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      secureTextEntry={secureTextEntry}
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
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 100, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
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
  </View>
)

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid mnemonics':
      return '无效的助记词'
    default:
      return '恢复失败'
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.mnemonics) {
    errors.mnemonics = '请输入助记词'
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

@injectIntl

@reduxForm({ form: 'recoverIdentityForm', validate, warn })

@connect(
  state => ({
    recoverIdentity: state.recoverIdentity,
    formSyncWarnings: getFormSyncWarnings('recoverIdentityForm')(state),
    formValues: getFormValues('recoverIdentityForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class RecoverIdentity extends Component {
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
        noBorder: true
      }
    }
  }
  static contextType = DarkModeContext
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.recoverIdentity.loading !== prevState.loading
      || nextProps.recoverIdentity.error !== prevState.error
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        loading: nextProps.recoverIdentity.loading,
        error: nextProps.recoverIdentity.error
      }
    } else {
      return null
    }
  }

  state = { invalid: true, pristine: true, loading: false, error: null }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.loading !== this.state.loading
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              text: '确认',
              fontWeight: '400',
              enabled: !this.state.invalid && !this.state.pristine && !this.state.loading
            }
          ]
        }
      })
    }

    if (prevState.error !== this.state.error && this.state.error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(this.state.error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      const { formSyncWarnings } = this.props
      if (typeof formSyncWarnings === 'object') {
        const warning = formSyncWarnings.name || formSyncWarnings.password
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
    this.props.actions.recoverIdentity.requested({ ...data, componentId: this.props.componentId, delay: 500 })
  }

  clearError = () => {
    this.props.actions.recoverIdentity.clearError()
  }

  componentDidAppear() {

  }

  componentDidMount() {
    /* Navigation.mergeOptions(this.props.componentId, {
     *   topBar: {
     *     drawBehind: false
     *   }
     * })*/
    if (this.props.recoverIdentity.loading) {
      this.props.actions.recoverIdentity.failed()
    }
  }

  scan = (field) => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Camera',
            passProps: { from: 'import', form: 'recoverIdentityForm', field }
          }
        }]
      }
    })
  }

  render() {
    const { intl, recoverIdentity, formValues, change } = this.props
    const loading = recoverIdentity.loading
    const mnemonics = formValues && formValues.mnemonics
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <SafeAreaView style={[styles.container, { color: isDarkMode ? 'black' : 'white' }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 26, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'identity_recovery_title' })}</Text>
              {loading
              && (
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: -25 }}>
                  <ActivityIndicator size="small" color="#000000" />
                </View>
              )
              }
            </View>
            <View style={{ marginBottom: 16, height: 22 }}>
              {!loading && <Text style={{ fontSize: 17, paddingLeft: 32, paddingRight: 32, lineHeight: 22, textAlign: 'center', color: isDarkMode ? 'white' : 'black' }}>
                {intl.formatMessage({ id: 'identity_recovery_sub_title' })}
              </Text>}
            </View>
            <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC' }}>
              <Field
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_mnemonics' })}
                name="mnemonics"
                fieldName="mnemonics"
                component={TextAreaField}
                showClearButton={!!mnemonics && mnemonics.length > 0}
                change={change}
                isDarkMode={isDarkMode}
              />
              <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.scan.bind(this, 'mnemonics')} style={{ width: 30, height: 30, position: 'absolute', right: 16, top: 4 }} activeOpacity={0.42}>
                <FastImage
                  source={require('resources/images/scan2_right.png')}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableHighlight>
            </View>
            <View style={{ width: '100%', height: 56, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: '#666666' }}>{intl.formatMessage({ id: 'identity_recovery_sub_title_setting_passwd' })}</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC' }}>
              <Field
                label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
                name="password"
                fieldName="password"
                component={TextField}
                showClearButton={!!password && password.length > 0}
                change={change}
                secureTextEntry
                isDarkMode={isDarkMode}
                separator={true}
              />
              <Field
                label={intl.formatMessage({ id: 'identity_input_label_passwd_hint' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_label_passwd_hint' })}
                name="passwordHint"
                fieldName="passwordHint"
                component={TextField}
                showClearButton={!!passwordHint && passwordHint.length > 0}
                change={change}
                isDarkMode={isDarkMode}
                separator={false}
              />
            </View>
            <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-start' }}>
              <Text style={{ fontSize: 13, color: '#666666', lineHeight: 18 }}>{intl.formatMessage({ id: 'identity_recovery_hint_passwd_recovery_passwd' })}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
