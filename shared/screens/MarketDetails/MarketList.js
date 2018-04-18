
import React, { Component } from 'react'
import styles from './styles'
import { 
  Text,
  View,
  TouchableHighlight
} from 'react-native'
import Colors from 'resources/colors'

const MarketElement = ({ onPress, data }) => (
  <TouchableHighlight
    onPress={() => onPress(data)}
    underlayColor={Colors.bgColor_000000}
  >
    <View style={styles.marketElementContainer}>
      <View style={styles.spaceBetween}>
        <Text style={styles.text16}> {data.market} </Text>
        <Text style={styles.text16}> {data.price} USD </Text>
      </View>
      <Text style={[styles.text14, { color: Colors.textColor_142_142_147, textAlign: 'right', marginRight: 4 }]}> 
        Vol: {data.vol} 
      </Text>
    </View>
  </TouchableHighlight>
)

export default class MarketList extends Component {

  state = {
    listArr: [
      { market: 'Huobi.pro', price: '11,949.00', vol: '8,320.009' },
      { market: 'Bitfinex ', price: '11,949.00', vol: '8,320.009' }, 
      { market: 'Bittrex  ', price: '11,949.00', vol: '8,320.009' },
      { market: 'Binance  ', price: '11,949.00', vol: '8,320.009' }
    ]
  }

  render() {
    const { changeMarket } = this.props
    return (
      <View>
        {this.state.listArr.map((data, index) => {
          return (
            <MarketElement key={index} data={data} onPress={(e) => {changeMarket(e)} } />
          )
        })}
      </View>
    )
  }

}
