
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, StyleSheet } from 'react-native'
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
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT,
    marginTop: NAV_BAR_HEIGHT
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bgColor_48_49_59
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
      {active && <Ionicons name="ios-checkmark" size={26} color={Colors.bgColor_0_122_255} />}
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
    this.props.onPress({ name: item.get('name'), id: item.get('id') })
    this.props.dismissModal()
  }

  render() {
    const { data, activeAccount, dismissModal, onPress, createNewAccount, locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          {
            data.map((item, index) => (
                <ListItem key={index} item={item} active={item.get('id') === activeAccount.get('id')} onPress={() => this.switchAccount(item)}/>
              )
            )
          }
          <TouchableHighlight
            underlayColor={Colors.bgColor_000000}
            style={styles.listContainer}
            onPress={() => {
              createNewAccount()
              dismissModal()
            }}
          >
            <View style={[styles.listContainer, styles.between, { backgroundColor: Colors.minorThemeColor, justifyContent: 'flex-start' , paddingHorizontal: 32 }]}>
              <Ionicons name="ios-add-outline" size={26} color={Colors.textColor_89_185_226} />
              <Text style={[styles.text16, { marginLeft: 10, color: Colors.textColor_89_185_226 }]}>
                <FormattedMessage id="asset_droplist_button_add" />
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={Colors.mainThemeColor}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}
            onPress={() => dismissModal()}
          >
            <View />
          </TouchableHighlight>
        </View>
      </IntlProvider>  
    )
  }
} 
