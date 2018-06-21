import React, { Component, PureComponent } from 'react'
import Colors from 'resources/colors'
import { FormattedNumber } from 'react-intl'
import styles from './styles'
import PropTypes from 'prop-types'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT
} from 'utils/dimens'
import { Text, View, TouchableHighlight, VirtualizedList } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected || nextProps.item.get('owner') !== this.props.item.get('owner') || nextProps.item.get('total_votes') !== this.props.item.get('total_votes')
  }

  render() {
    const { item, rank, onRowPress, selected } = this.props

    return (
      <TouchableHighlight
        style={styles.listItem}
        underlayColor={Colors.bgColor_000000}
        onPress={() => onRowPress(item)}
      >
        <View style={[styles.listItem, styles.between, { paddingRight: 32 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.text14, { width: 35, textAlign: 'right', paddingRight: 7, color: Colors.textColor_181_181_181 }]}>{1 + rank}</Text>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.text18}>{item.get('owner')}</Text>
                {/* <View style={[styles.location, styles.center]}>
                    <Text style={styles.text14}> {'Bvi'}</Text>
                    </View> */}
              </View>
              <Text style={[styles.text14, { marginTop: 3, color: Colors.textColor_181_181_181 }]}>
                <FormattedNumber
                  value={item.get('total_votes')}
                  maximumFractionDigits={0}
                  minimumFractionDigits={0}
                />
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            {
              selected ?
                <Ionicons name="md-checkmark-circle" size={26} color={Colors.textColor_89_185_226} />
              :
                <View style={styles.radius} />
            }
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default class ProducerList extends PureComponent {
  render() {
    return (
      <VirtualizedList
        data={this.props.data}
        style={styles.list}
        getItem={(items, index) => (items.get ? items.get(index) : items[index])}
        getItemCount={items => (items.count() || 0)}
        keyExtractor={(item, index) => String(index) + item.get('owner')}
        showsVerticalScrollIndicator={false}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
        ItemSeparatorComponent={() => (<View style={styles.separator} />)}
        renderItem={({ item, index }) => <ListItem key={item.get('owner')} item={item} rank={index} onRowPress={() => this.props.onRowPress(item)} selected={this.props.selected.indexOf(item.get('owner')) !== -1} />}
      />
    )
  }
}

ProducerList.propTypes = {
  data: PropTypes.any,
  onRefresh: PropTypes.func,
  onRowPress: PropTypes.func,
  refreshing: PropTypes.bool
}
