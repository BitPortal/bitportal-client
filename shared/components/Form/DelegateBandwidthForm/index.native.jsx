import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, InteractionManager } from 'react-native'
import { Field, reduxForm, reset } from 'redux-form/immutable'
import { FormContainer, TextField, SubmitButton } from 'components/Form'
import { normalizeUnitByCurrency } from 'utils/normalize'
import { validateUnitByCurrency } from 'utils/validate'
import * as bandwidthActions from 'actions/bandwidth'
import Switch from 'components/Switch'
import Balance from 'components/Balance'
import { IntlProvider } from 'react-intl'
import EStyleSheet from 'react-native-extended-stylesheet'
import { eosAccountSelector } from 'selectors/eosAccount'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
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
      return messages.dlgt_popup_title_pwderr
    case 'account using more than allotted RAM usage':
      return messages.dlgt_popup_title_mousg
    case 'transaction exceeded the current CPU usage limit imposed on the transaction':
      return messages.dlgt_popup_title_exlimit
    default:
      return messages.dlgt_popup_title_trafail
  }
}

const validate = (values, props) => {
  const { eosAccount } = props
  const eosBalance = eosAccount.getIn(['data', 'core_liquid_balance']) ? eosAccount.getIn(['data', 'core_liquid_balance']).split(' ')[0] : 0
  const netWeight = eosAccount.getIn(['data', 'total_resources', 'net_weight']) ? eosAccount.getIn(['data', 'total_resources', 'net_weight']).split(' ')[0] : 0
  const cpuWeight = eosAccount.getIn(['data', 'total_resources', 'cpu_weight']) ? eosAccount.getIn(['data', 'total_resources', 'cpu_weight']).split(' ')[0] : 0

  const errors = {}

  if (!+values.get('quant')) {
    errors.quant = messages[props.locale].dlgt_popup_title_epteosinput
  } else if (!validateUnitByCurrency('EOS')(values.get('quant'))){
    errors.quant = messages[props.locale].dlgt_popup_title_invalideinput
  }

  const activeForm = props.bandwidth.get('activeForm')
  const resource = props.resource

  if (activeForm === 'Delegate') {
    if (+eosBalance < +values.get('quant')) {
      errors.quant = messages[props.locale].dlgt_popup_title_enbyteinput
    }
  } else if (resource === 'net') {
    if (+netWeight < +values.get('quant')) {
      errors.quant = messages[props.locale].dlgt_popup_title_enbyteinput
    }
  } else if (+cpuWeight < +values.get('quant')) {
    errors.quant = messages[props.locale].dlgt_popup_title_enbyteinput
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
  state = { activeForm: 'Delegate', isVisible: false, data: null }

  submit = (data) => {
    this.setState({ isVisible: true, data })
  }

  handleConfirm = (password) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        const data = this.state.data
        const eosAccount = this.props.eosAccount
        const eosAccountName = eosAccount.get('data').get('account_name')
        const resource = this.props.resource

        if (this.state.activeForm === 'Delegate') {
          this.props.actions.delegateBandwidthRequested(data.set('resource', resource).set('eosAccountName', eosAccountName).set('password', password).toJS())
        } else {
          this.props.actions.undelegateBandwidthRequested(data.set('resource', resource).set('eosAccountName', eosAccountName).set('password', password).toJS())
        }
      })
    })
  }

  switchForm = (form) => {
    if (form !== this.state.activeForm) {
      this.props.actions.setActiveForm(form)
      this.setState({ activeForm: form })
      this.props.actions.clearBandwidthError()
      this.props.reset('delegateBandwidthForm')
    }
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { handleSubmit, invalid, pristine, bandwidth, locale, eosAccount } = this.props
    const delegating = bandwidth.get('delegating')
    const undelegating = bandwidth.get('undelegating')
    const showSuccess = bandwidth.get('showSuccess')
    const loading = delegating || undelegating
    const error = bandwidth.get('error')
    const disabled = invalid || pristine || loading
    const eosBalance = eosAccount.getIn(['data', 'core_liquid_balance']) ? eosAccount.getIn(['data', 'core_liquid_balance']).split(' ')[0] : 0
    const netWeight = eosAccount.getIn(['data', 'total_resources', 'net_weight']) ? eosAccount.getIn(['data', 'total_resources', 'net_weight']).split(' ')[0] : 0
    const cpuWeight = eosAccount.getIn(['data', 'total_resources', 'cpu_weight']) ? eosAccount.getIn(['data', 'total_resources', 'cpu_weight']).split(' ')[0] : 0
    const availableBalance = this.state.activeForm === 'Delegate' ? eosBalance : (this.props.resource === 'net' ? netWeight : cpuWeight)
    const balanceTitle = this.state.activeForm === 'Delegate' ? messages[locale].tra_popup_title_baln : messages[locale].tra_popup_title_stked

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.delegateBandwidthForm}>
          <Switch itemList={['Delegate', 'Undelegate']} active={this.state.activeForm} onSwitch={this.switchForm} />
          <Balance title={balanceTitle} value={availableBalance} unit="EOS" />
          <FormContainer>
            <Field
              name="quant"
              component={TextField}
              rightContent={<Text style={{ color: 'white' }}>EOS</Text>}
              normalize={normalizeUnitByCurrency('EOS')}
              keyboardType="numeric"
            />
            <SubmitButton
              disabled={disabled}
              loading={loading}
              onPress={handleSubmit(this.submit)}
              text={this.state.activeForm === 'Delegate' ? messages[locale].dlgt_popup_title_dlgt : messages[locale].dlgt_popup_title_undlgt}
            />
            <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearBandwidthError} />
            <Alert message={!!showSuccess && messages[locale].dlgt_popup_title_trasucc} dismiss={this.props.actions.hideSuccessModal} />
            <Prompt
              isVisible={this.state.isVisible}
              title={messages[locale].dlgt_popup_title_pwd}
              negativeText={messages[locale].dlgt_popup_buttom_can}
              positiveText={messages[locale].dlgt_popup_buttom_ent}
              type="secure-text"
              callback={this.handleConfirm}
              dismiss={this.closePrompt}
            />
          </FormContainer>
        </View>
      </IntlProvider>
    )
  }
}
