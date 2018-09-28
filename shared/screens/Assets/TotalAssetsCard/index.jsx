import React, { Component } from 'react'
import CurrencyText from 'components/CurrencyText'
import LinearGradientContainer from 'components/LinearGradientContainer'
import Colors from 'resources/colors'
import Images from 'resources/images'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as eosAccountActions from 'actions/eosAccount'
import storage from 'utils/storage'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { Text, View, TouchableHighlight, StyleSheet, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'
import { formatCycleTime, formatMemorySize } from 'utils/format'
import messages from 'resources/messages'

const styles = StyleSheet.create({
  linearContainer: {
    width: SCREEN_WIDTH - 64,
    height: 150,
    borderRadius: 12
  },
  resourcesContainer: {
    width: SCREEN_WIDTH - 64 - 30,
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
  textRadius: {
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.bgColor_FFFFFF
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
  state => ({
    locale: state.intl.get('locale'),
    isAssetHidden: state.eosAccount.get('isAssetHidden'),
    backupCompleted: state.eosAccount.getIn(['eosAccountCreationInfo', 'backup']),
    isNew: !!state.eosAccount.getIn(['eosAccountCreationInfo', 'transactionId']),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class TotalAssetsCard extends Component {
  async componentWillMount() {
    const store1 = await storage.getItem('bitportal.hiddenTotalAssets', true)
    if (store1 && store1.hiddenTotalAssets) {
      this.props.actions.hiddenAssetDisplay(store1.hiddenTotalAssets)
    }
  }

  checkResources = () => {
    this.props.checkResourcesDetails()
  }

  extraColor = (available, limit) => {
    const colorObj = { color: Colors.textColor_255_76_118 }
    if (available && limit) { return available / limit < 0.1 ? colorObj : {} } else { return {} }
  }

  switchDisplayTotal = async () => {
    const { isAssetHidden } = this.props
    await storage.setItem('bitportal.hiddenTotalAssets', { hiddenTotalAssets: !isAssetHidden }, true)
    this.props.actions.hiddenAssetDisplay(!isAssetHidden)
  }

  render() {
    const { isAssetHidden, backupCompleted, isNew, totalAssets, CPUInfo, NETInfo, RAMQuota, RAMUsage, accountName, disabled, locale, onPress } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={{ alignItems: 'center', backgroundColor: Colors.minorThemeColor, paddingVertical: 15 }}>
          <LinearGradientContainer type="right" style={[styles.linearContainer, { marginHorizontal: 32, marginTop: 10 }]}>
            <TouchableHighlight disabled={disabled} style={styles.linearContainer} underlayColor={Colors.linearUnderlayColor} onPress={onPress}>
              <View style={[styles.linearContainer, styles.paddingStyle]}>
                <View style={styles.between}>
                  <Text style={styles.text15}><FormattedMessage id="assets_label_total_assets" /></Text>
                  {
                    (isNew && !backupCompleted)
                    && <View style={styles.textRadius}>
                      <Text style={[styles.text12, { color: Colors.textColor_89_185_226 }]}>
                        <FormattedMessage id="assets_label_private_key_no_backup" />
                      </Text>
                    </View>
                  }
                </View>
                <View style={styles.between}>
                  {
                    isAssetHidden
                      ? <Text style={styles.text24}>******</Text>
                      : <Text style={styles.text24}>
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
                      isAssetHidden
                        ? <FastImage source={Images.eyes_close} style={styles.image} />
                        : <FastImage source={Images.eyes_open} style={styles.image} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.between}>
                  {!!accountName && <Text style={styles.text15}>{accountName}</Text>}
                  {!!accountName && <FastImage style={{ width: 16, height: 16 }} source={Images.qrCode} />}
                </View>
              </View>
            </TouchableHighlight>
          </LinearGradientContainer>
          <TouchableOpacity disabled={true} onPress={this.foldResources}>
            <View style={{ alignItems: 'center' }}>
              <View style={[styles.resourcesContainer, styles.between, { paddingVertical: 15 }]}>
                <View style={styles.center}>
                  <Text onPress={this.checkResources} style={[styles.text12, { paddingHorizontal: 20 }]}>CPU</Text>
                  <Text onPress={this.checkResources} style={[styles.text12, this.extraColor(CPUInfo.get('available'), CPUInfo.get('max')), { paddingHorizontal: 2 }]}>
                    {formatCycleTime(CPUInfo.get('available'))}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.center}>
                  <Text onPress={this.checkResources} style={[styles.text12, { paddingHorizontal: 20 }]}>NET</Text>
                  <Text onPress={this.checkResources} style={[styles.text12, this.extraColor(NETInfo.get('available'), NETInfo.get('max')), { paddingHorizontal: 2 }]}>
                    {formatMemorySize(NETInfo.get('available'))}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.center}>
                  <Text onPress={this.checkResources} style={[styles.text12, { paddingHorizontal: 20 }]}>RAM</Text>
                  <Text onPress={this.checkResources} style={[styles.text12, this.extraColor(RAMQuota - RAMUsage, RAMQuota), { paddingHorizontal: 2 }]}>
                    {formatMemorySize(RAMQuota - RAMUsage)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </IntlProvider>
    )
  }
}