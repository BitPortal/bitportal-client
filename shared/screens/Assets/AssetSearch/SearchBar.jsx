import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, Platform } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { bindActionCreators } from 'redux'
import * as eosAssetActions from 'actions/eosAsset'
import messages from './messages'

const styles = StyleSheet.create({
  searchContainer: {
    width: SCREEN_WIDTH * 0.6,
    height: 30,
    marginVertical: 4,
    marginLeft: 32,
    paddingLeft: 6,
    borderRadius: 6,
    backgroundColor: Colors.bgColor_000000,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputStyle: {
    width: SCREEN_WIDTH * 0.6 - 40,
    height: 40,
    marginLeft: Platform.OS === 'ios' ? 11 : 7,
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(14)
  }
})

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAssetActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class SearchBar extends Component {

  onChangeText = (text) => {
    this.props.actions.setSearchValue(text)
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider >
        <View style={[styles.searchContainer, { flexDirection: 'row', alignItems: 'center' }]}>
          <Ionicons name="md-search" size={FontScale(22)} color={Colors.textColor_142_142_147} />
          <TextInput
            autoCorrect={false}
            autoFocus={true}
            underlineColorAndroid="transparent"
            style={styles.textInputStyle}
            selectionColor={Colors.textColor_FFFFEE}
            keyboardAppearance={Colors.keyboardTheme}
            placeholder={messages[locale].astsch_title_name_search}
            placeholderTextColor="#999999"
            onChangeText={this.onChangeText}
          />
        </View>
      </IntlProvider>
    )
  }

}
