import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import Colors from 'resources/colors'
import styles from './styles'

export default class CoinInfoCard extends Component {
  render() {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.spaceBetween}>
          <Text style={[styles.text18, { marginLeft: 3 }]}>Bytom(BTM)</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text18}>11,949.00 USD</Text>
            <Text style={[styles.text14, { color: Colors.textColor_255_76_118, marginLeft: 10 }]}>-7.09%</Text>
          </View>
        </View>

        <View style={[styles.spaceBetween, { marginTop: 4 }]}>
          <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> Vol: 8,387,432.343 </Text>
          <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> 8,343.4234 ETH </Text>
        </View>

        <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> H: 11,949.00 </Text>
          <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> L: 11,949.00 </Text>
          <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}> C: 11,949.00 </Text>
        </View>

      </View>
    )
  }
}
