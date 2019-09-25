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
  SafeAreaView,
  TouchableNativeFeedback
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as identityActions from 'actions/identity'
import IndicatorModal from 'components/Modal/IndicatorModal'
import { OutlinedTextField } from 'components/Form'

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
      Keyboard.dismiss()
      this.props.handleSubmit(this.submit)()
    }
  }

  submit = (data) => {
    this.props.actions.createIdentity.requested({ ...data, componentId: this.props.componentId })
  }

  render() {
    const { intl, createIdentity, formValues, change } = this.props
    const loading = createIdentity.loading
    const name = formValues && formValues.name
    const password = formValues && formValues.password
    const passwordHint = formValues && formValues.passwordHint

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }}>
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
                component={OutlinedTextField}
                nonEmpty={!!name && name.length > 0}
                change={change}
              />
              <Field
                label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
                name="password"
                fieldName="password"
                component={OutlinedTextField}
                nonEmpty={!!password && password.length > 0}
                change={change}
                secureTextEntry
              />
              <Field
                label={intl.formatMessage({ id: 'identity_input_label_passwd_hint' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_label_passwd_hint' })}
                name="passwordHint"
                fieldName="passwordHint"
                component={OutlinedTextField}
                nonEmpty={!!passwordHint && passwordHint.length > 0}
                change={change}
              />
              <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 16, justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.54)', lineHeight: 18 }}>{intl.formatMessage({ id: 'identity_recovery_hint_passwd_recovery_passwd' })}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <IndicatorModal isVisible={loading} message="创建中..." onModalHide={this.onModalHide} />
      </SafeAreaView>
    )
  }
}
