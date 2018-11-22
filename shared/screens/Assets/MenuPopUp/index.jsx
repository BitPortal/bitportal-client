import React, { Component } from 'react'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import messages from 'resources/messages'
import FastImage from 'react-native-fast-image'
import Images from 'resources/images'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bgColor_30_31_37
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  bgContainer: {
    marginTop: -SCREEN_HEIGHT+NAV_BAR_HEIGHT,
    width: 170,
    minHeight: 100,
    marginLeft: SCREEN_WIDTH-180,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  contentContainer: {
    borderRadius: 5,
    minWidth: 100,
    minHeight: 100,
    padding: 15,
    backgroundColor: Colors.minorThemeColor
  },
  btnContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.textColor_107_107_107,
    paddingBottom: 5
  },
  image: {
    width: 16,
    height: 16
  },
  btn: {
    width: '100%',
    minHeight: 40,
    borderRadius: 3
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_white_4
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class MenuPopUp extends Component {

  render() {
    const { isVisible, dismissModal, selectFunc, locale } = this.props
    if (!isVisible) return null
    return (
      <IntlProvider messages={messages[locale]}>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ margin: 0 }}
          isVisible={isVisible}
          useNativeDriver
          hideModalContentWhileAnimating
          backdropOpacity={0.3}
        >
          <View style={styles.container}>
            <TouchableOpacity style={[styles.container, { backgroundColor: 'rgba(0,0,0,0)' }]} onPress={dismissModal} />
            <View style={[styles.bgContainer]}>
              <View style={styles.contentContainer}>
                <TouchableOpacity onPress={() => selectFunc('scanQR')}>
                  <View style={styles.btnContainer}>
                    <FastImage source={Images.assets_scan} style={styles.image} />
                    <Text style={[styles.text14, { marginLeft: 8 }]}> {messages[locale].scan_title_scan} </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectFunc('transfer')} style={{ marginTop: 10}}>
                  <View style={styles.btnContainer}>
                    <FastImage source={Images.assets_send} style={styles.image} />
                    <Text style={[styles.text14, { marginLeft: 8 }]}> {messages[locale].transaction_list_button_send} </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectFunc('receive')} style={{ marginTop: 10}}>
                  <View style={styles.btnContainer}>
                    <FastImage source={Images.assets_receive} style={styles.image} />
                    <Text style={[styles.text14, { marginLeft: 8 }]}> {messages[locale].transaction_list_button_receive} </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectFunc('vote')} style={{ marginTop: 10}}>
                  <View style={{ flexDirection: 'row' }}>
                    <FastImage source={Images.profile_voting} style={styles.image} />
                    <Text style={[styles.text14, { marginLeft: 8 }]}> {messages[locale].profile_button_voting} </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </IntlProvider>
    )
  }
}
