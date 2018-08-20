import React, { Component, PureComponent } from 'react'
import Colors from 'resources/colors'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import { Text, View, TouchableHighlight, TouchableOpacity, VirtualizedList, Dimensions, RefreshControl } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import ImmutableDataProvider from 'utils/immutableDataProvider'
import { SCREEN_WIDTH } from 'utils/dimens'
import styles from './styles'

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected || nextProps.item.get('owner') !== this.props.item.get('owner') || nextProps.item.get('total_votes') !== this.props.item.get('total_votes') || nextProps.item.get('info') !== this.props.item.get('info')
  }

  render() {
    const { item, rank, onRowPress, onMarkPress, selected, totalVotes } = this.props
    const location = item.getIn(['info', 'org', 'location'])
    const weight = +item.getIn(['info', 'weight'])
    const graColor = weight === 1 ? Colors.cooperateColor : Colors.recommandColor
    const teamName = item.getIn(['info', 'org', 'name'])

    return (
      <TouchableHighlight
        style={styles.listItem}
        underlayColor={Colors.bgColor_000000}
        onPress={() => onRowPress(item)}
      >
        <View style={[styles.listItem, styles.between, { paddingRight: 32 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ paddingLeft: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.rank, styles.center, { marginRight: 10 }]}>
                  <Text style={[styles.text14, { color: Colors.textColor_181_181_181, marginHorizontal: 5, marginVertical: 2 }]}>
                    {rank + 1}
                  </Text>
                </View>
                <Text style={styles.text18}>{teamName || item.get('owner')}</Text>
                {!!weight
                  && <LinearGradientContainer type="right" colors={graColor} style={[styles.center, styles.flag]}>
                    <Text numberOfLines={1} style={[styles.text12, { marginHorizontal: 8, color: Colors.textColor_255_255_238 }]}>
                      {weight === 1 && <FormattedMessage id="vt_sec_tag_cprt" />}
                      {weight >= 2 && <FormattedMessage id="vt_sec_tag_prmt" />}
                    </Text>
                  </LinearGradientContainer>
                }
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                {!!location && typeof location === 'string' && <View style={[styles.location, styles.center, { marginRight: 10 }]}>
                  <Text numberOfLines={1} style={styles.text14}>{location}</Text>
                </View>}
                <Text style={[styles.text14, { marginTop: 3, color: Colors.textColor_181_181_181 }]}>
                  <FormattedNumber
                    value={(+item.get('total_votes') / +totalVotes) * 100}
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />%
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => onMarkPress(item)} style={{ width: 40, height: 70, alignItems: 'flex-end', justifyContent: 'center' }}>
            {
              selected
                ? <Ionicons name="md-checkmark-circle" size={26} color={Colors.textColor_89_185_226} />
                : <View style={styles.radius} />
            }
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    )
  }
}

let dataProvider = new ImmutableDataProvider((r1, r2) => {
  return r1 !== r2
})

export default class ProducerList extends Component {
  static getDerivedStateFromProps(props, state) {
    return {
      dataProvider: dataProvider.cloneWithRows(props.data)
    }
  }

  state = {
    dataProvider: dataProvider.cloneWithRows(this.props.data)
  }

  layoutProvider = new LayoutProvider(
    index => index,
    (type, dim) => {
      dim.width = SCREEN_WIDTH
      dim.height = 70
    }
  )

  rowRenderer = (type, item) => (
    <ListItem
      key={item.get('owner')}
      item={item}
      rank={item.get('rank')}
      totalVotes={this.props.totalVotes}
      onRowPress={this.props.onRowPress.bind(this, item)}
      onMarkPress={this.props.onMarkPress.bind(this, item)}
      selected={item.get('selected')}
    />
  )

  render() {
    return (
      <RecyclerListView
        style={styles.list}
        refreshControl={<RefreshControl onRefresh={this.props.onRefresh} refreshing={this.props.refreshing} />}
        layoutProvider={this.layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={this.rowRenderer}
        renderAheadOffset={14000}
      />
    )
  }
}
