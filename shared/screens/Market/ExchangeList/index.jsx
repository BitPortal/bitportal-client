import React from 'react'
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
import styles from './styles'

const ListItem = ({ exchange, onPress, active }) => (
  <TouchableHighlight
    underlayColor={Colors.hoverColor}
    style={styles.listContainer}
    onPress={() => onPress(exchange)}
  >
    <View
      style={[styles.listContainer, styles.between, { paddingHorizontal: 32 }]}
    >
      <Text style={styles.text16}>{EXCHANGE_NAMES[exchange]}</Text>
      {active && (
        <Ionicons
          name="ios-checkmark"
          size={36}
          color={Colors.bgColor_0_122_255}
        />
      )}
    </View>
  </TouchableHighlight>
)

const ExchangeList = ({
  dismissModal,
  activeExchange,
  exchangeList,
  changeExchange
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
      onPress={() => dismissModal()}
    />
    <View style={styles.bgContainer}>
      <ScrollView
        style={{ maxHeight: 400, backgroundColor: Colors.bgColor_30_31_37 }}
        showsVerticalScrollIndicator={false}
      >
        {exchangeList.map(exchange => (
          <ListItem
            key={exchange}
            exchange={exchange}
            active={activeExchange === exchange}
            onPress={() => changeExchange(exchange)}
          />
        ))}
      </ScrollView>
    </View>
  </View>
)

export default ExchangeList
