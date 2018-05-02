
import React, { Component } from 'react'
import { Text, View, TouchableHighlight, StyleSheet, Image } from 'react-native'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { FormattedNumber } from 'react-intl'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'
import QRCode from 'react-native-qrcode'
import Images from 'resources/images'

const styles = StyleSheet.create({
  linearContainer: {
    width: SCREEN_WIDTH-64,
    height: 150,
    borderRadius: 12
  },
  paddingStyle: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    justifyContent: 'space-between'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text15: {
    fontSize: FontScale(15),
    color: Colors.textColor_white_4
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.textColor_255_255_238
  }
})

export default class TotalAssets extends Component {

  render() {
    const { totalAssets, userName } = this.props
    return (  
      <View style={{ backgroundColor: Colors.minorThemeColor }}>
        <LinearGradientContainer type="right" style={[styles.linearContainer, { marginHorizontal: 32, marginVertical: 10 }]}>
          <TouchableHighlight style={styles.linearContainer} underlayColor={Colors.linearUnderlayColor} onPress={() => {alert('fdafs')}} >
            <View style={[styles.linearContainer, styles.paddingStyle]}>
              <Text style={styles.text15}> Total Assets</Text>
              <Text style={styles.text24}> 
                ≈¥ {' '}
                <FormattedNumber
                  value={totalAssets}
                  maximumFractionDigits={2}
                  minimumFractionDigits={2}
                />
              </Text>
              <View style={styles.between}>
                <Text style={styles.text15}> { userName }</Text>
                <Image style={{ width: 16, height: 16 }} source={Images.qrCode} />
              </View>
            </View>
          </TouchableHighlight>
        </LinearGradientContainer>
      </View>
    )
  }

}




