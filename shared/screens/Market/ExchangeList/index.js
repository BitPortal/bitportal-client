
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import Colors from 'resources/colors'
import { EXCHANGE_NAMES } from 'constants/market'

const ListItem = ({ exchange, onPress, active }) => (
  <TouchableHighlight
    underlayColor={Colors.hoverColor}
    style={styles.listContainer}
    onPress={() => onPress(exchange)}
  >
    <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32 }]}>
      <Text style={styles.text16}>{EXCHANGE_NAMES[exchange]}</Text>
      {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
    </View>
  </TouchableHighlight>
)

export default ExchangeList = ({ dismissModal, activeExchange, exchangeList, changeExchange }) => (
  <View style={styles.container}>
    <TouchableOpacity style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]} onPress={() => dismissModal()} />
    <View style={styles.bgContainer}>
      <ScrollView 
        style={{ maxHeight: 400, backgroundColor: Colors.bgColor_48_49_59 }} 
        showsVerticalScrollIndicator={false}
      >
        {
          exchangeList.map(
            (exchange, index) => (
              <ListItem 
                key={index} 
                exchange={exchange} 
                active={activeExchange === exchange} 
                onPress={() => changeExchange(exchange)} 
              />
            )
          )
        }
      </ScrollView>
    </View>
  </View>
)
