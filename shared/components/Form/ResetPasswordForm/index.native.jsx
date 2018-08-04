import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, TextField, TextAreaField, PasswordField, SubmitButton } from 'components/Form'
import { normalizeText } from 'utils/normalize'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import PasswordStrength from 'components/PasswordStrength'
import { getPasswordStrength } from 'utils'
import messages from './messages'

const validate = (values) => {
  const errors = {}

  if (!values.get('password')) {
    errors.password = 'Please input password'
  } else if (!!values.get('password') && values.get('password').length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Please confirm the new password'
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = 'Passwords don\'t macth'
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    password: formValueSelector('resetPasswordForm')(state, 'password')
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

@reduxForm({ form: 'resetPasswordForm', validate })

export default class ResetPasswordForm extends Component {
  submit = (data) => {
    this.props.onPress()
    console.log(data.toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, locale, password } = this.props
    const disabled = invalid || pristine

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_new" />}
            tips={messages[locale].cpwd_title_tips_pwd}
            name="oldPassword"
            component={PasswordField}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_repeat" />}
            name="newPassword"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_repeat" />}
            name="confirmedNewPassword"
            component={PasswordField}
          />
          <Field
            label={<FormattedMessage id="cpwd_title_name_pswht" />}
            name="passwordHint"
            component={TextField}
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
