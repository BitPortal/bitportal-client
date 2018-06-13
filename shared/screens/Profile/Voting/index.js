/* @tsx */
import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider, FormattedNumber } from 'react-intl'
import { Text, View, TouchableOpacity, Alert } from 'react-native'
import messages from './messages'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProducerList from './ProducerList'
import * as producerActions from 'actions/producer'
import * as votingActions from 'actions/voting'
import { bindActionCreators } from 'redux'
import { eosAccountSelector } from 'selectors/eosAccount'
import VotingModal from './VotingModal'
import Loading from 'components/Loading'
import AlertComponent from 'components/Alert'
import Dialogs from 'components/Dialog'
import { sortProducers } from 'eos'

export const errorMessages = (error) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return 'Invalid password!'
    case 'assertion failure with message: user must stake before they can vote':
      return 'You need stake before vote!'
    default:
      return 'Voting failed!'
  }
}

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    producer: state.producer,
    eosAccount: eosAccountSelector(state),
    voting: state.voting
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...producerActions,
      ...votingActions
    }, dispatch)
  })
)

export default class Voting extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      isVisible: false,
      item: {},
      selected: this.props.eosAccount.get('data').get('voter_info') ? this.props.eosAccount.get('data').get('voter_info').get('producers').toJS() : []
    }

    this.voting = this.voting.bind(this)
    this.submitVoting = this.submitVoting.bind(this)
  }

  componentDidMount() {
    // this.props.actions.getVoteDataRequested()
  }

  checkRules = () => {

  }

  submitVoting = (password) => {
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    this.props.actions.votingRequested({ producers: this.state.selected, eosAccountName, password })
  }

  async voting() {
    const { action, text } = await Dialogs.prompt(
      '请输入密码',
      '',
      {
        positiveText: 'Confirm',
        negativeText: 'Cancel'
      }
    )

    if (action === Dialogs.actionPositive) {
      this.submitVoting(text)
    }
  }

  vote = () => {
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    if (!eosAccountName) {
      Alert.alert(
        'Please import EOS account!',
        null,
        [
          { text: 'OK', onPress: () => console.log('ok') },
        ],
        { cancelable: false }
      )
    } else {
      this.props.actions.showSelected()
    }
  }

  stakeEOS = () => {
    this.setState({ isVisible: false }, () => {
      this.props.navigator.push({ screen: 'BitPortal.Stake' })
    })
  }

  onRowPress = (producer) => {
    const name = producer.get('owner')

    if (!~this.state.selected.indexOf(name)) {
      if (this.state.selected.length < 30) {
        this.setState(prevState => ({
          selected: [...prevState.selected, name].sort(sortProducers)
        }))
      }
    } else {
      const index = this.state.selected.indexOf(name)
      const nextState = [...this.state.selected].sort(sortProducers)
      nextState.splice(index, 1)
      this.setState(prevState => ({
        selected: nextState
      }))
    }
  }

  onRefresh = () => {
    this.props.actions.getProducersRequested({ json: true, limit: 500 })
  }

  didAppear() {
    this.props.actions.getProducersRequested({ json: true, limit: 500 })
  }

  render() {
    const { locale, producer, eosAccount, voting } = this.props
    const loading = producer.get('loading')
    const disabled = !this.state.selected.length && !this.props.producer.get('data').get('rows').siz
    const voterInfo = eosAccount.get('data').get('voter_info')
    const isVoting = voting.get('loading')
    const error = voting.get('error')
    const showSelected = voting.get('showSelected')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['vt_title_name_vote']}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
          />
          <AlertComponent message={errorMessages(error)} dismiss={this.props.actions.clearError} />
          <View style={[styles.stakeAmountContainer, styles.between]}>
            <Text style={[styles.text14, { marginLeft: 32 }]}>Stake Amount</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text14}>
                <FormattedNumber
                  value={voterInfo ? voterInfo.get('staked') : 0}
                  maximumFractionDigits={4}
                  minimumFractionDigits={4}
                />
              </Text>
              <Text style={[styles.text14, { marginLeft: 2, marginRight: 5 }]}> EOS </Text>
              {/* <TouchableOpacity onPress={() => this.stakeEOS()}>
                  <View style={{ padding: 5, margin: 10, marginRight: 20 }}>
                  <Ionicons name="ios-create" size={24} color={Colors.bgColor_FAFAFA} />
                  </View>
                  </TouchableOpacity> */}
            </View>
          </View>
          <View style={[styles.titleContainer, styles.between]}>
            <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]}> {`Name & Loacation`} </Text>
            <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]}> Votes </Text>
          </View>
          <View style={styles.scrollContainer}>
            <ProducerList
              data={producer.get('data').get('rows')}
              onRefresh={this.onRefresh}
              refreshing={loading}
              onRowPress={this.onRowPress}
              selected={this.state.selected}
            />
          </View>
          <View style={[styles.btnContainer, styles.between]}>
            <Text style={styles.text14}>Selected</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text14, { marginRight: 15 }]}>{this.state.selected.length}/{this.props.producer.get('data').get('rows').size}</Text>
              <TouchableOpacity onPress={disabled ? () => {} : this.vote} style={[styles.center, styles.voteBtn, disabled ? styles.disabled : {}]} disabled={disabled}>
                <Text style={styles.text14}>Vote</Text>
              </TouchableOpacity>
            </View>
          </View>
          <VotingModal
            item={this.state.item}
            onPress={this.voting}
            isVisible={showSelected}
            dismissModal={this.props.actions.closeSelected}
            selected={this.state.selected}
            isVoting={isVoting}
          />
        </View>
      </IntlProvider>
    )
  }
}
