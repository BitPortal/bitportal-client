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
  SafeAreaView,
  TouchableNativeFeedback
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as identityActions from 'actions/identity'
import { TextField, TextArea } from 'components/Form'
import Modal from 'react-native-modal'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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

const TextAreaField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  placeholder,
  fieldName,
  change,
  showClearButton
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 100, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <TextInput
      style={styles.textAreaFiled}
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
  } else if (values.password && values.password.length < 8) {
    errors.password = '密码不少于8位字符'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

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
            icon: require('resources/images/check_android.png'),
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        title: {
          text: '恢复身份'
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      Keyboard.dismiss()
      this.props.handleSubmit(this.submit)()
    }
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
              icon: require('resources/images/check_android.png'),
              enabled: !this.state.invalid && !this.state.pristine && !this.state.loading
            }
          ]
        }
      })
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

  onModalHide = () => {
    if (this.state.error) {
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

  render() {
    const { intl, recoverIdentity, formValues, change } = this.props
    const loading = recoverIdentity.loading
    const mnemonics = formValues && formValues.mnemonics
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: 16, height: 22, marginTop: 30, marginBottom: 30 }}>
            <Text style={{ fontSize: 20, color: 'black', paddingLeft: 16, paddingRight: 16, fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'identity_recovery_sub_title' })}
            </Text>
          </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{ width: '100%' }}>
            <Field
              label="助记词"
              placeholder={intl.formatMessage({ id: 'identity_input_placeholder_mnemonics' })}
              name="mnemonics"
              fieldName="mnemonics"
              component={TextArea}
              showClearButton={!!mnemonics && mnemonics.length > 0}
              change={change}
              separator={true}
              rightComponent={<TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                <View style={{ width: 30, height: 30, position: 'absolute', top: 37, right: 9, alignItems: 'center', justifyContent: 'center' }}>
                  <FastImage source={require('resources/images/scan_purple_android.png')} style={{ width: 24, height: 24 }} />
                </View>
              </TouchableNativeFeedback>}
            />
          </View>
            <Field
              label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd' })}
              placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
              name="password"
              fieldName="password"
              component={TextField}
              showClearButton={!!password && password.length > 0}
              change={change}
              secureTextEntry
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
              separator={false}
            />
          </View>
          <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>{intl.formatMessage({ id: 'identity_recovery_hint_passwd_recovery_passwd' })}</Text>
          </View>
        </View>
        <Modal
          isVisible={loading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 3, alignItem: 'center', justifyContent: 'center', flexDirection: 'row', elevation: 4 }}>
              <ActivityIndicator size="small" color="#673AB7" />
              <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: 'bold', color: 'black' }}>恢复身份中...</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
      </SafeAreaView>
    )
  }
}
