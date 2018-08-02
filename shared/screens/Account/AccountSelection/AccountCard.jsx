import React, { Component } from 'react'
import CurrencyText from 'components/CurrencyText'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { View, Text, TouchableWithoutFeedback  } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

export default ({ accountType, accountName, balanceTitle, eosValue, eosAmount, colors, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.cardContainer}>
      <LinearGradientContainer type="right" colors={colors} style={[styles.contentContainer, styles.topRadius]}>
        <View style={[styles.contentContainer, styles.paddingStyle, styles.between]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.textRadius}>
              <Text style={[styles.text12, { color: Colors.textColor_89_185_226 }]}>
                {accountType}
              </Text>
            </View>
            <Text style={[styles.text16, { marginLeft: 15 }]}>{accountName}</Text>
          </View>
          <Ionicons name="ios-arrow-forward" size={26} color={Colors.bgColor_FAFAFA} />
        </View>
      </LinearGradientContainer>
      <View style={[styles.contentContainer, styles.paddingStyle, styles.between, styles.bottomRadius, { backgroundColor: Colors.minorThemeColor }]}>
        <Text style={styles.text14}>
          {balanceTitle}
        </Text>
        <View>
          <Text style={[styles.text16, { alignSelf: 'flex-end' }]}>
            <CurrencyText value={eosValue} />
          </Text>
          <Text style={[styles.text14, { alignSelf: 'flex-end', color: Colors.textColor_149_149_149 }]}>
            {eosAmount}
          </Text>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
)
