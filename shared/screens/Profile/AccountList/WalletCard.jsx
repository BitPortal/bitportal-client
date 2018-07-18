
import React, { Component } from 'react'
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  linearContainer: {
    width: SCREEN_WIDTH - 64,
    height: 128,
    borderRadius: 10
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  info: {
    width: SCREEN_WIDTH - 64,
    height: 64,
    paddingHorizontal: 20
  },
  topRadius: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'transparent'
  },
  bottomRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.minorThemeColor
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

export default class WalletCard extends Component {
  render() {
    const { accountName, assetName, colors, onPress } = this.props

    return (
      <LinearGradientContainer type="right" colors={colors} style={[styles.linearContainer, { marginHorizontal: 32, marginTop: 20 }]}>
        <TouchableHighlight style={styles.linearContainer} underlayColor="transparent" onPress={() => onPress()}>
          <View style={[styles.linearContainer]}>
            <View style={[styles.between, styles.info, styles.topRadius]}>
              <Text style={styles.text16}>{assetName}</Text>
              <Ionicons name="ios-arrow-forward" size={16} color={Colors.bgColor_FFFFFF} />
            </View>
            <View style={[styles.between, styles.info, styles.bottomRadius]}>
              <Text style={styles.text16}>{accountName}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </LinearGradientContainer>
    )
  }
}
