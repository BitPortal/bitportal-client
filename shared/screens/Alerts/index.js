/* @jsx */

import React from 'react'
import { connect } from 'react-redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import AlertInput from './AlertInput'
import AlertList from './AlertList'
import styles from './styles'

@connect(
  state => ({
    exchange: state.market.get('selectedExchange'),
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
    change: '',
    isEdited: false,
    dataArr: [
      { high: '5,049.09 USD', low: '3,030.00 USD', change: '32%' },
      { change: '45%' }
    ]
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

  changeMode = () => {
    this.setState({ isEdited: !this.state.isEdited })
  }

  deleteAlert = (index) => {
    this.state.dataArr.splice(index, 1)
    this.setState({ dataArr: this.state.dataArr })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" title="Alerts" onPress={() => this.pop()} />}
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
              <AlertInput value={this.state.high} title="High" unit="USD" onChangeText={e => this.changeHigh(e)} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <AlertInput value={this.state.change} title="Change" unit="%" onChangeText={e => this.onChange(e)} />
              <AlertInput value={this.state.low} title="Low" unit="USD" onChangeText={e => this.changeLow(e)} />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.btn} >
              <Text style={[styles.text14, { color: Colors.textColor_93_207_242 }]}> Add</Text>
            </TouchableOpacity>
            <AlertList isEdited={this.state.isEdited} dataArr={this.state.dataArr} deleteAlert={index => this.deleteAlert(index)} changeMode={() => this.changeMode()} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
