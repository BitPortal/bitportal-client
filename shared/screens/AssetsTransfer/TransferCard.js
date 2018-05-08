/* @jsx */
import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT,
  ifIphoneX 
} from 'utils/dimens'
import { FormattedNumber } from 'react-intl'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  header: {
    width: SCREEN_WIDTH,
    height: 50,
    paddingHorizontal: 32,
    backgroundColor: Colors.mainThemeColor,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom: {
    ...ifIphoneX({
      paddingBottom: 35
    },{
      paddingBottom: 0
    })
  },
  close: {
    width: 50,
    height: 50,
    marginLeft: -20
  },  
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  item: {
    width: SCREEN_WIDTH-64,
    height: 30,
  },
  line: {
    width: SCREEN_WIDTH-64,
    height: 1,
    backgroundColor: Colors.textColor_181_181_181,
    marginVertical: 15
  },
  btn: {
    width: SCREEN_WIDTH-64,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.textColor_89_185_226,
    marginTop: 40,
    marginBottom: 20
  }
})

export default TransferCard = ({ amount, quote, destination, memo, onPress, transferAsset }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onPress()} style={{ flex: 1 }} />
    <View style={[styles.header, styles.between]}>
      <TouchableOpacity onPress={() => onPress()} style={[styles.center, styles.close]} >
        <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
      </TouchableOpacity>
      <Text style={styles.text18}> Confirm </Text>
      <Text style={styles.text18}> {' '} </Text>
    </View>
    <View style={[styles.header, styles.bottom, { backgroundColor: Colors.minorThemeColor, minHeight: 300 }]}>
      <View style={[styles.item, styles.between, { marginTop: 24 }]}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text style={[styles.text14, { width: 45 }]}> Send </Text>
          <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}> 
            <FormattedNumber
              value={amount}
              maximumFractionDigits={4}
              minimumFractionDigits={4}
            /> 
          </Text>
        </View>
        <Text style={styles.text14}> {quote} </Text>
      </View>

      <View style={[styles.item, styles.between, { marginTop: 10 }]}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text style={[styles.text14, { width: 45 }]}> To </Text>
          <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}> 
            { destination }
          </Text>
        </View>
      </View>

      <View style={styles.line} />

      <View style={[styles.item, styles.between, { marginTop: -10 }]}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text style={[styles.text14, { width: 45 }]}> Memo </Text>
          <Text numberOfLines={1} style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}> 
            { memo }
          </Text>
        </View>
      </View>

      <TouchableHighlight 
        onPress={() => transferAsset()} 
        underlayColor={Colors.textColor_89_185_226}
        style={[styles.btn, styles.center]}
      >
        <Text style={[styles.text14]}> 
          OK 
        </Text>
      </TouchableHighlight>

    </View>
  </View>
)