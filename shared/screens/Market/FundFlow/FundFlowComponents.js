import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View } from 'react-native'
import Colors from 'resources/colors'
import { SCREEN_WIDTH } from 'utils/dimens'
import styles from './styles'

export const Logo = () => (
  <View style={styles.cardContainer}>
    <View style={styles.spaceBetween}>
      <Ionicons name="logo-bitcoin" size={44} color={Colors.textColor_142_142_147} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.text14, { color: Colors.textColor_93_207_242 }]}> Long Tag  </Text>
        <Text style={[styles.text14, { color: Colors.textColor_93_207_242, marginLeft: 8 }]}> Tag </Text>
      </View>
    </View>
    <View style={styles.spaceBetween}>
      <Text style={[styles.text18, { marginLeft: 3 }]}>Bytom(BTM)</Text>
      <Text style={styles.text18}> 11,949.00 USD </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 4 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> Total Cap: 75,493.00 USD </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_76_118 }]}> -7.09% </Text>
    </View>
  </View>
)

export const FlowInfo = () => (
  <View style={styles.cardContainer}>
    <View style={{ flexDirection: 'row' }}>
      <View style={[styles.spaceBetween, { flex: 1 }]}>
        <Text style={styles.text13}> Inflow </Text>
        <Text style={styles.text14}> 95,938.03 USD </Text>
      </View>
      <View style={[styles.spaceBetween, { flex: 1 }]}>
        <Text style={styles.text13}> Net Inflow </Text>
        <Text style={styles.text14}> 95,938.03 USD </Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', marginTop: 8 }}>
      <View style={[styles.spaceBetween, { flex: 1 }]}>
        <Text style={styles.text13}> Outflow </Text>
        <Text style={styles.text14}> 95,938.03 USD </Text>
      </View>
      <View style={[styles.spaceBetween, { flex: 1 }]}>
        <Text style={styles.text13}> Change </Text>
        <Text style={styles.text14}> -7.09% </Text>
      </View>
    </View>
  </View>
)

export const ListedExchange = ({ dataArr }) => (
  <View style={[styles.cardContainer, { backgroundColor: Colors.bgColor_41_41_44, marginTop: 10 }]}>
    <View style={[styles.spaceBetween, { width: SCREEN_WIDTH - 30, height: 30, borderBottomColor: Colors.borderColor_48_48_46, borderBottomWidth: 2 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.text12}>exchange</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.text12, { textAlign: 'right' }]}>Fund Flow (USD)</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.text12, { textAlign: 'right' }]}>Occupy</Text>
      </View>
    </View>
    {dataArr.map(item => (
      <View key={item.fundFlow} style={[styles.spaceBetween, { marginTop: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.text14}>{item.market}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.text14, { color: item.fundFlow.split('+').length > 1 ? Colors.textColor_80_201_109 : Colors.textColor_255_76_118, textAlign: 'right' }]}>
            {item.fundFlow}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.text14, { textAlign: 'right' }]}>{item.occupy}</Text>
        </View>
      </View>
    ))}
  </View>
)
