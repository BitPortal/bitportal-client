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
import VoteList from './VoteList'
import * as voteActions from 'actions/vote'
import { bindActionCreators } from 'redux'
import VoteModal from './VoteModal'
import { voteProcuderSelector } from 'selectors/vote'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    loading: state.vote.get('loading'),
    vote: voteProcuderSelector(state)
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...voteActions
    }, dispatch)
  })
)

export default class Vote extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isVisible: false,
    item: {}
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

  onRowPress = (item) => {
    this.props.actions.selectProducer(item)
  }

  // "json": { "type": "bool", "default": false},
  // "lower_bound": "string",
  // "limit": {"type": "uint32", "default": "10"}

  onRefresh = () => {
    console.log("### --fetch producer")
    let params = { json: false, lower_bound: '', limit: 10 }
    this.props.actions.getVoteDataRequested(params)
  }

  render() { 
    const { locale, vote, loading } = this.props
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
            <VoteList
              data={vote.get('data')}
              onRefresh={this.onRefresh}
              refreshing={loading}
              onRowPress={this.onRowPress}
            />
          </View>

          <View style={[styles.btnContainer, styles.between]}>
            <Text style={styles.text14}> Selected </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text14, { marginRight: 15 }]}> {vote.get('selectedProducers').size}/30 </Text>
              <TouchableOpacity onPress={this.vote} style={[styles.center, styles.voteBtn]}>
                <Text style={styles.text14}> Vote </Text>
              </TouchableOpacity>
            </View>
          </View> 

          <VoteModal 
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
