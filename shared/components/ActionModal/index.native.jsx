import React, { Component, Fragment } from 'react'
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { FormattedMessage, /* FormattedNumber, */IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import { messageTypeSelector, messageInfoSelector } from 'selectors/dappBrowser'
import { noop } from 'utils'
import styles from './styles'
import messages from './messages'

const TransferActionItems = ({ info, locale }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].general_action_modal_text_action}:</Text>
      <Text style={styles.data}>
        {messages[locale].transfer_action_modal_text_payment}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].transfer_action_modal_text_contract}:</Text>
      <Text style={styles.data}>
        {info.get('contract')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].transfer_action_modal_text_amount}:</Text>
      <Text style={styles.data}>
        {info.get('amount')} {info.get('symbol')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].transfer_action_modal_text_payment_account}:</Text>
      <Text style={styles.data}>
        {info.get('fromAccount')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].transfer_action_modal_text_receiving_account}:</Text>
      <Text style={styles.data}>
        {info.get('toAccount')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].transfer_action_modal_text_memo}:</Text>
      <Text style={styles.data}>
        {info.get('memo')}
      </Text>
    </View>
  </Fragment>
)

const VoteActionItems = ({ info, locale }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].general_action_modal_text_action}:</Text>
      <Text style={styles.data}>
        {messages[locale].voting_action_modal_text_vote}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].voting_action_modal_text_voter}:</Text>
      <Text style={styles.data}>
        {info.get('voter')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].voting_action_modal_text_selected_node}:</Text>
      <ScrollView style={styles.dataView}>
        {info.get('producers').map(producer => <Text key={producer} style={styles.data}>{producer}</Text>)}
      </ScrollView>
    </View>
  </Fragment>
)

const SignActionItems = ({ info, locale }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].general_action_modal_text_action}:</Text>
      <Text style={styles.data}>
        {messages[locale].sign_action_modal_text_sign}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].sign_action_modal_text_signer}:</Text>
      <Text style={styles.data}>
        {info.get('account')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].sign_action_modal_text_public_key}:</Text>
      <Text style={styles.data}>
        {info.get('publicKey')}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].sign_action_modal_text_signed_content}:</Text>
      <Text style={styles.data}>
        {info.get('signData')}
      </Text>
    </View>
  </Fragment>
)

const PushActionItems = ({ info, locale }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].general_action_modal_text_action}:</Text>
      <Text style={styles.data}>
        {messages[locale].contract_action_modal_text_execute}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].contract_action_modal_text_details}:</Text>
      <ScrollView style={styles.dataView}>
        {info.get('actions').map(action => (
          <View key={`${action.get('account')}-${action.get('name')}`} style={styles.dataViewAction}>
            <Text style={styles.data}>
              <Text>{messages[locale].contract_action_modal_text_account}</Text>
              <Text style={styles.highlight}> {`${action.getIn(['authorization', 0, 'actor'])}@${action.getIn(['authorization', 0, 'permission'])}`}{'\n'}</Text>
              <Text>{messages[locale].contract_action_modal_text_contract}</Text>
              <Text style={styles.highlight}> {action.get('account')}{'\n'}</Text>
              <Text>{messages[locale].contract_action_modal_text_action}</Text>
              <Text style={styles.highlight}> {action.get('name')}{'\n'}</Text>
              <Text>{messages[locale].contract_action_modal_text_list}:</Text>
            </Text>
            <View style={styles.actionData}>
              {action.get('data').entrySeq().map(item => (
                <View key={item[0]} style={styles.actionDataItem}>
                  <Text style={styles.actionDataLabel}>{item[0]}: </Text>
                  <Text style={styles.actionDataValue}>{item[1]}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </Fragment>
)

const SignatureActionItems = ({ info, locale }) => (
  <Fragment>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].general_action_modal_text_action}:</Text>
      <Text style={styles.data}>
        {messages[locale].contract_action_modal_text_execute}
      </Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>{messages[locale].contract_action_modal_text_details}:</Text>
      <ScrollView style={styles.dataView}>
        {info.getIn(['transaction', 'actions']).map(action => (
          <View key={`${action.get('account')}-${action.get('name')}`} style={styles.dataViewAction}>
            <Text style={styles.data}>
              <Text>{messages[locale].contract_action_modal_text_account}</Text>
              <Text style={styles.highlight}> {`${action.getIn(['authorization', 0, 'actor'])}@${action.getIn(['authorization', 0, 'permission'])}`}{'\n'}</Text>
              <Text>{messages[locale].contract_action_modal_text_contract}</Text>
              <Text style={styles.highlight}> {action.get('account')}{'\n'}</Text>
              <Text>{messages[locale].contract_action_modal_text_action}</Text>
              <Text style={styles.highlight}> {action.get('name')}{'\n'}</Text>
              <Text>{messages[locale].contract_action_modal_text_list}:</Text>
            </Text>
            <View style={styles.actionData}>
              {action.get('data').entrySeq().map(item => (
                <View key={item[0]} style={styles.actionDataItem}>
                  <Text style={styles.actionDataLabel}>{item[0]}: </Text>
                  <Text style={styles.actionDataValue}>{item[1]}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </Fragment>
)

@connect(
  state => ({
    locale: state.intl.locale,
    dappBrowser: state.dappBrowser,
    messageType: messageTypeSelector(state),
    messageInfo: messageInfoSelector(state)
  })
)

export default class ActionModal extends Component {
  renderItems = (messageType, info) => {
    if (messageType === 'eosAuthSign') {
      return (<SignActionItems info={info} locale={this.props.locale} />)
    } else if (messageType === 'transferEOSAsset') {
      return (<TransferActionItems info={info} locale={this.props.locale} />)
    } else if (messageType === 'voteEOSProducers') {
      return (<VoteActionItems info={info} locale={this.props.locale} />)
    } else if (messageType === 'pushEOSAction') {
      return (<PushActionItems info={info} locale={this.props.locale} />)
    } else if (messageType === 'requestSignature') {
      return (<SignatureActionItems info={info} locale={this.props.locale} />)
    }

    return null
  }

  render() {
    const {
      isVisible,
      dismiss,
      confirm,
      locale,
      loading,
      messageType,
      messageInfo
    } = this.props

    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0 }}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
        <IntlProvider messages={messages[locale]}>
          <View style={styles.mask}>
            <TouchableWithoutFeedback onPress={dismiss}>
              <View style={styles.outside} />
            </TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header} onPress={() => {}}>
                <TouchableOpacity onPress={dismiss} style={styles.close}>
                  <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
                </TouchableOpacity>
                <Text style={styles.title}>{messages[locale].contract_action_modal_text_transaction}</Text>
              </View>
              <View style={styles.body}>
                {this.renderItems(messageType, messageInfo)}
                <View style={[styles.item, styles.buttonItem]}>
                  <TouchableOpacity
                    onPress={!loading ? confirm : noop}
                    disabled={loading}
                    underlayColor={Colors.textColor_89_185_226}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>
                      <FormattedMessage id="send_confirm_button_confirm" />
                    </Text>
                    {loading && <ActivityIndicator style={styles.indicator} size="small" color="white" />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }
}
