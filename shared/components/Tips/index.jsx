/* @jsx */
import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import Dialog from 'components/Dialog'

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.bgColor_59_59_59
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  btn: {
    padding: 10,
    marginTop: -10,
  }
})

export default class Tips extends Component {
  alertTips = () => {
    Dialog.alert('提示', this.props.tips, { positiveText: '确定' })
  }

  render() {
    const { tips } = this.props
    return (
      <TouchableOpacity onPress={this.alertTips} style={styles.btn}>
        <View style={[styles.container, styles.center]}>
          <Text style={styles.text16}> ? </Text>
        </View>
      </TouchableOpacity>
    )
  }
}
