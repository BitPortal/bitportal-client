/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, FieldItem, FieldInput, TextField, SubmitButton } from 'components/Form'
import { normalizeText } from 'utils/normalize'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'

const validate = (values) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = 'Please input bitportal wallet name'
  }

  return errors
}

@reduxForm({ form: 'createWalletForm', validate })

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

export default class CreateWalletForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    // this.props.actions.createWalletRequested(data.toJS())
    console.log(data.toJS())
    this.props.onSubmit()
  }

  render() {
    const { handleSubmit, invalid, pristine } = this.props
    const disabled = invalid || pristine

    return (
      <FormContainer>
        <Field
          label="Wallet Name"
          name="name"
          component={TextField}
          normalize={normalizeText}
        />
        <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text="Create" />
      </FormContainer>
    )
  }
}
