import React, { Component, Children } from 'react'
import { SCREEN_WIDTH, SCREEN_HEIGHT, FontScale, NAV_BAR_HEIGHT} from 'utils/dimens'
import NavBar from 'react-native-navbar'
import styles from './styles'
import { TouchableOpacity, View, Text } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class NavigationBar extends Component {

  render() {
    const { title, titleButton, leftButton, rightButton } = this.props
    const titleElement = titleButton || { title: title || "", style: styles.textTitle }
    return (
      <NavBar
        leftButton={leftButton}
        rightButton={rightButton}
        title={titleElement}
        containerStyle={styles.containerStyle}
      />
    )
  }
}

export const CommonButton = ({ onPress, Children }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={styles.navButton}
  >
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {Children}
    </View>
  </TouchableOpacity>
)

export const LeftButton = ({ iconName, title, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={styles.navButton}
  >
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Ionicons name={iconName} size={24} color={Colors.bgColor_FFFFFF} />
      <Text style={[styles.text20, {marginLeft: 10, marginTop: -3}]}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
)

export const RightButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={styles.navButton}
  >
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={[styles.text13, {marginTop: -FontScale(13), marginLeft: -FontScale(13)}]}>
        BTC
      </Text>
      <Text style={[styles.text13, {marginBottom: -FontScale(8), marginRight: -FontScale(8), color: Colors.textColor_6A6A6A}]}>
        ETH
      </Text>
    </View>
  </TouchableOpacity>
)
