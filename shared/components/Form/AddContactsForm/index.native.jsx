import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import {
  FormContainer,
  TextField,
  SubmitButton
} from 'components/Form'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import * as eosAccountActions from 'actions/eosAccount'
import * as contactActions from 'actions/contact'
import messages from './messages'

const validate = (values) => {
  const errors = {}

  if (!values.get('eosAccountName')) {
    errors.eosAccountName = <FormattedMessage id="contacts_txtbox_txt_acchint2" />
  } else if (values.get('eosAccountName').length > 12) {
    errors.eosAccountName = <FormattedMessage id="contacts_txtbox_txt_acchint" />
  }

  if (values.get('note') && values.get('note').length > 64) {
    errors.note = <FormattedMessage id="contacts_txtbox_txt_hint" />
  }

  return errors
}

const asyncValidate = (values, dispatch, props) => new Promise((resolve, reject) => {
  props.actions.validateEOSAccountRequested({
    field: 'eosAccountName',
    value: props.eosAccountName,
    errorMessage: messages[props.locale].contacts_txtbox_txt_invalid,
    resolve,
    reject
  })
})

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    eosAccountName: formValueSelector('addContactsForm')(state, 'eosAccountName')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions,
      ...contactActions
    }, dispatch)
  })
)

@reduxForm({
  form: 'addContactsForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['eosAccountName']
})

export default class AddContactsForm extends Component {
  submit = (data) => {
    const componentId = this.props.componentId
    this.props.actions.addContact(data.set('componentId', componentId).toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, locale } = this.props
    const disabled = invalid || pristine

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={<FormattedMessage id="contacts_title_name_acc" />}
            name="eosAccountName"
            component={TextField}
          />
          <Field
            label={<FormattedMessage id="contacts_title_name_Note" />}
            name="note"
            component={TextField}
          />
          <SubmitButton
            disabled={disabled}
            onPress={handleSubmit(this.submit)}
            text={<FormattedMessage id="contacts_button_name_save" />}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
