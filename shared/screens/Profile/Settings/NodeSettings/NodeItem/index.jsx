import React from 'react'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import { Text, View, TouchableHighlight, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'

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

export const DefaultItem = ({ data, onPress, active }) => (
  <TouchableWithoutFeedback
    underlayColor={Colors.hoverColor}
    style={styles.container}
    onPress={onPress}
  >
    <View style={[styles.container, styles.between, styles.border, { paddingHorizontal: 32 }]}>
      <Text style={styles.text16}>{data.item.url}</Text>
      {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
    </View>
  </TouchableWithoutFeedback>
)

export const DeleteButton = ({ onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    style={[styles.btn, styles.center]}
    underlayColor={Colors.bgColor_255_71_64}
  >
    <Ionicons name="ios-trash-outline" size={30} color={Colors.bgColor_FFFFFF} />
  </TouchableHighlight>
)


@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
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
      this.props.onPress(this.props.data)
    }
  }

  render() {
    const { data, active, deleteItem, enableDelete } = this.props

    return (
      <SwipeRow
        disableRightSwipe={true}
        disableLeftSwipe={!enableDelete}
        rightOpenValue={-100}
        preview={enableDelete}
        onRowOpen={this.onRowOpen}
        onRowClose={this.onRowClose}
        closeOnRowPress={true}
        style={{ backgroundColor: Colors.bgColor_30_31_37 }}
      >
        <DeleteButton onPress={deleteItem} />
        <DefaultItem data={data} onPress={this.onPressItem} active={active} />
      </SwipeRow>
    )
  }
}

export { SwipeItem }
