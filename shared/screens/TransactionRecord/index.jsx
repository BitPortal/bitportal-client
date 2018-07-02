import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Clipboard } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider, FormattedNumber } from 'react-intl'
import QRCode from 'react-native-qrcode-svg'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef : true }
)

export default class TransactionRecord extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    qrCodeValue: 'fdsafsfdafdsafsf12312',
    isCopied: false
  }

  goBack = () => {
    Navigation.popToRoot(this.props.componentId)
  }

  clipboard = () => {
    Clipboard.setString(this.state.qrCodeValue)
    this.setState({ isCopied: true })
  }

  render() {
    const { qrCodeValue, isCopied } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].tx_title_name_txrcd}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <View style={[styles.header, styles.center]}>
                  <Text style={styles.text12}> 2018-05-07 </Text>
                </View>
                <View style={[styles.header2, styles.between]}>
                  <View style={[styles.center, { marginHorizontal: 15 }]}>
                    <Text style={styles.text10}><FormattedMessage id="tx_sec_title_from" /></Text>
                    <Text numberOfLines={1} style={styles.text18}>GHIJKLMN</Text>
                  </View>
                  <View style={{ marginTop: 15 }}>
                    <Ionicons name="ios-arrow-round-forward-outline" size={20} color={Colors.textColor_74_74_74} />
                  </View>
                  <View style={[styles.center, { marginHorizontal: 15 }]}>
                    <Text style={styles.text10}><FormattedMessage id="tx_sec_title_to" /></Text>
                    <Text numberOfLines={1} style={styles.text18}>ABCDEF</Text>
                  </View>
                </View>
                <View style={styles.amountContent}>
                  <Text style={[styles.text14, { marginLeft: -3, marginBottom: 3 }]}>
                    <FormattedMessage id="tx_sec_title_amount" />
                  </Text>
                  <View style={[styles.between, { alignItems: 'center' }]}>
                    <Text style={styles.text24}>
                      <FormattedNumber
                        value={54122.2132}
                        maximumFractionDigits={4}
                        minimumFractionDigits={4}
                      />
                    </Text>
                    <Text style={styles.text14}> EOS </Text>
                  </View>
                  <Text style={[styles.text14, { marginLeft: -3, marginTop: 15 }]}>
                    <FormattedMessage id="tx_sec_button_detail" />:
                  </Text>
                  <Text style={[styles.text14, { marginLeft: -3, marginTop: 4, marginBottom: 10 }]}> # ABCDEFGHIJKLMN </Text>
                </View>
                <View style={styles.card}>
                  <View style={[styles.separator, styles.between]}>
                    <View style={[styles.semicircle, { marginLeft: -5 }]} />
                    <View style={[styles.semicircle, { marginRight: -5 }]} />
                  </View>
                  <View style={[styles.between]}>
                    <View style={{ marginLeft: 20, height: 140, justifyContent: 'space-between' }}>
                      <Text style={[styles.text14, { marginTop: 10 }]}>
                        <FormattedMessage id="txdtl_title_name_tctID" />:
                      </Text>
                      <Text numberOfLines={1} style={styles.text14}>
                        # {' '}
                        <Text style={{ color: Colors.textColor_89_185_226, textDecorationLine: 'underline' }}>
                          ABCDEFG…HIJKLMN
                        </Text>
                      </Text>
                      <Text style={[styles.text14, { marginTop: 15 }]}>
                        <FormattedMessage id="tx_sec_button_detail" />:
                      </Text>
                      <Text numberOfLines={1} style={[styles.text14, { marginBottom: 15 }]}>
                        # {' '}
                        <Text style={{ color: Colors.textColor_89_185_226, textDecorationLine: 'underline' }}>
                          1234567
                        </Text>
                      </Text>
                      <Text style={styles.text14}><FormattedMessage id="txdtl_title_name_producer" />:</Text>
                      <Text numberOfLines={1} style={styles.text14}># ABCDEFGHIJKLMN</Text>
                    </View>
                    <View style={{ marginRight: 20, marginTop: 10, alignItems: 'center' }}>
                      <View style={{ padding: 3, backgroundColor: Colors.bgColor_FFFFFF }}>
                        <QRCode
                          value={qrCodeValue}
                          size={80}
                          color="black"
                        />
                      </View>
                      <TouchableOpacity
                        disabled={isCopied}
                        onPress={() => this.clipboard()}
                        style={[styles.btn, styles.center]}
                      >
                        <Text style={[styles.text14, { color: Colors.textColor_107_107_107 }]}>
                          {isCopied ? <FormattedMessage id="txdtl_title_button_copied" /> : <FormattedMessage id="txdtl_title_button_copy" />}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
