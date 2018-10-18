import React, { Component } from 'react'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import { Text, View, LayoutAnimation, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { ping, pingStatus } from 'utils/ping'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 64,
    backgroundColor: Colors.minorThemeColor
  },
  border: {
    borderBottomColor: Colors.bgColor_000000,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  redius: {
    width: 9,
    height: 8,
    borderRadius: 4
  },
  text10: {
    fontSize: FontScale(10),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  }
})

export default class DefaultItem extends Component {
  UNSAFE_componentWillReceiveProps() {
    LayoutAnimation.easeInEaseOut()
  }

  state = {
    pingValue: null
  }

  async componentDidMount() {
    if (this.props.data.item.url) this.checkStatus()
    this.timer = setInterval(() => {
      if (this.props.data.item.url) this.checkStatus(this.props.data.item.url)
    }, 5000)
  }

  checkStatus = async (url) => {
    const pingValue = await ping(url)
    this.setState({ pingValue })
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer)
  }

  render() {
    const { data, onPress, active } = this.props
    const { pingValue } = this.state
    const pingInfo = pingStatus(pingValue)
    return (
      <TouchableWithoutFeedback
        underlayColor={Colors.hoverColor}
        style={styles.container}
        onPress={onPress}
      >
        <View style={[styles.container, styles.between, styles.border, { paddingHorizontal: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.redius, { backgroundColor: pingInfo.color }]} />
            <Text style={[styles.text10, { marginLeft: 10, color: pingInfo.color }]}> { pingInfo.value }ms </Text>
            <Text style={[styles.text14, { marginLeft: 10 }]}>{data.item.url}</Text>
          </View>
          {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
