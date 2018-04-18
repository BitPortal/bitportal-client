
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TouchableHighlight
} from 'react-native'
import Colors from 'resources/colors'

export const Logo = ({  }) => (
  <View style={styles.cardContainer}>
    <View style={styles.spaceBetween}>
      <Ionicons name="logo-bitcoin" size={44} color={Colors.textColor_142_142_147} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.text14}> Long Tag  </Text>
        <Text style={[styles.text14, { marginLeft: 8 }]}> Tag </Text>
      </View>
    </View>
    <View style={styles.spaceBetween}>
      <Text style={[styles.text18,{ marginLeft: 3 } ]}>Bytom(BTM)</Text>
      <Text style={styles.text18}> 11,949.00 USD </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 4 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> Total Cap: 75,493.00 USD </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_76_118 }]}> -7.09% </Text>
    </View>
  </View>
)

export const Description = ({  }) => (
  <View style={[styles.cardContainer, { backgroundColor: Colors.bgColor_41_41_44, marginTop: 10 }]}>
    <Text style={[styles.text16, { color: Colors.textColor_149_149_149 }]}> Description </Text>
    <Text style={[styles.text14, { color: Colors.textColor_255_255_238, marginTop: 10, marginLeft: 4 }]}> 
      Bytom is an interactive protocol of multiple byte assets.
      Heterogeneous byte-assets (indigenous digital currency, digital assets) that operate in different fo...
    </Text>
  </View>
)

export const Details = ({  }) => (
  <View style={[styles.cardContainer, { backgroundColor: Colors.bgColor_41_41_44, marginTop: 10 }]}>
    <Text style={[styles.text16, { color: Colors.textColor_149_149_149 }]}> Details </Text>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Locations </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Hangzhou </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Total Supply </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 1,706,000.000 </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Funds Raised </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 8,900 BTC </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Token Cost </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 0.4 USD </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> KYC Info </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> None </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> ICO Date </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 2017.06.20 </Text>
    </View>
  </View>
)

export const ListedExchange = ({  }) => (
  <View style={[styles.cardContainer, { backgroundColor: Colors.bgColor_41_41_44, marginTop: 10 }]}>
    <Text style={[styles.text16, { color: Colors.textColor_149_149_149 }]}> Listed Exchange </Text>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Huobi.pro </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 11,949.00 USD </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Bibox </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 11,949.00 USD </Text>
    </View>
    <View style={[styles.spaceBetween, { marginTop: 10 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> Gate.io </Text>
      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 11,949.00 USD </Text>
    </View>
  </View>
)
