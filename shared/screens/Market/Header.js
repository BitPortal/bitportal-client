
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from 'resources/colors'

export const Header = ({ exchange, selectMarket, searchCoin }) => (
  <View style={[styles.headerContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
    <TouchableOpacity onPress={() => selectMarket()} style={styles.navButton}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text24}>{exchange}</Text>
        <View style={{ transform: [{ rotateZ: '90deg' }], marginLeft: 5, marginTop: 3 }}>
          <Ionicons name="md-play" size={10} color={Colors.textColor_74_74_74} />
        </View>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => searchCoin()} style={styles.navButton}>
      <View style={{ marginLeft: 40 }}>
        <Ionicons name="md-search" size={20} color={Colors.textColor_74_74_74} />
      </View>
    </TouchableOpacity>
  </View>
)

export const Quotes = ({ quoteList, quote, onPress }) => (
  <View style={styles.quoteContainer}>
    {
      quoteList.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => { onPress(item) }}
          style={[styles.center, {
            flex: 1,
            borderBottomColor: Colors.borderColor_89_185_226,
            borderBottomWidth: quote == item ? StyleSheet.hairlineWidth : 0
          }]}
        >
          <Text style={[styles.text16, { color: Colors.textColor_74_74_74 }]}>{item}</Text>
        </TouchableOpacity>
      ))
    }
  </View>
)
