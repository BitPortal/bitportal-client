import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity, VirtualizedList, ScrollView } from 'react-native'
import * as tickerActions from 'actions/ticker'
import * as tokenActions from 'actions/token'
import FastImage from 'react-native-fast-image'
import SettingItem from 'components/SettingItem'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import abbreviate from 'number-abbreviate'
import { filterBgColor } from 'utils'
import { ASSET_FRACTION } from 'constants/market'
import messages from 'resources/messages'
import Images from 'resources/images'
import { DAPP_SECTION_ICONS } from 'constants/dApp'
import { FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)
export default class DappCategories extends Component {
  state = { allItems: ['all'] }

  UNSAFE_componentWillMount() {
    this.setState({ allItems: ['all', ...this.props.items] })
  }

  handleCategory = title => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList',
        passProps: { section: title }
      }
    })
  }

  render() {
    const { items, loading, onPress, locale } = this.props
    const { allItems } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.scrollContainer}>
          <ScrollView horizontal={false} scrollEnabled={false} contentContainerStyle={styles.dAppScrollViewContainer}>
            {allItems.map((item, index) => {
              if (index === 0)
                return (
                  <SettingItem
                    key={index}
                    leftImage={DAPP_SECTION_ICONS[item].icon}
                    leftItemTitle={<FormattedMessage id={DAPP_SECTION_ICONS[item].stringId} />}
                    extraStyle={{
                      borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                      borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS,
                      paddingHorizontal: 20
                    }}
                    onPress={() => this.handleCategory(item)}
                  />
                )
              if (index === allItems.length - 1)
                return (
                  <SettingItem
                    key={index}
                    leftImage={DAPP_SECTION_ICONS[item].icon}
                    leftItemTitle={<FormattedMessage id={DAPP_SECTION_ICONS[item].stringId} />}
                    extraStyle={{
                      borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                      borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS,
                      paddingHorizontal: 20
                    }}
                    onPress={() => this.handleCategory(item)}
                  />
                )
              else
                return (
                  <SettingItem
                    key={index}
                    leftImage={DAPP_SECTION_ICONS[item].icon}
                    leftItemTitle={<FormattedMessage id={DAPP_SECTION_ICONS[item].stringId} />}
                    extraStyle={{ paddingHorizontal: 20 }}
                    onPress={() => this.handleCategory(item)}
                  />
                )
            })}
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
