/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, FieldItem, FieldInput, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeText, normalizeEOSAccountName } from 'utils/normalize'

const validate = (values, props) => {
  const errors = {}
  if (!values.get('name')) {
    errors.name = 'Please input bitportal EOS account name'
  }

  if (!values.get('ownerPrivateKey')) {
    errors.ownerPrivateKey = 'Please input onwer private key'
  }

  if (!values.get('activePrivateKey')) {
    errors.activePrivateKey = 'Please input active private key'
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

@reduxForm({ form: 'importEOSAccountForm', validate })

export default class ImportEOSAccountForm extends Component {
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
          label="Account Name"
          name="name"
          component={TextField}
          normalize={normalizeEOSAccountName}
        />
        <Field
          label="Onwer Private Key"
          name="ownerPrivateKey"
          component={TextAreaField}
          normalize={normalizeText}
        />
        <Field
          label="Active Private Key"
          name="activePrivateKey"
          component={TextAreaField}
          normalize={normalizeText}
        />
        <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text="Import" />
      </FormContainer>
    )
  }
}
