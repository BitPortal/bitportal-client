import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import Dialog from 'components/Dialog'
import styles from './styles'

class ListItem extends Component {
  //  = ({ item, onPress, icon }) => (
  render() {
    const { item, icon, onPress } = this.props
    return (
      <View style={styles.menuItemWrapper}>
        <TouchableOpacity underlayColor={Colors.hoverColor} style={styles.menuButton} onPress={() => onPress()}>
          <View style={[styles.icon]}>
            <FastImage style={styles.categoryIcon} source={icon} />
          </View>
          <Text numberOfLines={2} style={[styles.title]}>
            {/* {item.get('display_name').get(locale) || item.get('display_name').get('en')} */}
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
/* eslint-disable */

export default class BrowserMenu extends Component {
  // ({ dismissModal, changeCategory, locale, messages, menuList }) => {

  handleOnPress = category => {
    if ((category.login_required && loggedIn) || !category.login_required) {
      return changeCategory(category.name)
    } else
      return Dialog.alert(messages[locale].general_error_popup_text_no_account, null, {
        negativeText: messages[locale].general_popup_button_close
      })
  }

  /* eslint-enable */
  render() {
    const { dismissModal, menuList } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
          onPress={() => dismissModal()}
        />
        <View style={styles.bgContainer}>
          <ScrollView
            //   style={{ maxHeight: 400, backgroundColor: Colors.bgColor_30_31_37 }}
            horizontal={true}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}
          >
            {menuList.map(item => (
              <ListItem
                key={item.name}
                item={item.name}
                icon={item.icon}
                onPress={() => {
                  item.onPress()
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
}
