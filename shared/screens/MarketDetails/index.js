/* @jsx */
import React, { Component, Children } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { LeftButton, RightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import CoinInfoCard from './CoinInfoCard'
import MarketList from './MarketList'
import ChartWrapper from 'components/ChartWrapper'
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

  componentWillUnmount() {
    this.props.navigator.setDrawerEnabled({ side: 'left', enabled: true })
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  changeMarket = (data) => {
    alert(JSON.stringify(data))
  }

  changeRoute = (screen) => {
    this.props.navigator.push({ screen: `BitPortal.${screen}` })
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
            <ChartWrapper />
            <View style={styles.viewAllContainer}>
              <Text style={{ fontSize: FontScale(14), color: Colors.textColor_93_207_242 }}> View All </Text>
            </View>
            <MarketList changeMarket={(e) => this.changeMarket(e)} />
          </ScrollView>
        </View>

        <View style={[styles.btnContainer, styles.spaceAround]}>
          <ButtonElement Title="Token Details" onPress={() => this.changeRoute('TokenDetails')} />
          <ButtonElement Title="Fund Flow" onPress={() => this.changeRoute('FundFlow')} />
          <ButtonElement Title="Alerts" onPress={() => this.changeRoute('Alerts')} />
        </View>

      </View>
    )
  }

}
