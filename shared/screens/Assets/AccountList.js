
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bgColor_48_49_59
  },
  bgContainer: {
    width: SCREEN_WIDTH,
    marginTop: NAV_BAR_HEIGHT - SCREEN_HEIGHT
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

const ListItem = ({ item, onPress, active }) => (
  <TouchableHighlight
    underlayColor={Colors.bgColor_000000}
    style={styles.listContainer}
    onPress={() => onPress(item)}
  >
    <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32 }]}>
      <Text style={styles.text16}>{item.get('name')}</Text>
      {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
    </View>
  </TouchableHighlight>
)

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class AccountList extends Component {

  switchAccount = (item) => {
    this.props.onPress(item.toJS())
    this.props.dismissModal()
  }

  render() {
    const { data, moreData, activeAccount, dismissModal, onPress, createNewAccount, locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <TouchableOpacity style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]} onPress={() => dismissModal()} />
          <View style={styles.bgContainer}>
            <ScrollView style={{ maxHeight: 400, backgroundColor: Colors.bgColor_48_49_59 }} showsVerticalScrollIndicator={false}>
              {data.map((item, index) => (<ListItem key={item.get('bpid')} item={item} active={item.get('bpid') === activeAccount.get('bpid')} onPress={() => this.switchAccount(item)} />))}
              {moreData.map((item, index) => (<ListItem key={item.get('eosAccountName')} item={item} active={item.get('eosAccountName') === activeAccount.get('eosAccountName')} onPress={() => this.switchAccount(item)} />))}
            </ScrollView>
          </View>
          <TouchableHighlight
            underlayColor={Colors.bgColor_000000}
            style={styles.listContainer}
            onPress={() => { createNewAccount() }}
          >
            <View style={[styles.listContainer, styles.between, { backgroundColor: Colors.minorThemeColor, justifyContent: 'flex-start' , paddingHorizontal: 32 }]}>
              <Ionicons name="ios-add-outline" size={26} color={Colors.textColor_89_185_226} />
              <Text style={[styles.text16, { marginLeft: 10, color: Colors.textColor_89_185_226 }]}>
                <FormattedMessage id="asset_droplist_button_add" />
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </IntlProvider>
    )
  }
}
