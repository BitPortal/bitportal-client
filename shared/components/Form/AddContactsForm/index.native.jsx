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
import { Navigation } from 'react-native-navigation'
import { eosAccountSelector } from 'selectors/eosAccount'
import * as eosAccountActions from 'actions/eosAccount'
import storage from 'utils/storage'
import messages from './messages'

const validate = (values) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = <FormattedMessage id="contacts_txtbox_txt_acchint2" />
  } else if (values.get('name').length > 12) {
    errors.name = <FormattedMessage id="contacts_txtbox_txt_acchint" />
  }

  if (values.get('memo') && values.get('memo').length > 24) {
    errors.memo = <FormattedMessage id="contacts_txtbox_txt_hint" />
  }

  return errors
}

const asyncValidate = (values, dispatch, props) => new Promise((resolve, reject) => {
  props.actions.validateEOSAccountRequested({
    field: 'name',
    value: props.name,
    errorMessage: messages[props.locale].contacts_txtbox_txt_invalid,
    resolve,
    reject
  })
})

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    name: formValueSelector('addContactsForm')(state, 'name')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  })
)

@reduxForm({ form: 'addContactsForm', validate, asyncValidate, asyncBlurFields: ['name'] })

export default class AddContactsForm extends Component {
  state = {
    contacts: []
  }

  submit = async (data) => {
    const tempObj = { accountName: data.get('name'), memo: data.get('memo') }
    this.state.contacts.push(tempObj)
    const accountName = this.props.eosAccount.get('data').get('account_name')
    await storage.setItem(`bitportal.${accountName}-contacts`, { contacts: this.state.contacts }, true)
    Navigation.pop(this.props.componentId)
  }

  async componentDidMount() {
    const accountName = this.props.eosAccount.get('data').get('account_name')
    const objInfo = await storage.getItem(`bitportal.${accountName}-contacts`, true)
    const contacts = objInfo && objInfo.contacts
    if (contacts && contacts.length > 0) {
      this.setState({ contacts })
    }
  }

  render() {
    const { handleSubmit, invalid, pristine, locale } = this.props
    const disabled = invalid || pristine

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={<FormattedMessage id="contacts_title_name_acc" />}
            name="name"
            component={TextField}
          />
          <Field
            label={<FormattedMessage id="contacts_title_name_Note" />}
            name="memo"
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
