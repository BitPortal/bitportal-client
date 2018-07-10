/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import {
  FormContainer,
  FieldItem,
  TextField,
  SubmitButton
} from 'components/Form'
import { validateText, validateEOSAccountName } from 'utils/validate'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from './messages'

const validate = (values, props) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = <FormattedMessage id="import_txtbox_txt_acchint2" />
  } else if (!validateEOSAccountName.get('name')) {
    errors.name = <FormattedMessage id="import_txtbox_txt_acchint" />
  }

  if (values.get('memo') && values.get('memo').length > 12) {
    errors.eosAccountName = <FormattedMessage id="import_txtbox_txt_hint" />
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

@reduxForm({ form: 'AddContactsForm', validate })

export default class AddContactsForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {

  }

  render() {
    const { handleSubmit, invalid, pristine, locale } = this.props
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={<FormattedMessage id="import_title_name_acc" />}
            name="name"
            component={TextField}
          />
          <Field
            label={<FormattedMessage id="import_title_name_Note" />}
            name="memo"
            component={TextField}
          />
          <SubmitButton 
            disabled={disabled} 
            onPress={handleSubmit(this.submit)} 
            text={<FormattedMessage id="import_button_name_save" />} 
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
