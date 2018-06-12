
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, ScrollView, TouchableHighlight, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FormattedNumber } from 'react-intl'

const ListItem = ({ item, onPress, eosPrice }) => (
  <TouchableHighlight underlayColor={Colors.hoverColor} style={styles.listContainer} onPress={() => onPress(item)} >
    <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.minorThemeColor }]}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.text20}> {item.get('symbol')} </Text>
      </View>
      <View>
        <Text style={[styles.text20, { alignSelf: 'flex-end' }]}>
          <FormattedNumber
            value={item.get('balance')}
            maximumFractionDigits={4}
            minimumFractionDigits={4}
          />
        </Text>
        <Text style={[styles.text14, { alignSelf: 'flex-end', color: Colors.textColor_149_149_149 }]}>
          ≈ ¥
          <FormattedNumber
            value={+item.get('balance') * +eosPrice * 6.41}
            maximumFractionDigits={2}
            minimumFractionDigits={2}
          />
        </Text>
      </View>
    </View>
  </TouchableHighlight>
)

export default BalanceList = ({ data, onPress, eosPrice }) => (
  <View>{data.map((item, index) => (<ListItem key={index} item={item} eosPrice={eosPrice} onPress={(e) => onPress(e)} />))}</View>
)
