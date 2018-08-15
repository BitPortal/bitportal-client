import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider, FormattedNumber } from 'react-intl'
import { Text, View, TouchableWithoutFeedback, InteractionManager, LayoutAnimation } from 'react-native'
import * as producerActions from 'actions/producer'
import * as votingActions from 'actions/voting'
import { bindActionCreators } from 'redux'
import { eosAccountSelector } from 'selectors/eosAccount'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { sortProducers } from 'eos'
import VotingModal from './VotingModal'
import ProducerList from './ProducerList'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.vt_popup_title_pwderr
    case 'assertion failure with message: user must stake before they can vote':
      return messages.vt_popup_title_nostaker
    default:
      return messages.vt_popup_title_failed
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    producer: state.producer,
    eosAccount: eosAccountSelector(state),
    voting: state.voting
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...producerActions,
      ...votingActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Voting extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isVisible: false,
    alertMessage: null,
    item: {},
    selected: this.props.eosAccount.get('data').get('voter_info') ? this.props.eosAccount.get('data').get('voter_info').get('producers').toJS() : [],
    sortType: 'default'
  }

  changeSort = () => {
    if (this.state.sortType === 'default') {
      this.setState({ sortType: 'ranking' }, () => {
        this.props.actions.sortProducers('ranking')
      })
    } else {
      this.setState({ sortType: 'default' }, () => {
        this.props.actions.sortProducers('default')
      })
    }
  }

  submitVoting = (password) => {
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    this.props.actions.votingRequested({ producers: this.state.selected, eosAccountName, password })
  }

  voting = () => {
    this.setState({ isVisible: true })
  }

  handleConfirm = (password) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        this.submitVoting(password)
      })
    })
  }

  vote = () => {
    const { locale } = this.props
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    if (!eosAccountName) {
      this.setState({ alertMessage: messages[locale].vt_button_name_err })
    } else {
      this.props.actions.showSelected()
    }
  }

  checkResources = () => {
    const { locale } = this.props
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    if (!eosAccountName) {
      this.setState({ alertMessage: messages[locale].vt_button_name_err })
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.Resources'
        }
      })
    }
  }

  onRowPress = (producer) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ProducerDetails',
        passProps: {
          producer,
          totalProducers: this.props.producer
        }
      }
    })
  }

  onMarkPress = (producer) => {
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
      this.setState(() => ({
        selected: nextState
      }))
    }
  }

  onRefresh = () => {
    this.props.actions.getProducersWithInfoRequested({ json: true, limit: 500 })
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  closeAlert = () => {
    this.setState({ alertMessage: null })
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  componentDidMount() {
    this.props.actions.getProducersWithInfoRequested({ json: true, limit: 500 })
  }

  render() {
    const { locale, producer, eosAccount, voting } = this.props
    const loading = producer.get('loading')
    const loaded = producer.get('loaded')
    const disabled = !this.state.selected.length && !this.props.producer.getIn(['data', 'rows']).size
    const voterInfo = eosAccount.getIn(['data', 'voter_info'])
    const isVoting = voting.get('loading')
    const error = voting.get('error')
    const showSelected = voting.get('showSelected')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].vt_title_name_vote}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.goBack} />}
          />
          <View style={[styles.stakeAmountContainer, styles.between]}>
            <Text style={styles.text14}>
              {'Stake: '}
              <FormattedNumber
                value={voterInfo ? (+voterInfo.get('staked') / 1000) : 0}
                maximumFractionDigits={4}
                minimumFractionDigits={4}
              />
              {' EOS'}
            </Text>
            <LinearGradientContainer type="right" colors={Colors.voteColor} style={[styles.resourcesBtn, { marginRight: -10 }]}>
              <TouchableWithoutFeedback style={styles.center} underlayColor="transparent" onPress={this.checkResources}>
                <View>
                  <Text style={[styles.text14, { marginHorizontal: 10, marginVertical: 2 }]}>
                    <FormattedMessage id="vt_rscs_button_rscs" />
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </LinearGradientContainer>
          </View>
          <View style={[styles.titleContainer, styles.between]}>
            <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]} onPress={this.changeSort}>
              <FormattedMessage id="vt_sec_title_def" />/<FormattedMessage id="vt_sec_title_rk" />
            </Text>
          </View>
          <View style={styles.scrollContainer}>
            <ProducerList
              data={producer.getIn(['data', 'rows'])}
              totalVotes={producer.getIn(['data', 'total_producer_vote_weight'])}
              onRefresh={this.onRefresh}
              refreshing={loading && !loaded}
              onRowPress={this.onRowPress}
              onMarkPress={this.onMarkPress}
              selected={this.state.selected}
            />
          </View>
          <View style={[styles.btnContainer, styles.between]}>
            <Text style={styles.text14}><FormattedMessage id="vt_btmsec_name_selected" /></Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text14, { marginRight: 15 }]}>{this.state.selected.length}/30</Text>
              <LinearGradientContainer type="right" colors={disabled ? Colors.disabled : Colors.voteColor} style={styles.voteBtn}>
                <TouchableWithoutFeedback onPress={disabled ? () => {} : this.vote} style={styles.center} disabled={disabled}>
                  <View>
                    <Text style={[styles.text14, { marginHorizontal: 10, marginVertical: 2 }]}>
                      <FormattedMessage id="vt_button_name_vote" />
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </LinearGradientContainer>
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
          <Alert message={this.state.alertMessage} dismiss={this.closeAlert} />
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearVotingError} />
          <Prompt
            isVisible={this.state.isVisible}
            title={messages[locale].vt_popup_title_pwd}
            negativeText={messages[locale].vt_popup_buttom_can}
            positiveText={messages[locale].vt_popup_buttom_ent}
            type="secure-text"
            callback={this.handleConfirm}
            dismiss={this.closePrompt}
          />
        </View>
      </IntlProvider>
    )
  }
}
