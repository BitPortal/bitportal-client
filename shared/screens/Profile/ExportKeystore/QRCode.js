/* @tsx */
import React, { Component } from 'react'
import styles from './styles'
import Colors from 'resources/colors'
import { Text, View, ScrollView, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native'
import QRCodeModule from 'react-native-qrcode'

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
    return (
      <View style={styles.scrollContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={[styles.text16, { marginLeft: -1 }]}> 
              Caution
            </Text>
            <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}> 
              Please confirm no one or device is monitoring your screen.          
            </Text>

            {
              !showQRCode &&
              <View style={[styles.qrCodeContainer, styles.center]}>
                <Text multiline={true} style={[styles.text14, { marginBottom: 45 }]}>
                  Please confirm no one or device is monitoring your screen.
                </Text>
  
                <TouchableHighlight 
                  onPress={() => this.showQRCode()} 
                  underlayColor={Colors.textColor_89_185_226}
                  style={[styles.btn, styles.center, { width: 140, backgroundColor: Colors.textColor_89_185_226 }]}
                >
                  <Text style={styles.text14}> 
                    Show QRcode
                  </Text>
                </TouchableHighlight>
              </View>  
            }
            {
              showQRCode && 
              <View style={[styles.qrCodeContainer, styles.center, { backgroundColor: Colors.bgColor_48_49_59 }]}>
                <View style={{ padding: 2, maxWidth: 144, backgroundColor: Colors.bgColor_FFFFFF }}>
                  <QRCodeModule
                    value={qrCodeValue}
                    size={140}
                    bgColor='black'
                    fgColor='white'
                  />
                </View>
              </View>
            }
          </View>
       </ScrollView>
      </View>
    )
  }

}
