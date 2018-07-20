
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import {
  FormContainer,
  TextField,
  PasswordField,
  SubmitButton
} from 'components/Form'
import { normalizeText } from 'utils/normalize'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import PasswordStrength from 'components/PasswordStrength'
import { getPasswordStrength } from 'utils'
import messages from './messages'

const validate = (values) => {
  const errors = {}
  if (!values.get('currentPassword')) {
    errors.currentPassword = <FormattedMessage id="cpwd_txtbox_title_current" />
    // 'Please input current password'
  }

  if (!values.get('newPassword')) {
    errors.newPassword = 'Please input password'
  } else if (!!values.get('newPassword') && values.get('newPassword').length < 6) {
    errors.newPassword = 'Password must be at least 6 characters'
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Please confirm the new password'
  }

  if (values.get('confirmedPassword') !== values.get('newPassword')) {
    errors.confirmedPassword = 'Passwords don\'t macth'
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    password: formValueSelector('resetPasswordForm')(state, 'newPassword')
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

@reduxForm({ form: 'resetPasswordForm', validate })

export default class ResetPasswordForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
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
            label={<FormattedMessage id="cpwd_txtbox_title_current" />}
            name="currentPassword"
            component={TextField}
            normalize={normalizeText}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_new" />}
            name="newPassword"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
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
