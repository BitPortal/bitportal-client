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
    errors.name = 'Please input bitportal EOS wallet name'
  }

  if (!values.get('privateKey')) {
    errors.privateKey = 'Please input privateKey'
  } else if (!!values.get('privateKey') && values.get('privateKey').length < 24) {
    errors.privateKey = 'privateKey must be at least 24 characters'
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

@reduxForm({ form: 'importPrivateKeyForm', validate })

export default class ImportPrivateKeyForm extends Component {
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
          label="Name Your EOS Account"
          name="name"
          component={TextField}
          normalize={normalizeText}
        />
        <Field
          label="Import Your Private Key"
          name="privateKey"
          component={TextAreaField}
        />
        <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text="Done" />
      </FormContainer>
    )
  }
}
