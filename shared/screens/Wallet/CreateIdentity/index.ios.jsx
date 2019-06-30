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
  Keyboard
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as identityActions from 'actions/identity'

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
  <View style={{ width: '100%', alignItems: 'center', height: 56, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <Text style={{ fontSize: 17, fontWeight: 'bold', marginRight: 16, width: 70 }}>{label}</Text>
    <TextInput
      style={styles.textFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
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

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = '请输入身份名称'
  }

  if (!values.password) {
    errors.password = '请输入密码'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  if (values.name && values.name.length > 12) {
    warnings.name = '身份名不超过12位'
  }

  if (values.password && values.password.length < 8) {
    warnings.password = '密码不少于8位字符'
  }

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
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        noBorder: true,
        background: {
          color: 'white',
          translucent: true
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

  state = { invalid: true, pristine: true, loading: false, showForm: true }

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
              enabled: !this.state.invalid && !this.state.pristine && !this.state.loading
            }
          ]
        }
      })
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'next') {
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
    this.props.actions.createIdentity.requested({ ...data, componentId: this.props.componentId })
  }

  componentDidDisappear() {
    this.setState({ showForm: false }, () => {
      this.setState({ showForm: true })
    })
  }

  componentDidMount() {
    if (this.props.createIdentity.loading) {
      this.props.actions.createIdentity.failed()
    }
  }

  render() {
    const { intl, createIdentity, formValues, change } = this.props
    const loading = createIdentity.loading
    const name = formValues && formValues.name
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <View style={styles.container}>
        <View style={{ width: '100%', height: 0.5, backgroundColor: 'rgba(0,0,0,0)' }} />
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, alignItems: 'center' }} onPress={() => console.log('press')}>
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'identity_create_title' })}</Text>
              {loading
             && (
               <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: -25 }}>
                 <ActivityIndicator size="small" color="#000000" />
               </View>
             )
            }
            </View>
            <View style={{ marginBottom: 16, height: 22 }}>
              {!loading && <Text style={{ fontSize: 17, paddingLeft: 32, paddingRight: 32, lineHeight: 22, textAlign: 'center' }}>
                {intl.formatMessage({ id: 'identity_create_sub_title' })}
              </Text>}
            </View>
            {this.state.showForm && <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC' }}>
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
            </View>}
          </View>
        </ScrollView>
      </View>
    )
  }
}
