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
import * as walletActions from 'actions/wallet'

const validate = (values) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = 'Please input bitportal wallet name'
  }

  if (!values.get('password')) {
    errors.password = 'Please input password'
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Please confirm password'
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = 'Passwords don\'t macth'
  }

  return errors
}

@reduxForm({
  form: 'createEOSAccountForm',
  validate
})

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class CreateEOSAccountForm extends Component {
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
          label="Name Your Bitportal"
          name="name"
          component={TextField}
          normalize={normalizeText}
        />
        <Field
          label="Set a password"
          name="password"
          component={PasswordField}
        />
        <Field
          label="Confirm Your Password"
          name="confirmedPassword"
          component={PasswordField}
        />
        <SubmitButton
          disabled={disabled}
          onPress={handleSubmit(this.submit)}
          text="Next"
        />
      </FormContainer>
    )
  }
}
