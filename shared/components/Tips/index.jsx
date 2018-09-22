import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import Dialog from 'components/Dialog'
import images from 'resources/images'
import messages from 'resources/messages'

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
    Dialog.alert(messages[locale].general_popup_label_tips, this.props.tips, { positiveText: messages[locale].general_popup_button_close })
  }

  render() {
    return (
      <TouchableOpacity onPress={this.alertTips} style={styles.btn}>
        <FastImage source={images.tips} style={styles.image} />
      </TouchableOpacity>
    )
  }
}
