/* @tsx */
import React, { Component, Children } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'
import SearchItem from 'screens/Search/SearchItem'
import NavigationBar, { LeftButton, RightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import CoinInfoCard from './CoinInfoCard'
import MarketList from './MarketList'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'

const ButtonElement = ({ Title, onPress }) => (
  <TouchableOpacity style={[styles.btn, styles.center]} onPress={() => onPress()}>
    <Text style={styles.text14}>
      {Title}
    </Text>
  </TouchableOpacity>
)

@connect(
  (state) => ({
    market: state.drawer.get('selectedMarket')
  })
)

export default class MarketDetails extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  changeMarket = (data) => {
    alert(JSON.stringify(data))
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={
            <LeftButton iconName="md-arrow-back" title={this.props.market} onPress={() => this.goBack()} />
          }
          rightButton={
            <RightButton onPress={() => {}} />
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <CoinInfoCard />
            <View style={{ width: SCREEN_WIDTH, height: 160, backgroundColor: Colors.bgColor_59_59_59 }}/>
            <View style={styles.viewAllContainer}>
              <Text style={{ fontSize: FontScale(14), color: Colors.textColor_93_207_242 }}> View All </Text>
            </View>
            <MarketList changeMarket={(e) => this.changeMarket(e)} />
          </ScrollView>
        </View>

        <View style={[styles.btnContainer, styles.spaceAround]}>
          <ButtonElement Title="Token Details" onPress={() => {}} />
          <ButtonElement Title="Fund Flow" onPress={() => {}} />
          <ButtonElement Title="Alerts" onPress={() => {}} />
        </View>

      </View>
    )
  }

}
