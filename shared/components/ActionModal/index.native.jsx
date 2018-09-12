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
    const {
      isVisible,
      dismiss,
      confirm,
      locale,
      amount,
      symbol,
      fromAccount,
      toAccount,
      contract,
      memo,
      voter,
      producers,
      loading
    } = this.props

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
              {contract && <View style={[styles.item, styles.between, { marginTop: 20 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}>合约</Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {contract}
                  </Text>
                </View>
              </View>}
              {amount && <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}><FormattedMessage id="send_confirm_label_from " /></Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    <FormattedNumber
                      value={amount || 0}
                      maximumFractionDigits={4}
                      minimumFractionDigits={4}
                    />
                  </Text>
                </View>
                <Text style={styles.text14}> {symbol}</Text>
              </View>}
              {fromAccount && <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}>从</Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {fromAccount}
                  </Text>
                </View>
              </View>}
              {toAccount && <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}><FormattedMessage id="send_confirm_label_to" /></Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {toAccount}
                  </Text>
                </View>
              </View>}
              {memo && <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}><FormattedMessage id="send_confirm_label_memo" /></Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {memo}
                  </Text>
                </View>
              </View>}
              {voter && <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}>voter</Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {voter}
                  </Text>
                </View>
              </View>}
              {producers && <View style={[styles.item, styles.between, { marginTop: 10 }]}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text14, { width: 45 }]}>selected</Text>
                  <Text style={[styles.text14, { marginLeft: 35, color: Colors.textColor_89_185_226 }]}>
                    {producers.map(producer => `${producer} `)}
                  </Text>
                </View>
              </View>}
              <TouchableOpacity
                onPress={!loading ? confirm : noop}
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
