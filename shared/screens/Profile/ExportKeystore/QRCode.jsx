import React, { Component } from 'react'
import Colors from 'resources/colors'
import { Text, View, ScrollView, TouchableHighlight } from 'react-native'
import QRCodeModule from 'react-native-qrcode-svg'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
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
                <FormattedMessage id="expksqrc_hint_title_point1" />
              </Text>
              <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}>
                <FormattedMessage id="expksqrc_hint_txt_point1" />
              </Text>

              {
                !showQRCode
                && <View style={[styles.qrCodeContainer, styles.center]}>
                  <Text multiline={true} style={[styles.text14, { marginBottom: 45 }]}>
                    <FormattedMessage id="expksqrc_txtbox_txt_content" />
                  </Text>

                  <TouchableHighlight
                    onPress={() => this.showQRCode()}
                    underlayColor={Colors.textColor_89_185_226}
                    style={[styles.btn, styles.center, { width: 140, backgroundColor: Colors.textColor_89_185_226 }]}
                  >
                    <Text style={styles.text14}>
                      <FormattedMessage id="expksqrc_button_name_show" />
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
