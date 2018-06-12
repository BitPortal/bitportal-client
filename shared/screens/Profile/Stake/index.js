/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import { Text, View, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class Stake extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    amount: 0
  }

  enterStakeAmount = (amount) => {
    this.setState({ amount })
  }

  stakeEOS = () => {
    
  }

  render() {
    const { amount } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['vt_title_name_vote']}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <View style={styles.content}>

             <Text style={[styles.text16, { marginLeft: -1 }]}> 
                Stake EOS
              </Text>
              <Text style={[styles.text14, { color: Colors.textColor_181_181_181, marginVertical: 15 }]} multiline={true}> 
                you have to stake your EOS in the contact for voting. if you want to retreat your EOS, it will need 72 hours to unlock
              </Text>

              <InputItem 
                title={'Enter the stake amount'} 
                placeholder="" 
                keyboardType="numeric"
                onChangeText={(e) => this.enterStakeAmount(e)} 
                TipsComponent={() => (
                  <Text style={[styles.text14, { color: Colors.textColor_181_181_181}]}> 
                    EOS
                  </Text>
                )}
              />

              <TouchableHighlight 
                onPress={() =>  this.stakeEOS()} 
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, {
                  marginTop: 20,
                  backgroundColor: Colors.textColor_89_185_226
                }]}
              >
                <Text style={styles.text14}> 
                  Next
                </Text>
              </TouchableHighlight>

            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
