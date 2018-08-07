import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { FontScale } from 'utils/dimens'
import Dialog from 'components/Dialog'
import images from 'resources/images'
import messages from './messages'

const styles = StyleSheet.create({
  container: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.textColor_white_4
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 16,
    height: 16
  },
  btn: {
    width: 36,
    height: 36,
    padding: 10,
    marginTop: -10
  }
})

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class Tips extends Component {
  alertTips = () => {
    const { locale } = this.props
    Dialog.alert(messages[locale].tips_alert_title_tip, this.props.tips, { positiveText: messages[locale].tips_alert_btn_enter })
  }

  render() {
    return (
      <TouchableOpacity onPress={this.alertTips} style={styles.btn}>
        <Image source={images.tips} style={styles.image} />
      </TouchableOpacity>
    )
  }
}
