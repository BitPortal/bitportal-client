import React from 'react'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import { Text, View, ScrollView, TouchableHighlight, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 64,
    backgroundColor: Colors.minorThemeColor
  },
  border: {
    borderBottomColor: Colors.bgColor_000000,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  btn: {
    width: 100,
    height: 64,
    marginLeft: SCREEN_WIDTH - 100,
    backgroundColor: Colors.bgColor_255_71_64
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
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

export const DefaultItem = ({ item, onPress, active, disabled }) => (
  <TouchableWithoutFeedback
    underlayColor={Colors.hoverColor}
    style={styles.container}
    disabled={disabled ? disabled : false}
    onPress={() => onPress(item)}
  >
    <View style={[styles.container, styles.between, styles.border, { paddingHorizontal: 32 }]}>
      <Text style={styles.text16}>{item}</Text>
      {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
    </View>
  </TouchableWithoutFeedback>
)

export const DeleteButton = ({ onPress }) => (
  <TouchableHighlight
    onPress={() => onPress()}
    style={[styles.btn, styles.center]}
    underlayColor={Colors.bgColor_255_71_64}
  >
    <Ionicons name="ios-trash-outline" size={30} color={Colors.bgColor_FFFFFF} />
  </TouchableHighlight>
)


class SwipeItem extends React.Component {

  state = {
    isSwiped: false
  }

  onRowOpen = () => {
    this.setState({ isSwiped: true })
  }

  onRowClose = () => {
    this.setState({ isSwiped: false })
  }

  onPressItem = () => {
    if (this.state.isSwiped) {
      this.setState({ isSwiped: false })
    } else {
      this.props.onPress()
    }
  }

  render() {
    const { item, onPress, active, deleteItem } = this.props
    const { isSwiped } = this.state
    return (
      <SwipeRow
        disableRightSwipe={true}
        rightOpenValue={-100}
        preview={true}
        onRowOpen={this.onRowOpen}
        onRowClose={this.onRowClose}
        closeOnRowPress={true}
        style={{ backgroundColor: Colors.bgColor_48_49_59 }}
      >
        <DeleteButton onPress={deleteItem} />
        <DefaultItem item={item} onPress={this.onPressItem} active={active} />
      </SwipeRow>
    )
  }

}

export { SwipeItem } 

