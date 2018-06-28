/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Platform, InteractionManager } from 'react-native'
import { Field, reduxForm, reset } from 'redux-form/immutable'
import {
  FormContainer,
  FieldItem,
  FieldInput,
  TextField,
  SubmitButton
} from 'components/Form'
import { normalizeUnitByCurrency } from 'utils/normalize'
import * as bandwidthActions from 'actions/bandwidth'
import Alert from 'components/Alert'
import Switch from 'components/Switch'
import { IntlProvider, FormattedMessage } from 'react-intl'
import EStyleSheet from 'react-native-extended-stylesheet'
import { eosAccountSelector } from 'selectors/eosAccount'
import Dialogs from 'components/Dialog'
import DialogAndroid from 'components/DialogAndroid'
import messages from './messages'

const styles = EStyleSheet.create({
  delegateBandwidthForm: {
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
    case 'Key derivation failed - possibly wrong passphrase':
      return messages["dlgt_popup_title_pwderr"]
    case 'account using more than allotted RAM usage':
      return messages["dlgt_popup_title_mousg"]
    case 'transaction exceeded the current CPU usage limit imposed on the transaction':
      return 'transaction exceeded the current CPU usage limit imposed on the transaction'
    default:
      return messages["dlgt_popup_title_trafail"]
  }
}

const validate = (values, props) => {
  const hasAccount = !!props.eosAccount.get('data').size
  const eosBalance = (hasAccount && props.eosAccount.get('data').get('core_liquid_balance')) ? props.eosAccount.get('data').get('core_liquid_balance').split(' ')[0] : 0

  const errors = {}

  if (!+values.get('quant')) {
    errors.quant = messages[props.locale]["dlgt_popup_title_epteosinput"]
  } else if (+eosBalance < +values.get('quant')) {
    errors.quant = messages[props.locale]["dlgt_popup_title_epteosinput"]
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    bandwidth: state.bandwidth
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...bandwidthActions,
      reset
    }, dispatch)
  })
)

@reduxForm({ form: 'delegateBandwidthForm', validate })

export default class DelegateBandwidthForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { activeForm: 'Delegate', isVisible: false, password: '', data: undefined }
    this.submit = this.submit.bind(this)
    this.switchForm = this.switchForm.bind(this)
  }

  actionRequest = (data, password) => {
    const eosAccount = this.props.eosAccount
    const eosAccountName = eosAccount.get('data').get('account_name')
    const resource = this.props.resource

    if (this.state.activeForm === 'Delegate') {
      this.props.actions.delegateBandwidthRequested(data.set('resource', resource).set('eosAccountName', eosAccountName).set('password', password).toJS())
    } else {
      this.props.actions.undelegateBandwidthRequested(data.set('resource', resource).set('eosAccountName', eosAccountName).set('password', password).toJS())
    }
  }

  async submit(data) {
    if (Platform.OS == 'ios') {
      const { action, text } = await Dialogs.prompt(
        messages[this.props.locale]["dlgt_popup_title_pwd"],
        null,
        {
          positiveText: messages[this.props.locale]["dlgt_popup_buttom_ent"],
          negativeText: messages[this.props.locale]["dlgt_popup_buttom_can"]
        }
      )
      if (action === Dialogs.actionPositive) {
        this.actionRequest(data, text)
      }
    } else {
      this.setState({ isVisible: true, data })
    }
  }

  handleConfirm = () => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        this.actionRequest(this.state.data, this.state.password)
      })
    })
  }

  switchForm(form) {
    if (form !== this.state.activeForm) {
      this.setState({ activeForm: form })
      this.props.actions.clearError()
      this.props.reset('delegateBandwidthForm')
    }
  }

  render() {
    const { handleSubmit, invalid, pristine, password, bandwidth, locale } = this.props
    const delegating = bandwidth.get('delegating')
    const undelegating = bandwidth.get('undelegating')
    const showSuccess = bandwidth.get('showSuccess')
    const loading = delegating || undelegating
    const error = bandwidth.get('error')
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.delegateBandwidthForm}>
          <Switch itemList={['Delegate', 'Undelegate']} active={this.state.activeForm} onSwitch={this.switchForm} />
          <FormContainer>
            <Field
              name="quant"
              component={TextField}
              normalize={normalizeUnitByCurrency('EOS')}
              rightContent={<Text style={{ color: 'white' }}>EOS</Text>}
            />
            <SubmitButton
              disabled={disabled}
              loading={loading}
              onPress={handleSubmit(this.submit)}
              text={this.state.activeForm === 'Delegate' ? messages[locale]["dlgt_popup_title_dlgt"] : messages[locale]["dlgt_popup_title_undlgt"]}
            />
            <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearError} />
            <Alert message={!!showSuccess && messages[locale]['dlgt_popup_title_trasucc']} dismiss={this.props.actions.hideSuccessModal} />
            {
              Platform.OS === 'android' &&
              <DialogAndroid
                tilte={messages[locale]["dlgt_popup_title_pwd"]}
                content=""
                positiveText={messages[locale]["dlgt_popup_buttom_ent"]}
                negativeText={messages[locale]["dlgt_popup_buttom_can"]}
                onChange={password => this.setState({ password })}
                isVisible={this.state.isVisible}
                handleCancel={() => this.setState({ isVisible: false })}
                handleConfirm={this.handleConfirm}
              />
            }
          </FormContainer>
        </View>
      </IntlProvider>
    )
  }
}
