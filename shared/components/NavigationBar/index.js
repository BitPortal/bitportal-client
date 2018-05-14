import React, { Component } from 'react'
import { SCREEN_WIDTH, SCREEN_HEIGHT, FontScale, NAV_BAR_HEIGHT} from 'utils/dimens'
import NavBar from 'react-native-navbar'
import styles from './styles'
import { TouchableOpacity, View, Text } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class NavigationBar extends Component {

  render() {
    const { title, titleButton, leftButton, rightButton } = this.props
    const titleElement = titleButton || { title: title || "", style: styles.textTitle, numberOfLines: 1 }
    return (
      <NavBar
        leftButton={leftButton}
        rightButton={rightButton}
        title={titleElement}
        statusBar={{ style: Colors.statusBarMode }}
        containerStyle={styles.containerStyle}
      />
    )
  }
}

export const CommonButton = ({ iconName, title, onPress }) => (
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => onPress()}
  >
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Ionicons name={iconName} size={24} color={Colors.bgColor_FFFFFF} />
      <Text style={[styles.text20, {marginLeft: 10, marginTop: -3}]}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
)

export const CommonTitle = ({ title }) => (
  <View style={styles.navButton}>
    <Text style={styles.text24}>{title}</Text>
  </View>
)

export const CommonRightButton = ({ iconName, title, onPress }) => (
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => onPress()}
  >
    <View style={{ alignSelf: 'flex-end', marginRight: 32 }}>
      <Ionicons name={iconName} size={24} color={Colors.bgColor_FFFFFF} />
    </View>
  </TouchableOpacity>
)
