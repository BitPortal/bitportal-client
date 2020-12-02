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
    errors.name = gt('identity_id_enter')
  } else if (values.name.length > 12) {
    errors.name = gt('identity_id_caution')
  }

  if (!values.password) {
    errors.password = gt('pwd_enter')
  } else if (values.password.length < 8) {
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
            text: gt('button_next'),
            fontWeight: '400',
            color: 'white',
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        title: {
          text: gt('identity_id_create')
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
              text: t(this,'button_next'),
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
    const passwordConfirm = formValues && formValues.passwordConfirm
    const passwordHint = formValues && formValues.passwordHint

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }}>
            <View style={{ height: 22, marginTop: 30, marginBottom: 30 }}>
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
                label={intl.formatMessage({ id: 'identity_input_label_wallet_passwd_confirm' })}
                placeholder={intl.formatMessage({ id: 'identity_input_placeholder_wallet_passwd' })}
                name="passwordConfirm"
                fieldName="passwordConfirm"
                component={OutlinedTextField}
                nonEmpty={!!passwordConfirm && passwordConfirm.length > 0}
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
        <IndicatorModal isVisible={loading} message={t(this,'create_creating')} onModalHide={this.onModalHide} />
      </SafeAreaView>
    )
  }
}
