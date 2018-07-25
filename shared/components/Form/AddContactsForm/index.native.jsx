import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import {
  FormContainer,
  TextField,
  SubmitButton
} from 'components/Form'
import { validateEOSAccountName } from 'utils/validate'
// import { normalizeText } from 'utils/normalize'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import { eosAccountSelector } from 'selectors/eosAccount'
import storage from 'utils/storage'
import messages from './messages'

const validate = (values) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = <FormattedMessage id="import_txtbox_txt_acchint2" />
  } else if (!validateEOSAccountName(values.get('name'))) {
    errors.name = <FormattedMessage id="import_txtbox_txt_acchint" />
  }

  if (values.get('memo') && values.get('memo').length > 12) {
    errors.memo = <FormattedMessage id="import_txtbox_txt_hint" />
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state)
  })
)

@reduxForm({ form: 'addContactsForm', validate })

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
