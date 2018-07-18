
import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { FormattedNumber } from 'react-intl'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  linearContainer: {
    width: SCREEN_WIDTH - 64,
    minHeight: 200
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  info: {
    width: SCREEN_WIDTH - 64,
    height: 64,
    marginTop: 20,
    paddingHorizontal: 20
  },
  content: {
    width: SCREEN_WIDTH - 64,
    minHeight: 64,
    padding: 20
  },
  available: {
    width: SCREEN_WIDTH - 64 - 40,
    borderBottomColor: Colors.bgColor_FFFFFF,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10
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
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  }
})

export default class ResourcesCard extends Component {
  render() {
    const { type, title, availableText, available, totalText, total, usageText, usage, delegateText, delegate, colors, onPress } = this.props
    return (
      <TouchableWithoutFeedback style={styles.linearContainer} onPress={onPress}>
        <View>
          <LinearGradientContainer type="right" colors={colors} style={[styles.between, styles.info, styles.topRadius]}>
            <Text style={styles.text16}>{title}</Text>
            <Ionicons name="ios-arrow-forward" size={16} color={Colors.bgColor_FFFFFF} />
          </LinearGradientContainer>
          <View style={[styles.content, styles.bottomRadius]}>
            <View style={[styles.available, styles.between]}>
              <Text style={styles.text18}> {availableText} </Text>
              <Text style={styles.text18}>
                {available}
              </Text>
            </View>
            <View style={[styles.available]}>
              <View style={[styles.between, { marginTop: 10 }]}>
                <Text style={styles.text14}> {totalText} </Text>
                <Text style={styles.text14}>
                  {total}
                </Text>
              </View>
              <View style={[styles.between, { marginTop: 10 }]}>
                <Text style={styles.text14}> {usageText} </Text>
                <Text style={styles.text14}>
                  {usage}
                </Text>
              </View>
            </View>
            {
              delegate
              && <View style={[styles.between, { marginTop: 10 }]}>
                <Text style={styles.text14}> {delegateText} </Text>
                <Text style={styles.text14}> {delegate} </Text>
              </View>
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
