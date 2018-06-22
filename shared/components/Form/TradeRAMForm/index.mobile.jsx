/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { Field, reduxForm } from 'redux-form/immutable'
import {
  FormContainer,
  FieldItem,
  FieldInput,
  TextField,
  SubmitButton
} from 'components/Form'
import { normalizeUnitByFraction } from 'utils/normalize'
import * as ramActions from 'actions/ram'
import Alert from 'components/Alert'
import Switch from 'components/Switch'
import { IntlProvider, FormattedMessage } from 'react-intl'
import EStyleSheet from 'react-native-extended-stylesheet'
import messages from './messages'

const styles = EStyleSheet.create({
  buyRAMForm: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  }
})

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid owner private key!':
      return messages['ast_imp_hint_invalidowner']
    case 'Invalid active private key!':
      return messages['ast_imp_hint_invalidactive']
    case 'EOS account dose not exist!':
      return messages['ast_imp_hint_eosaccount']
    case 'Owner permission dose not exist!':
      return messages['ast_imp_hint_ownerpermi']
    case 'Active permission dose not exist!':
      return messages['ast_imp_hint_activepermi']
    case 'Unauthorized owner private key!':
      return messages['ast_imp_hint_unauowner']
    case 'Unauthorized active private key!':
      return messages['ast_imp_hint_unauactive']
    default:
      return messages['ast_imp_hint_fail']
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.get('quant')) {
    errors.quant = <FormattedMessage id="import_txtbox_txt_bpnmhint1" />
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ram: state.ram
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...ramActions
    }, dispatch)
  })
)

@reduxForm({ form: 'tradeRAMForm', validate })

export default class TradeRAMForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    console.log(data.toJS())
    // this.props.actions.buyRAMRequested(data.toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, ram, locale } = this.props
    const buying = ram.get('buying')
    const selling = ram.get('selling')
    const loading = buying || selling
    const error = ram.get('error')
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.buyRAMForm}>
          <Switch />
          <FormContainer>
            <Field
              name="quant"
              component={TextField}
              normalize={normalizeUnitByFraction(2)}
              rightContent={<Text style={{ color: 'white' }}>EOS</Text>}
            />
            <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text={<FormattedMessage id="import_button_name_impt" />} />
            <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearError} />
          </FormContainer>
        </View>
      </IntlProvider>
    )
  }
}
