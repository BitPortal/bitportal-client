import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native'
import BPImage from 'components/BPNativeComponents/BPImage'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.mainThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    height: 50,
    backgroundColor: Colors.bgColor_30_31_37,
    paddingHorizontal: 32
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: 16,
    height: 16,
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  leftImageStyle: {
    width: FontScale(16),
    height: FontScale(16),
    marginRight: 10
  }
})

export default class SettingItem extends Component {
  onPress() {
    if (!this.props.disabled) {
      this.props.onPress()
    }
  }

  renderRightItem(rightItemTitle) {
    const { rightImageName, iconColor } = this.props
    const iconName = rightImageName || 'ios-arrow-forward'
    const imageColor = iconColor || Colors.textColor_181_181_181

    if (!rightItemTitle) {
      return (
        <Ionicons name={iconName} size={24} color={imageColor} />
      )
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[styles.text16]}>
          {rightItemTitle}
        </Text>
      </View>
    )
  }

  renderLeftItem(leftItemTitle) {
    const { leftImage, leftTitleStyle } = this.props
    return (
      <View style={[{ flexDirection: 'row' }, styles.center]}>
        {leftImage && <BPImage source={leftImage} style={styles.leftImageStyle} />}
        <Text style={[styles.text16, leftTitleStyle]}>
          {leftItemTitle}
        </Text>
      </View>
    )
  }

  render() {
    const { disabled, leftItemTitle, rightItemTitle, extraStyle } = this.props
    return (
      <TouchableHighlight
        underlayColor={Colors.hoverColor}
        style={[styles.container, extraStyle]}
        disabled={disabled === undefined ? false : disabled}
        onPress={() => this.onPress()}
      >
        <View style={[styles.viewContainer]}>
          {this.renderLeftItem(leftItemTitle)}
          {this.renderRightItem(rightItemTitle)}
        </View>
      </TouchableHighlight>
    )
  }
}
