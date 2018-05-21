/* @jsx */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Text, View, TextInput } from 'react-native'
import { Field, reduxForm } from 'redux-form/immutable'
import {
  FormContainer,
  FieldItem,
  FieldInput,
  TextField,
  PasswordField,
  SubmitButton
} from 'components/Form'
import { normalizeText } from 'utils/normalize'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

const validate = (values) => {
  const errors = {}
  console.log('#####---', values.toJS())
  if (!values.get('currentPassword')) {
    errors.name = 'Please input bitportal wallet name'
  }

  if (!values.get('newPassword')) {
    errors.password = 'Please input password'
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Please confirm password'
  }

  if (values.get('confirmedPassword') !== values.get('newPassword')) {
    errors.confirmedPassword = 'Passwords don\'t macth'
  }

  return errors
}

@reduxForm({
  form: 'resetPasswordForm',
  validate
})

@connect(
  state => ({
    locale: state.intl.get('locale'),
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

export default class ResetPasswordForm extends Component {

  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    console.log(data.toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, locale } = this.props
    const disabled = invalid || pristine

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_current" />}
            name="currentPassword"
            component={TextField}
            normalize={normalizeText}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_new" />}
            name="newPassword"
            component={PasswordField}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_repeat" />}
            name="confirmedPassword"
            component={PasswordField}
          />
          <SubmitButton
            disabled={disabled}
            onPress={handleSubmit(this.submit)}
            text={<FormattedMessage id="cpwd_button_name_change" />}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
