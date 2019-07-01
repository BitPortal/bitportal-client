import React, { Component } from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

export default class MarketTableViewCell extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.currency.rate !== this.props.currency.rate || nextProps.currency.sign !== this.props.currency.sign || nextProps.data.symbol !== this.props.data.symbol || nextProps.data.name !== this.props.data.name || nextProps.data.price_usd !== this.props.data.price_usd || nextProps.data.percent_change_24h !== this.props.data.percent_change_24h
  }

  render() {
    const { intl, currency, data } = this.props

    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, height: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 36, height: 36, marginRight: 16, borderRadius: 18 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
              <Text style={{ fontWeight: '500', fontSize: 20, color: 'white' }}>{data.symbol.slice(0, 1)}</Text>
            </View>
            <FastImage source={{ uri: `https://cdn.bitportal.io/tokenicon/128/color/${data.symbol.toLowerCase()}.png` }} style={{ width: 36, height: 36, borderRadius: 18 }} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, width: 200, fontWeight: '500', color: 'black' }} numberOfLines={1}>{data.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: '#888888', marginRight: 10 }}>{data.symbol}</Text>
              {+data.percent_change_24h === 0 && <Text style={{ fontSize: 15, color: 'black' }}>0.00%</Text>}
              {+data.percent_change_24h !== 0 && (+data.percent_change_24h >= 0 ? <Text style={{ fontSize: 15, color: '#4CD964' }}>{`+${intl.formatNumber(data.percent_change_24h, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}</Text> : <Text style={{ fontSize: 15, color: '#FF3B30' }}>{`${intl.formatNumber(data.percent_change_24h, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}</Text>)}
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16 }}>
          <Text style={{ fontSize: 17, color: '#673AB7' }}>{currency.sign}{intl.formatNumber(data.price_usd * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </View>
      </View>
    )
  }
}
