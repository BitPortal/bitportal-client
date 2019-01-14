import React, { Component } from 'react'
import Colors from 'resources/colors'
import { Text, View, ScrollView, TouchableHighlight } from 'react-native'
import QRCodeModule from 'react-native-qrcode-svg'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.locale
  })
)

export default class QRCode extends Component {
  state = {
    showQRCode: false,
    qrCodeValue: 'fdafafsd'
  }

  showQRCode = () => {
    this.setState({ showQRCode: true })
  }

  render() {
    const { showQRCode, qrCodeValue } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messsage={messages[locale]}>
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Text style={[styles.text16, { marginLeft: -1 }]}>
                <FormattedMessage id="export_keystore_label_qr_code_note" />
              </Text>
              <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}>
                <FormattedMessage id="export_keystore_text_qr_code_note1" />
              </Text>

              {
                !showQRCode
                && <View style={[styles.qrCodeContainer, styles.center]}>
                  <Text multiline={true} style={[styles.text14, { marginBottom: 45 }]}>
                    <FormattedMessage id="export_keystore_text_qr_code_note2" />
                  </Text>

                  <TouchableHighlight
                    onPress={() => this.showQRCode()}
                    underlayColor={Colors.textColor_89_185_226}
                    style={[styles.btn, styles.center, { width: 140, backgroundColor: Colors.textColor_89_185_226 }]}
                  >
                    <Text style={styles.text14}>
                      <FormattedMessage id="export_keystore_button_qr_code_show" />
                    </Text>
                  </TouchableHighlight>
                </View>
              }
              {
                showQRCode
                && <View style={[styles.qrCodeContainer, styles.center, { backgroundColor: Colors.bgColor_30_31_37 }]}>
                  <View style={{ padding: 2, maxWidth: 144, backgroundColor: Colors.bgColor_FFFFFF }}>
                    <QRCodeModule
                      value={qrCodeValue}
                      size={140}
                      color="black"
                    />
                  </View>
                </View>
              }
            </View>
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
