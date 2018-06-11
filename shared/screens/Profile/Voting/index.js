/* @tsx */
import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider, FormattedNumber } from 'react-intl'
import { Text, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import messages from './messages'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProducerList from './ProducerList'
import * as producerActions from 'actions/producer'
import { bindActionCreators } from 'redux'
import VotingModal from './VotingModal'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    producer: state.producer
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...producerActions
    }, dispatch)
  })
)

export default class Voting extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isVisible: false,
    item: {},
    selected: []
  }

  componentDidMount() {
    // this.props.actions.getVoteDataRequested()
  }

  checkRules = () => {

  }

  vote = () => {
    this.setState({ isVisible: true })
  }

  stakeEOS = () => {
    this.setState({ isVisible: false }, () => {
      this.props.navigator.push({ screen: 'BitPortal.Stake' })
    })
  }

  onRowPress = (producer) => {
    const name = producer.get('owner')

    if (!~this.state.selected.indexOf(name)) {
      this.setState(prevState => ({
        selected: [...prevState.selected, name]
      }))
    } else {
      const index = this.state.selected.indexOf(name)
      const nextState = [...this.state.selected]
      nextState.splice(index, 1)
      this.setState(prevState => ({
        selected: nextState
      }))
    }
  }

  onRefresh = () => {
    this.props.actions.getProducersRequested({ json: true, limit: 10 })
  }

  didAppear() {
    this.props.actions.getProducersRequested({ json: true, limit: 500 })
  }

  render() {
    const { locale, producer } = this.props
    const loading = producer.get('loading')
    const disabled = !this.state.selected.length

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['vt_title_name_vote']}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
            rightButton={{ title: '规则', handler: this.checkRules, tintColor: Colors.textColor_255_255_238,  style: { paddingRight: 25 } }}
          />
          <View style={[styles.stakeAmountContainer, styles.between]}>
            <Text style={[styles.text14, { marginLeft: 32 }]}> Stake Amount </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text14}>
                <FormattedNumber
                  value={4235354}
                  maximumFractionDigits={4}
                  minimumFractionDigits={4}
                />
              </Text>
              <Text style={[styles.text14, { marginLeft: 2, marginRight: 5 }]}> EOS </Text>
              <TouchableOpacity onPress={() => this.stakeEOS()}>
                <View style={{ padding: 5, margin: 10, marginRight: 20 }}>
                  <Ionicons name="ios-create" size={24} color={Colors.bgColor_FAFAFA} />
                </View>
              </TouchableOpacity>
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
            onPress={this.stakeEOS}
            isVisible={this.state.isVisible}
            dismissModal={() => { this.setState({ isVisible: false }) }}
          />
        </View>
      </IntlProvider>
    )
  }
}
