/* @tsx */

import React, { Component } from 'react'
import BTCIcon from 'resources/icons/BTCIcon'
import styles from './styles'
import NavigationBar from 'components/NavigationBar'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import SearchItem from 'screens/Market/SearchItem'
import TableView from 'screens/Market/TableView'
import { Text, View, TouchableOpacity } from 'react-native'

@connect(
  (state) => ({
    market: state.drawer.get('selectedMarket')
  })
)

export default class Market extends Component {
  
  state = { 
    text: null 
  }

  searchCoin = () => {
    this.props.navigator.showModal({ 
      screen: 'BitPortal.Search', 
      animationType: 'fade', 
      navigatorStyle: { navBarHidden: true } 
    })
  }

  openDrawer = () => {
    this.props.navigator.toggleDrawer({ side: 'left', animated: true, to: 'open' })
  }

  render() {
    const { navigator } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={(
            <TouchableOpacity
              onPress={() => this.openDrawer()}
              style={styles.navButton}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="md-menu" size={22} color={Colors.bgColor_FFFFFF} />
                <Text style={[styles.text20, {marginLeft: 10}]}>
                  {this.props.market}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          rightButton={(
            <TouchableOpacity
              onPress={() => {}}
              style={styles.navButton}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.text13, {marginTop: -FontScale(13), marginLeft: -FontScale(13)}]}>
                  BTC
                </Text>
                <Text style={[styles.text13, {marginBottom: -FontScale(8), marginRight: -FontScale(8)}]}>
                  ETH
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <SearchItem onPress={() => this.searchCoin()} />
        <TableView 
          data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }]}
        />
        
      </View>
    )
  }
}
