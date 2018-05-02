import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, FontScale } from 'utils/dimens'
import Images from 'resources/images'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class SettingItem extends Component {

  onPress() {
    if (!this.props.disabled) {
      this.props.onPress()
    }
  }

  renderRightItem(rightItemTitle) {
    const {rightImageName, rightItemStyle} = this.props
    let iconName = rightImageName ? rightImageName : "ios-arrow-forward"
    let rightTextStyle = rightItemStyle ? rightItemStyle : styles.rightItemStyle
    if (!rightItemTitle) {
      return (
        <Ionicons name={iconName} size={24} color={Colors.textColor_255_255_238} />
      )
    }else {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[text14]}>
            {rightItemTitle}
          </Text>
        </View>
      )
    }
  }

  renderLeftItem(leftItemTitle) {
    const { leftImage } = this.props
    return (
      <View style={[{flexDirection: 'row'}, styles.center]}>
        { leftImage &&  <Image source={leftImage} style={styles.leftImageStyle} /> }
        <Text style={styles.text14}>
          {leftItemTitle}
        </Text>
      </View>
    )
  }

  render() {
    const { disabled, leftItemTitle, rightItemTitle, extraStyle } = this.props
    return (
      <TouchableHighlight
        underlayColor={Colors.bgColor_000000}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor_41_41_44,
    borderBottomColor: Colors.borderColor_48_48_46,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    height: 44,
    paddingLeft: 15,
    paddingRight: 15
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: 16,
    height: 16,
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  leftImageStyle: {
    width: 26,
    height: 26,
    marginRight: 15
  }
})