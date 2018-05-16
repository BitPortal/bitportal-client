/* @jsx */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
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
    const { handleSubmit, invalid, pristine } = this.props
    const disabled = invalid || pristine

    return (
      <FormContainer>
        <Field
          label="Current Password"
          name="currentPassword"
          component={TextField}
          normalize={normalizeText}
        />
        <Field
          label="New password"
          name="newPassword"
          component={PasswordField}
        />
        <Field
          label="Confirm Password"
          name="confirmedPassword"
          component={PasswordField}
        />
        <SubmitButton
          disabled={disabled}
          onPress={handleSubmit(this.submit)}
          text="Reset"
        />
      </FormContainer>
    )
  }
}
