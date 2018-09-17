import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'
import LinearGradientContainer from 'components/LinearGradientContainer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  linearContainer: {
    width: SCREEN_WIDTH - 70,
    minHeight: 70
  },
  GradiantCardContainer: {
    borderRadius: 12,
    backgroundColor: Colors.minorThemeColor,
    padding: 20,
    marginHorizontal: 15
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: 'row'
  },
  info: {
    width: SCREEN_WIDTH - 70,
    height: 40,
    paddingHorizontal: 20
  },
  content: {
    width: SCREEN_WIDTH - 70,
    minHeight: 30,
    backgroundColor: Colors.bgColor_48_49_59,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  topRadius: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  bottomRadius: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  }
})

class GradiantCardContainer extends Component {

  render() {
    const { containerTag, extraStyle } = this.props
    return (
      <View style={[styles.GradiantCardContainer, extraStyle]}>
        { containerTag && <Text style={[styles.text14, { marginBottom: 10 }]}>{containerTag}</Text> }
        { this.props.children }
      </View>
    )
  }

}

class GradiantCard extends Component {

  render() {
    const { title, content, colors, onPress, extraStyle } = this.props
    const defaultColors = Colors.gradientCardColors
    return (
      <View style={[styles.linearContainer, extraStyle]} >
        <TouchableWithoutFeedback onPress={onPress}>
          <View>
            <LinearGradientContainer type="right" colors={colors||defaultColors} style={[styles.between, styles.info, styles.topRadius]}>
              <Text style={styles.text14}>{title}</Text>
              <Ionicons name="ios-arrow-forward" size={18} color={Colors.bgColor_FFFFFF} />
            </LinearGradientContainer>
            <View style={[styles.content, styles.bottomRadius]}>
              <Text style={[styles.text12, { marginHorizontal: 2, lineHeight: 15 }]}> 
                {content} 
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

}

export {
  GradiantCard,
  GradiantCardContainer
} 
