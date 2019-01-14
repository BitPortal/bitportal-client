import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, ifIphoneX } from 'utils/dimens'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber, IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import { noop } from 'utils'
import messages from 'resources/messages'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  header: {
    width: SCREEN_WIDTH,
    height: 50,
    paddingHorizontal: 32,
    backgroundColor: Colors.mainThemeColor,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom: {
    ...ifIphoneX({
      paddingBottom: 34
    }, {
      paddingBottom: 0
    })
  },
  close: {
    width: 50,
    height: 50,
    marginLeft: -20
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  item: {
    width: SCREEN_WIDTH - 64,
    height: 30,
  },
  line: {
    width: SCREEN_WIDTH - 64,
    height: 1,
    backgroundColor: Colors.textColor_181_181_181,
    marginVertical: 15
  },
  btn: {
    width: SCREEN_WIDTH - 64,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.textColor_89_185_226,
    marginTop: 40,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    backgroundColor: Colors.textColor_181_181_181
  },
  indicator: {
    marginLeft: 10
  }
})

@connect(
  state => ({
    locale: state.intl.locale
  })
)

export default class TransferCard extends Component {
  render() {
    const { isVisible, dismiss, transfer, locale, quantity, symbol, toAccount, memo, loading } = this.props

    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0 }}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
        <IntlProvider messages={messages[locale]}>
          <View style={styles.container}>
            <TouchableOpacity onPress={dismiss} style={{ flex: 1 }} />
            <View style={[styles.header, styles.between]}>
              <TouchableOpacity onPress={dismiss} style={[styles.center, styles.close]}>
                <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
              </TouchableOpacity>
              <Text style={styles.text18}><FormattedMessage id="send_confirm_title_confirm" /></Text>
              <Text style={styles.text18}>{' '}</Text>
            </View>
            <View style={[styles.header, styles.bottom, { backgroundColor: Colors.minorThemeColor, minHeight: 300 }]}>
              <View style={[styles.item, styles.between, { marginTop: 24 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 60 }]}> <FormattedMessage id="send_confirm_label_from" /> </Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    <FormattedNumber
                      value={quantity || 0}
                      maximumFractionDigits={4}
                      minimumFractionDigits={4}
                    />
                  </Text>
                </View>
                <Text style={styles.text14}> {symbol}</Text>
              </View>
              <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 60 }]}> <FormattedMessage id="send_confirm_label_to" /> </Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {toAccount}
                  </Text>
                </View>
              </View>
              <View style={styles.line} />
              <View style={[styles.item, styles.between, { marginTop: -10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 60 }]}> <FormattedMessage id="send_confirm_label_memo" /> </Text>
                  <Text numberOfLines={1} style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {memo}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={!loading ? transfer : noop}
                disabled={loading}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, loading ? styles.disabled : {}]}
              >
                <Text style={[styles.text14]}>
                  <FormattedMessage id="send_confirm_button_confirm" />
                </Text>
                {loading && <ActivityIndicator style={styles.indicator} size="small" color="white" />}
              </TouchableOpacity>
            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }
}
