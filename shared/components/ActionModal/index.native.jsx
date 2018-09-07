import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber, IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import { noop } from 'utils'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class ActionModal extends Component {
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
              <Text style={styles.text18}><FormattedMessage id="sndcfm_title_name_cfm" /></Text>
              <Text style={styles.text18}>{' '}</Text>
            </View>
            <View style={[styles.header, styles.bottom, { backgroundColor: Colors.minorThemeColor, minHeight: 300 }]}>
              <View style={[styles.item, styles.between, { marginTop: 24 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}> <FormattedMessage id="sndcfm_title_name_send" /> </Text>
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
                  <Text style={[styles.text14, { width: 45 }]}> <FormattedMessage id="sndcfm_title_name_to" /> </Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {toAccount}
                  </Text>
                </View>
              </View>
              <View style={styles.line} />
              <View style={[styles.item, styles.between, { marginTop: -10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}> <FormattedMessage id="sndcfm_title_name_rmk" /> </Text>
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
                  <FormattedMessage id="sndcfm_button_name_ok" />
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
