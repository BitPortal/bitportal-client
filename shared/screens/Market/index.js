/* @tsx */

import React, { Component } from 'react'
import BTCIcon from 'resources/icons/BTCIcon'
import styles from './styles'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import SearchItem from 'screens/Market/SearchItem'
import TableView from 'screens/Market/TableView'
import NavigationBar, { LeftButton, RightButton } from 'components/NavigationBar'
import { Text, View, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'

@connect(
  (state) => ({
    market: state.drawer.get('selectedMarket')
  })
)

export default class Market extends BaseScreen {
  
  state = { 
    text: null 
  }

  searchCoin = () => {
    this.props.navigator.push({ 
      screen: 'BitPortal.Search', 
      animationType: 'fade', 
      navigatorStyle: { 
        navBarHidden: true
      } 
    })
  }

  openDrawer = () => {
    this.props.navigator.toggleDrawer({ side: 'left', animated: true, to: 'open' })
  }

  pressListItem = (item) => {
    this.props.navigator.push({ screen: 'BitPortal.Welcome', animationType: 'fade' })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={
            <LeftButton iconName="md-menu" title={this.props.market} onPress={() => this.openDrawer()}/>
          }
          rightButton={(
            <RightButton onPress={() => {}} />
          )}
        />
        <SearchItem onPress={() => this.searchCoin()} />
        <TableView 
          data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }]}
          onPress={(e) => this.pressListItem(e)}
        />
        
      </View>
    )
  }
}
