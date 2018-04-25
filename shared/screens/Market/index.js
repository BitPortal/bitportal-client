/* @tsx */

import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import SearchItem from 'screens/Market/SearchItem'
import TableView from 'screens/Market/TableView'
import BaseScreen from 'components/BaseScreen'
import { selectCoin } from 'actions/drawer'
import { bindActionCreators } from 'redux'
import NavigationBar, { LeftButton, RightButton } from 'components/NavigationBar'
import { Text, View, TouchableOpacity } from 'react-native'

@connect(
  (state) => ({
    market: state.drawer.get('selectedMarket')
  }),
  (dispatch) => ({
    actions: bindActionCreators({ selectCoin }, dispatch)
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
    this.props.actions.selectCoin(item.key)
    this.props.navigator.setDrawerEnabled({ side: 'left', enabled: false })
    this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
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
          data={[{ key: 'BTC' }, { key: 'ETH' }, { key: 'VEN' }, { key: 'BCH' }, { key: 'ETC' }, { key: 'ULA' }]}
          onPress={(e) => this.pressListItem(e)}
        />
        
      </View>
    )
  }
}
