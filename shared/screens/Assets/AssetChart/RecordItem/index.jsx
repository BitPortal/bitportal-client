import React from 'react'
import { Image, Text, View, TouchableHighlight, StyleSheet } from 'react-native'
// import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import Images from 'resources/images'
import { FormattedNumber, FormattedRelative } from 'react-intl'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import LinearGradientContainer from 'components/LinearGradientContainer'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: Colors.bgColor_30_31_37,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 2,
  },
  image: {
    width: 20,
    height: 20
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_181_181_181
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_89_185_226
  }
})

const GradientIcon = ({ isReceiver }) => (
  <LinearGradientContainer type="right" colors={isReceiver ? Colors.tradeSuccess : Colors.tradeFailed} style={[styles.center, styles.icon]}>
    <Image source={isReceiver ? Images.transfer_receiver : Images.transfer_sender} style={styles.image} />
  </LinearGradientContainer>
)

export default ({ item, onPress, eosAccountName }) => {
  const fromAccount = item.getIn(['action_trace', 'act', 'data', 'from'])
  const toAccount = item.getIn(['action_trace', 'act', 'data', 'to'])
  const isReceiver = fromAccount !== eosAccountName
  const diffColor = isReceiver ? Colors.textColor_89_185_226 : Colors.textColor_255_98_92
  const quantity = item.getIn(['action_trace', 'act', 'data', 'quantity'])
  const amount = quantity && quantity.split(' ')[0]
  const symbol = quantity && quantity.split(' ')[1]
  const displayAccount = isReceiver ? fromAccount : toAccount
  const time = item.get('block_time')

  return (
    <TouchableHighlight
      style={styles.container}
      underlayColor={Colors.hoverColor}
      onPress={() => onPress(item)}
    >
      <View style={[styles.container, styles.between, { paddingHorizontal: 32 }]}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <GradientIcon isReceiver={isReceiver} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.text14}>{displayAccount}</Text>
            <Text style={[styles.text12, { marginTop: 2 }]}><FormattedRelative value={+new Date(`${time}Z`)} /></Text>
          </View>
        </View>
        <Text style={[styles.text14, { color: diffColor }]}>
          {isReceiver ? '+' : '-'}
          <FormattedNumber
            value={amount || 0}
            maximumFractionDigits={4}
            minimumFractionDigits={4}
          />
          {' '}{symbol}
        </Text>
      </View>
    </TouchableHighlight>
  )
}
