
import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'
import Immutable from 'immutable'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import Colors from 'resources/colors'
import styles from './styles'
import {
  Text,
  View,
  TouchableHighlight,
  VirtualizedList,
  ScrollView,
  RefreshControl
} from 'react-native'

export const HeaderTitle = ({ }) => (
  <View>
    <View style={[styles.headerTitle]}>
      <View style={[styles.coin, styles.center, {height: 25}]}>
        <Text style={[[styles.text16, { color: Colors.textColor_142_142_147 }]]}>
          MarketCap
        </Text>
      </View>
      <View style={[styles.price, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }]}>
        <Text style={[styles.text16, { marginRight: 20 }]}>
          Price
        </Text>
      </View>
      <View style={[styles.change, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 15 }]}>
        <Text style={[styles.text16]}>
          Change
        </Text>
      </View>
    </View>
  </View>
)

const filterBgColor = (data) => {
  if (data && parseFloat(data) > 0) {
    return Colors.bgColor_104_189_57
  } else if (data && parseFloat(data) < 0) {
    return Colors.bgColor_255_50_50
  } else {
    return Colors.bgColor_59_59_59
  }
}

const ListItem = ({ data, index, itemExtraStyle, onPress }) => (
  <TouchableHighlight
    key={index}
    underlayColor={Colors.bgColor_000000}
    onPress={() => onPress(data)}
  >
    <View style={[styles.listItem, { ...itemExtraStyle }]}>
      <View style={styles.coin}>
        <Text style={[styles.text16, { width: 20, marginHorizontal: 10,  }]}>
          {index + 1}
        </Text>
        <Text style={[styles.text16, { marginHorizontal: 10 }]}>
          {data.get('base_asset')}
        </Text>
      </View>
      <View style={[styles.price, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }]}>
        <Text style={[styles.text16, { marginHorizontal: 10 }]}>
          <FormattedNumber
            value={data.get('price_last')}
            maximumFractionDigits={8}
            minimumFractionDigits={8}
          />
        </Text>
      </View>
      <View style={[styles.change, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 15 }]}>
        <View style={[styles.center, { minWidth: 70, borderRadius: 4, padding: 7, backgroundColor: filterBgColor(data.get('price_change_percent')) }]}>
          <Text style={[styles.text16, { color: Colors.textColor_255_255_238 }]}>
            <FormattedNumber
              value={data.get('price_change_percent')}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
            />
            %
          </Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
)

export default class TableView extends Component {
  constructor() {
    super()
    this.list = null
  }

  render() {
    const { data, isRefreshing, onRefresh, itemExtraStyle, onPress } = this.props

    return (
      <View style={styles.scrollContainer}>
        <VirtualizedList
          data={data}
          style={styles.list}
          onRefresh={() => onRefresh()}
          refreshing={isRefreshing}
          getItem={(items, index) => items.get ? items.get(index) : items[index]}
          getItemCount={(items) => (items.count() || 0)}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => <ListItem key={index} data={item} index={index} onPress={(e) => onPress(e)} />}
          ref={ref => this.list = ref}
        />
      </View>
    )
  }
}
