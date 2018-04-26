
import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import styles from './styles'
import {
  Text,
  View,
  TouchableHighlight,
  VirtualizedList,
  ScrollView
} from 'react-native'

const HeaderTitle = ({ }) => (
  <View>
    <View style={[styles.listItem, styles.headerTitle]}>
      <View style={[styles.coin, styles.center, {height: 25}]}>
        <Text style={[styles.text12]}>
          Code
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <Text style={[styles.text12, {marginHorizontal: 10}]}>
          Volume
        </Text>
      </View>
      <View style={{ paddingRight: 15 }}>
        <Text style={[styles.text12]}>
          Price (BTC)
        </Text>
      </View>
    </View>
  </View>
)

const ListItem = ({ data, index, itemExtraStyle, onPress }) => (
  <TouchableHighlight
    key={index}
    onPress={() => onPress(data)}
  >
    <View style={[styles.listItem, { ...itemExtraStyle }]}>
      <View style={styles.coin}>
        <Text style={[styles.text16, { marginHorizontal: 10, color: Colors.textColor_80_80_80 }]}>
          {index + 1}
        </Text>
        <Text style={[styles.text16, {marginHorizontal: 10}]}>
          {data.get('base_asset')}
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <Text style={[styles.text16, { marginHorizontal: 10 }]}>
          <FormattedNumber
            value={data.get('quote_volume')}
            maximumFractionDigits={2}
            minimumFractionDigits={2}
          />
        </Text>
      </View>
      <View style={{ paddingRight: 15 }}>
        <Text style={[styles.text16, { color: Colors.textColor_80_201_109 }]}>
          <FormattedNumber
             value={data.get('price_last')}
             maximumFractionDigits={8}
             minimumFractionDigits={8}
           />
        </Text>
      </View>
    </View>
  </TouchableHighlight>
)

export default TableView = ({ data, itemExtraStyle, onPress }) => {
  return (
    <View style={styles.scrollContainer}>
      <HeaderTitle />
      <VirtualizedList
        style={styles.list}
        data={data}
        getItem={(items, index) => items.get ? items.get(index) : items[index]}
        getItemCount={(items) => (items.count() || 0)}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => <ListItem key={index} data={item} index={index} onPress={(e) => onPress(e)} />}
      />
    </View>
  )
}
