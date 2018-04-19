/* @jsx */
import React, { Component, Children } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { LeftButton, RightButton, CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import AlertInput from './AlertInput'
import Colors from 'resources/colors'

@connect(
  state => ({
    market: state.drawer.get('selectedMarket')
  })
)

export default class Alerts extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    high: '',
    low: '',
    change: ''
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  changeHigh = (high) => {
    this.setState({ high })
  }

  onChange = (change) => {
    this.setState({ change })
  }

  changeLow = (low) => {
    this.setState({ low })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<LeftButton iconName="md-arrow-back" title="Alerts" onPress={() => this.goBack()} />}
          rightButton={
            <CommonButton onPress={() => {}} Children={<Text style={styles.text14}>{this.props.market} {`\u25BC`} </Text>} />  
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
                <Text style={[styles.text14, { marginBottom: 10, color: Colors.textColor_149_149_149 }]}> Current Price (BTM) </Text>
                <View style={[styles.textInputContainer, { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 4 }]}>
                  <Text style={[styles.text18]}>
                    11,949.00 USD
                  </Text>
                </View>
              </View>
              <AlertInput value={this.state.high} title="High" unit="USD" onChangeText={(e) => this.changeHigh(e)} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <AlertInput value={this.state.change} title="Change" unit="%" onChangeText={(e) => this.onChange(e)} />
              <AlertInput value={this.state.low} title="Low" unit="USD" onChangeText={(e) => this.changeLow(e)} />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.btn} >
              <Text style={[styles.text14, { color: Colors.textColor_93_207_242 }]}> Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </View>
    )
  }

}
