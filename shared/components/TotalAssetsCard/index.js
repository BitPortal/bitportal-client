
import React, { Component } from 'react'
import { Text, View, TouchableHighlight, StyleSheet, Image } from 'react-native'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { FormattedNumber } from 'react-intl'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Images from 'resources/images'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import messages from './messages'
import { FormattedMessage, IntlProvider } from 'react-intl'
import CurrencyText from 'components/CurrencyText'

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

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

class TotalAssetsCard extends Component {

  render() {
    const { totalAssets, accountName, disabled, onPress, locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={{ backgroundColor: Colors.minorThemeColor }}>
          <LinearGradientContainer type="right" style={[styles.linearContainer, { marginHorizontal: 32, marginVertical: 10 }]}>
            <TouchableHighlight disabled={disabled} style={styles.linearContainer} underlayColor={Colors.linearUnderlayColor} onPress={() => onPress()} >
              <View style={[styles.linearContainer, styles.paddingStyle]}>
                <Text style={styles.text15}>
                  <FormattedMessage id="asset_card_title_ttlast" />
                </Text>
                <Text style={styles.text24}>
                  ≈
                  <CurrencyText
                    value={totalAssets}
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />
                </Text>
                <View style={styles.between}>
                  {!!accountName && <Text style={styles.text15}>{accountName}</Text>}
                  {!!accountName && <Image style={{ width: 16, height: 16 }} source={Images.qrCode} />}
                </View>
              </View>
            </TouchableHighlight>
          </LinearGradientContainer>
        </View>
      </IntlProvider>
    )
  }
}

TotalAssetsCard.propTypes = {
  totalAssets: PropTypes.number.isRequired,
  onPress: PropTypes.func
}

export default TotalAssetsCard
