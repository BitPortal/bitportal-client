
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from 'resources/colors'

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
            borderBottomWidth: quote === item ? StyleSheet.hairlineWidth : 0
          }]}
        >
          <Text style={[styles.text16, { color: Colors.textColor_255_255_238 }]}>{item}</Text>
        </TouchableOpacity>
      ))
    }
  </View>
)
