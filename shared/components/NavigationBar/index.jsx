import React, { Component } from 'react'
import NavBar from 'react-native-navbar'
import { TouchableOpacity, View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'

export default class NavigationBar extends Component {
  render() {
    const { title, titleButton, leftButton, rightButton } = this.props
    const titleElement = titleButton || {
      title: title || '',
      style: styles.textTitle,
      numberOfLines: 1
    }

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

export const CommonButton = ({ iconName, title, onPress, extraStyle, extraTextStyle }) => (
  <TouchableOpacity style={[styles.navButton, extraStyle]} onPress={() => onPress()}>
    <View style={{ zIndex: 100, flexDirection: 'row', alignItems: 'center' }}>
      {iconName && (
        <Ionicons name={iconName} size={24} color={Colors.bgColor_FFFFFF} />
      )}
      <Text
        style={[
          styles.text20,
          { marginLeft: 10, marginTop: -3 },
          extraTextStyle
        ]}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
)

export const CommonTitle = ({ title }) => (
  <View style={styles.navButton}>
    <Text style={styles.text20}>{title}</Text>
  </View>
)

export const CommonRightButton = ({ iconName, imageSource, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={() => onPress()}>
    <View style={{ alignSelf: 'flex-end', marginRight: 32 }}>
      {iconName && (
        <Ionicons name={iconName} size={24} color={Colors.bgColor_FFFFFF} />
      )}
      {imageSource && (
        <FastImage source={imageSource} style={{ width: 24, height: 24 }} />
      )}
    </View>
  </TouchableOpacity>
)

export const LinkingRightButton = ({ iconName, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <View style={{ alignSelf: 'flex-end', marginRight: 32 }}>
      {iconName && (
        <Ionicons name={iconName} size={24} color={Colors.bgColor_FFFFFF} />
      )}
    </View>
  </TouchableOpacity>
)

export const WebViewLeftButton = ({ goBack, goHome }) => (
  <View
    style={[styles.navButton, { flexDirection: 'row', alignItems: 'center' }]}
  >
    <TouchableOpacity
      style={[
        { flex: 1, marginLeft: -15, paddingHorizontal: 5 },
        styles.center
      ]}
      onPress={goBack}
    >
      <Ionicons name="md-arrow-back" size={24} color={Colors.bgColor_FFFFFF} />
    </TouchableOpacity>
    {/* <TouchableOpacity style={[{ flex: 1, paddingHorizontal: 5 }, styles.center]} onPress={goForward} >
      <Ionicons name={"md-arrow-forward"} size={24} color={Colors.bgColor_FFFFFF} />
    </TouchableOpacity> */}
    <TouchableOpacity
      style={[
        { flex: 1, paddingHorizontal: 5, marginRight: 10 },
        styles.center
      ]}
      onPress={goHome}
    >
      <Ionicons name="md-close" size={24} color={Colors.bgColor_FFFFFF} />
    </TouchableOpacity>
  </View>
)

export const ListButton = ({ label, onPress }) => (
  <TouchableOpacity onPress={() => onPress()} style={styles.navButton}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.text20}>{label}</Text>
      <View
        style={{
          transform: [{ rotateZ: '90deg' }],
          marginLeft: 5,
          marginTop: 3
        }}
      >
        <Ionicons
          name="md-play"
          size={10}
          color={Colors.textColor_255_255_238}
        />
      </View>
    </View>
  </TouchableOpacity>
)
