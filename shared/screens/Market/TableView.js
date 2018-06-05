
import React, { Component, PureComponent } from 'react'
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
import { ASSET_FRACTION } from 'constants/market'

export const HeaderTitle = ({ messages }) => (
  <View>
    <View style={[styles.headerTitle]}>
      <View style={[styles.coin, styles.center, {height: 25}]}>
        <Text style={[[styles.text14]]}>
          {messages['market_title_name_mrtc']}
        </Text>
      </View>
      <View style={[styles.price, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }]}>
        <Text style={[styles.text14, { marginRight: 30 }]}>
          {messages['market_title_name_price']}
        </Text>
      </View>
      <View style={[styles.change, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 15 }]}>
        <Text style={[styles.text14]}>
          {messages['market_title_name_change']}
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

class ListItem extends PureComponent {
  render() {
    const { data, index, itemExtraStyle, onPress } = this.props

    return (
      <TouchableHighlight
        key={index}
        disabled={true}
        underlayColor={Colors.bgColor_000000}
        onPress={() => onPress(data)}
      >
        <View style={[styles.listItem, { ...itemExtraStyle }]}>
          <View style={styles.coin}>
            <Text style={[styles.text16, { width: 30, marginLeft: 10,  }]}>
              {index + 1}
            </Text>
            <Text style={[styles.text16, { marginRight: 10 }]}>
              {data.get('base_asset')}
            </Text>
          </View>
          <View style={[styles.price, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }]}>
            <Text style={[styles.text16, { marginHorizontal: 10 }]}>
              <FormattedNumber
                value={data.get('price_last')}
                maximumFractionDigits={ASSET_FRACTION[data.get('quote_asset')]}
                minimumFractionDigits={ASSET_FRACTION[data.get('quote_asset')]}
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
  }
}

export default class TableView extends Component {
  render() {
    const { data, refreshing, onRefresh, itemExtraStyle, onPress } = this.props

    return (
      <View style={styles.scrollContainer}>
        <VirtualizedList
          data={data}
          style={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          getItem={(items, index) => items.get ? items.get(index) : items[index]}
          getItemCount={(items) => (items.count() || 0)}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => <ListItem key={index} data={item} index={index} onPress={onPress} />}
        />
      </View>
    )
  }
}
