
import React, { Component } from 'react'

import CurrencyText from 'components/CurrencyText'
import LinearGradientContainer from 'components/LinearGradientContainer'

import Colors from 'resources/colors'
import Images from 'resources/images'

import messages from './messages'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'

import storage from 'utils/storage'

import { FormattedMessage, IntlProvider } from 'react-intl'
import { Text, View, TouchableHighlight, StyleSheet, Image, TouchableOpacity, LayoutAnimation } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'

const styles = StyleSheet.create({
  linearContainer: {
    width: SCREEN_WIDTH-64,
    height: 150,
    borderRadius: 12
  },
  resourcesContainer: {
    width: SCREEN_WIDTH-64-30,
    minHeight: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  guideArrow: {
    width: 30,
    height: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: Colors.mainThemeColor
  },
  divider: {
    width: 2,
    height: 15,
    backgroundColor: Colors.bgColor_000000
  },
  paddingStyle: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    justifyContent: 'space-between'
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
  image: {
    width: 16,
    height: 10,
    marginHorizontal: 30,
    marginVertical: 20
  },
  btn: {
    marginRight: -30,
    paddingVertical: 10
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
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

export default class TotalAssetsCard extends Component {

  state = {
    hidden: false,
    folded: true
  }

  async componentDidMount() {
    const storeInfo = await storage.getItem('bitportal.hiddenTotalAssets', true)
    if (storeInfo && storeInfo.hiddenTotalAssets) {
      this.setState({ hidden: storeInfo.hiddenTotalAssets })
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  foldResources = () => {
    const { folded } = this.state
    this.setState({ folded: !folded })
  }

  switchDisplayTotal = async () => {
    const { hidden } = this.state
    await storage.setItem('bitportal.hiddenTotalAssets', { hiddenTotalAssets: !hidden }, true)
    this.setState({ hidden: !hidden })
  }

  render() {
    const { totalAssets, CPUWeight, BandWidth, RAMUsage, accountName, disabled, onPress, locale } = this.props
    const { hidden, folded } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={{ alignItems: 'center', backgroundColor: Colors.minorThemeColor, paddingVertical: 15 }}>
          <LinearGradientContainer type="right" style={[styles.linearContainer, { marginHorizontal: 32, marginTop: 10 }]}>
            <TouchableHighlight disabled={disabled} style={styles.linearContainer} underlayColor={Colors.linearUnderlayColor} onPress={() => onPress()} >
              <View style={[styles.linearContainer, styles.paddingStyle]}>
                <Text style={styles.text15}>
                  <FormattedMessage id="asset_card_title_ttlast" />
                </Text>
                <View style={styles.between}>
                  {
                    hidden ? 
                    <Text style={styles.text24}>******</Text>
                    :
                    <Text style={styles.text24}>
                      ≈
                      <CurrencyText
                        value={totalAssets}
                        maximumFractionDigits={2}
                        minimumFractionDigits={2}
                      />
                    </Text>
                  }
                  <TouchableOpacity style={[styles.center, styles.btn]} onPress={this.switchDisplayTotal}>
                    {
                      hidden ? 
                      <Image source={Images.eyes_open} style={styles.image} />
                      :
                      <Image source={Images.eyes_close} style={styles.image} />
                    }
                    
                  </TouchableOpacity>
                </View>
                <View style={styles.between}>
                  {!!accountName && <Text style={styles.text15}>{accountName}</Text>}
                  {!!accountName && <Image style={{ width: 16, height: 16 }} source={Images.qrCode} />}
                </View>
              </View>
            </TouchableHighlight>
          </LinearGradientContainer>
          <TouchableOpacity onPress={this.foldResources}>
            <View style={{ alignItems: 'center' }}>
              <View style={[styles.resourcesContainer, styles.between, { paddingVertical: folded ? 0 : 15 } ]}>
                {!folded && 
                  <View style={styles.center}> 
                    <Text style={styles.text12}>CPU</Text>
                    <Text style={styles.text12}>
                      <FormattedNumber 
                        value={CPUWeight}
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                      />
                      us
                    </Text> 
                  </View>
                }
                {!folded && <View style={styles.divider} />}
                {!folded && 
                  <View style={styles.center}> 
                    <Text style={styles.text12}>BW</Text>
                    <Text style={styles.text12}>
                      <FormattedNumber 
                        value={BandWidth}
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                      />
                      byte
                    </Text> 
                  </View>
                }                
                {!folded && <View style={styles.divider} />}
                {!folded && 
                  <View style={styles.center}> 
                    <Text style={styles.text12}>RAM</Text>
                    <Text style={styles.text12}>
                      <FormattedNumber 
                        value={RAMUsage}
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                      />
                      byte
                    </Text> 
                  </View>
                }             
              </View>
              <View style={styles.guideArrow} />
            </View>
          </TouchableOpacity>
        </View>
      </IntlProvider>
    )
  }
}


