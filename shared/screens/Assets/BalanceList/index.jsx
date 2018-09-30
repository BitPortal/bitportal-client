import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import Images from 'resources/images'
import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { eosCoreLiquidBalanceSelector } from 'selectors/eosAccount'
import CurrencyText from 'components/CurrencyText'
import styles from './styles'

const ListItem = ({ item, onPress, assetPrice, isAssetHidden }) => (
  <TouchableHighlight underlayColor={Colors.hoverColor} style={styles.listContainer} onPress={() => onPress(item)}>
    <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.bgColor_30_31_37 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {<FastImage source={item.get('icon_url') ? { uri: item.get('icon_url') } : (item.get('symbol') === 'EOS' ? Images.EOSIcon : Images.coin_logo_default)} style={styles.image} />}
        <Text style={styles.text24}>{item.get('symbol')}</Text>
      </View>
      <View>
        <Text style={[styles.text20, { alignSelf: 'flex-end' }]}>
          {
            isAssetHidden
              ? '******'
              : <FormattedNumber value={item.get('balance')} maximumFractionDigits={4} minimumFractionDigits={4} />
          }
        </Text>
        {
          isAssetHidden
            ? <Text style={[styles.text14, { alignSelf: 'flex-end', color: Colors.textColor_149_149_149 }]}>******</Text>
            : <Text style={[styles.text14, { alignSelf: 'flex-end', color: Colors.textColor_149_149_149 }]}>
              ≈
              <CurrencyText value={+item.get('balance') * +assetPrice} maximumFractionDigits={2} minimumFractionDigits={2} />
            </Text>
        }
      </View>
    </View>
  </TouchableHighlight>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    isAssetHidden: state.eosAccount.get('isAssetHidden'),
    eosCoreLiquidBalance: eosCoreLiquidBalanceSelector(state)
  })
)

export default class BalanceList extends Component {
  render() {
    const { data, onPress, eosPrice, isAssetHidden, eosCoreLiquidBalance } = this.props

    return (
      <View>
        <ListItem
          item={eosCoreLiquidBalance}
          isAssetHidden={isAssetHidden}
          assetPrice={eosPrice}
          onPress={onPress}
        />
        {
          data.map((item, index) => <ListItem
              key={index}
              item={item}
              isAssetHidden={isAssetHidden}
              assetPrice={0}
              onPress={onPress}
          />
          )
        }
      </View>
    )
  }
}
