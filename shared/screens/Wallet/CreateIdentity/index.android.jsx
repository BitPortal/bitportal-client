import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as identityActions from 'actions/identity'
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
  textFiled: {
    fontSize: 16,
    padding: 0,
    paddingTop: 4,
    paddingBottom: 4,
    borderColor: 'rgba(0,0,0,0.12)',
    borderBottomWidth: 1
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
  showClearButton
}) => (
  <View style={{ width: '100%', height: 86, paddingLeft: 16, paddingRight: 16 }}>
    <Text style={{ fontSize: 12, width: '100%', height: 16, marginBottom: 2, color: (touched && error) ? '#FF5722' : 'rgba(0,0,0,0.54)' }}>{label}</Text>
    <TextInput
      style={{
        fontSize: 16,
        padding: 0,
        paddingTop: 4,
        paddingBottom: 4
      }}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    <View style={{ height: (touched && error) ? 2 : 1, backgroundColor: (touched && error) ? '#FF5722' : 'rgba(0,0,0,0.12)', position: 'absolute', left: 16, right: 16, top: 53 }} />
    {showClearButton && active && <View style={{ height: 38, position: 'absolute', right: 11, top: 18, width: 24, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear_android.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>
    </View>}
    {touched && error && active && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.38)', paddingTop: 6 }}>{error}</Text>}
  </View>
)

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = '请输入身份名称'
  } else if (values.name.length > 12) {
    errors.name = '身份名不超过12位'
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

  /* if (values.name && values.name.length > 12) {
   *   warnings.name = '身份名不超过12位'
   * }

   * if (values.password && values.password.length < 8) {
   *   warnings.password = '密码不少于8位字符'
   * }*/

  return warnings
}

@injectIntl

@reduxForm({ form: 'createIdentityForm', validate, warn })

@connect(
  state => ({
    createIdentity: state.createIdentity,
    formSyncWarnings: getFormSyncWarnings('createIdentityForm')(state),
    formValues: getFormValues('createIdentityForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class CreateIdentity extends Component {
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
        largeTitle: {
          visible: false
        },
        title: {
          text: '创建身份'
        }
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.createIdentity.loading !== prevState.loading
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        loading: nextProps.createIdentity.loading
      }
    } else {
      return null
    }
  }

  state = { invalid: true, pristine: true, loading: false }

  subscription = Navigation.events().bindComponent(this)

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
              id: 'next',
              text: '下一步',
              fontWeight: '400',
              color: 'white',
              enabled: !this.state.invalid && !this.state.pristine && !this.state.loading
            }
          ]
        }
      })
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'next') {
      /* const { formSyncWarnings } = this.props
       * if (typeof formSyncWarnings === 'object') {
       *   const warning = formSyncWarnings.name || formSyncWarnings.password
       *   if (warning) {
       *     Alert.alert(
       *       warning,
       *       '',
       *       [
       *         { text: '确定', onPress: () => console.log('OK Pressed') }
       *       ]
       *     )
       *     return
       *   }
       * }*/

      Keyboard.dismiss()
      this.props.handleSubmit(this.submit)()
    }
  }

  submit = (data) => {
    console.log(data)
    // this.props.actions.createIdentity.requested({ ...data, componentId: this.props.componentId })
  }

  componentDidDisappear() {

  }

  render() {
    const { intl, createIdentity, formValues, change } = this.props
    const loading = createIdentity.loading
    const name = formValues && formValues.name
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }} onPress={() => console.log('press')}>
            <View style={{ marginBottom: 16, height: 22, marginTop: 30, marginBottom: 30 }}>
              <Text style={{ fontSize: 20, color: 'black', paddingLeft: 16, paddingRight: 16, fontWeight: 'bold' }}>
                {intl.formatMessage({ id: 'identity_create_sub_title' })}
              </Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Field
                label={intl.formatMessage({ id: 'identity_input_label_identity_name' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_identity_name' })}
                name="name"
                fieldName="name"
                component={TextField}
                showClearButton={!!name && name.length > 0}
                change={change}
                separator
              />
              <Field
                label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
                name="password"
                fieldName="password"
                component={TextField}
                showClearButton={!!password && password.length > 0}
                change={change}
                secureTextEntry
                separator
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
          </View>
        </ScrollView>
        <Modal
          isVisible={true}
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
          {(true) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 2, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#673AB7" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold', color: 'black' }}>创建中...</Text>
            </View>
          </View>}
        </Modal>
      </SafeAreaView>
    )
  }
}
