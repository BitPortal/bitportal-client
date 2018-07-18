/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, FieldItem, FieldInput, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeText } from 'utils/normalize'

const validate = (values, props) => {
  const errors = {}
  if (!values.get('name')) {
    errors.name = 'Please input account name'
  }

  if (!values.get('amount')) {
    errors.amount = 'Please input amount'
  } else if (!!values.get('amount') && values.get('amount') <= 0) {
    errors.amount = 'Amount must be more than 0'
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

@reduxForm({ form: 'transferAssetsForm', validate })

export default class TransferAssetsForm extends Component {
  submit = (data) => {
    this.props.onPress()
    console.log(data.toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine } = this.props
    const disabled = invalid || pristine

    return (
      <FormContainer>
        <Field
          label="Account Name"
          name="name"
          component={TextField}
          normalize={normalizeText}
        />
        <Field
          label="Amount"
          name="amount"
          component={TextField}
          keyboardType="numeric"
        />
        <Field
          name="memo"
          placeholder={'Memo...'}
          component={TextAreaField}
        />
        <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text="Next" />
      </FormContainer>
    )
  }
}
