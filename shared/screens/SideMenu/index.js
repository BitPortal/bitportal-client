/* @tsx */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import styles from './styles'
import { connect } from 'react-redux'
import Colors from 'resources/colors';

const Title = () => (
  <View style={styles.title}>
    <Text style={styles.text16}>
      Exchange
    </Text> 
  </View>
)

const Segment = () => (
  <View style={[styles.segment, styles.center]}>
    <TouchableOpacity style={[styles.btnStyle, styles.center]}>
      <Text style={styles.text14}>
        All
      </Text>
    </TouchableOpacity>
    <View style={styles.divider} />
    <TouchableOpacity style={[styles.btnStyle, styles.center]}>
      <Text style={[styles.text14, {color: Colors.textColor_6A6A6A}]}>
        Option
      </Text>
    </TouchableOpacity>
  </View>
) 

@connect(
  (state) => ({
    
  })
)
export default class SideMenu extends Component {

  state = {
    markets: [
      { key: 'OKey' },   { key: '币安' }, { key: 'Gate.io' }, { key: 'Huobi Pro' }, { key: 'BTCC' }, 
      { key: 'ZB' },     { key: '币赢' }, { key: 'Bittrex' }, { key: 'Bitfinex' },  { key: 'CEO' },
      { key: 'HitBTC' }
    ]
  }

  selectMarket = (item) => {
    this.props.navigator.toggleDrawer({
      side: 'left', 
      animated: true, 
      to: 'close'
    });
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.selectMarket(item)} style={styles.listItem}>
        <Text style={styles.text16}>
          {item.key}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Title />
        <Segment />
        <View style={styles.list}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.markets}
            renderItem={this.renderItem}
          />
        </View> 
      </View>
    )
  }
}