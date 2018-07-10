import React, { Component, PureComponent } from 'react'
import Colors from 'resources/colors'
import { FormattedNumber } from 'react-intl'
import { Text, View, TouchableHighlight, TouchableOpacity, VirtualizedList } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradientContainer from 'components/LinearGradientContainer'
import styles from './styles'

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected || nextProps.item.get('owner') !== this.props.item.get('owner') || nextProps.item.get('total_votes') !== this.props.item.get('total_votes') || nextProps.item.get('info') !== this.props.item.get('info')
  }

  render() {
    const { item, rank, onRowPress, onMarkPress, selected, totalVotes } = this.props
    const location = item.getIn(['info', 'org', 'location'])
    const weight = +item.getIn(['info', 'weight'])
    const graColor = weight === 0 ? Colors.recommandColor : Colors.cooperateColor

    return (
      <TouchableHighlight
        style={styles.listItem}
        underlayColor={Colors.bgColor_000000}
        onPress={() => onRowPress(item)}
      >
        <View style={[styles.listItem, styles.between, { paddingRight: 32 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ paddingLeft: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.text18}>{item.get('owner')}</Text>
                {(weight === 0 || weight === 1) &&
                  <LinearGradientContainer type="right" colors={graColor} style={[styles.center, styles.flag]} >
                    <Text style={[styles.text12, { color: Colors.textColor_255_255_238 }]}>
                      {weight === 0 && '推广'}
                      {weight === 1 && '合作'}
                    </Text>
                  </LinearGradientContainer>
                }
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={[styles.rank, styles.center, { marginRight: 10 }]}>
                  <Text style={[styles.text14, { color: Colors.textColor_181_181_181, marginHorizontal: 5, marginVertical: 2 }]}>
                   {rank + 1}
                  </Text>
                </View>
                {!!location && typeof location === 'string' && <View style={[styles.location, styles.center, { marginRight: 10 }]}>
                  <Text style={styles.text14}>{location.length > 20 ? `${location.slice(0, 19)}...` : location}</Text>
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
              selected ?
                <Ionicons name="md-checkmark-circle" size={26} color={Colors.textColor_89_185_226} />
              :
                <View style={styles.radius} />
            }
          </TouchableOpacity>
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
        renderItem={({ item, index }) => (
          <ListItem
            key={item.get('owner')}
            item={item}
            rank={index}
            totalVotes={this.props.totalVotes}
            onRowPress={() => this.props.onRowPress(item)}
            onMarkPress={() => this.props.onMarkPress(item)}
            selected={this.props.selected.indexOf(item.get('owner')) !== -1}
          />
        )}
      />
    )
  }
}
