import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import Dialog from 'components/Dialog'

import { MARKET_CATEGORY_NAMES } from 'constants/market'
import styles from './styles'

const ListItem = ({ category, onPress, active, loginRequired, loggedIn }) => (
  <TouchableHighlight underlayColor={Colors.hoverColor} style={styles.listContainer} onPress={() => onPress(category)}>
    <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32 }]}>
      {loginRequired && !loggedIn ? (
        <Text style={[styles.text16, { color: 'grey' }]}>{MARKET_CATEGORY_NAMES[category]}</Text>
      ) : (
        <Text style={[styles.text16]}>{MARKET_CATEGORY_NAMES[category]}</Text>
      )}
      {/* <Text style={[styles.text16]}>{MARKET_CATEGORY_NAMES[category]}</Text> */}

      {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
    </View>
  </TouchableHighlight>
)
/* eslint-disable */

const CategoryList = ({ dismissModal, activeCategory, categoryList, changeCategory, loggedIn, locale, messages }) => {
  handleOnPressLogic = category => {
    if ((category.login_required && loggedIn) || !category.login_required) {
      return changeCategory(category.name)
    } else
      return Dialog.alert(messages[locale].general_error_popup_text_no_account, null, {
        negativeText: messages[locale].general_popup_button_close
      })
  }
  /* eslint-enable */

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
        onPress={() => dismissModal()}
      />
      <View style={styles.bgContainer}>
        <ScrollView
          style={{ maxHeight: 400, backgroundColor: Colors.bgColor_30_31_37 }}
          showsVerticalScrollIndicator={false}
        >
          {categoryList.map(category => (
            <ListItem
              key={category.name}
              category={category.name}
              loginRequired={category.login_required}
              loggedIn={loggedIn}
              active={activeCategory === category.name}
              onPress={() => {
                this.handleOnPressLogic(category)
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default CategoryList
