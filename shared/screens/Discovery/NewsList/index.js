import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, View } from 'react-native'
import NewsRow, { NewsRowTypes } from '../NewsRow'
import Colors from 'resources/colors'

class NewsList extends React.PureComponent {
  keyExtractor = item => item.id

  renderItem = ({ item }) =>
    <NewsRow
      previewImage={item.previewImage}
      title={item.title}
      subTitle={item.subTitle}
      author={item.author}
      date={item.date}
      id={item.id}
      onRowPress={() => this.props.onRowPress(item)}
      key={item.id}
    />

  renderSeparator = () =>
    <View style={{ height: 1, width: '100%', backgroundColor: Colors.bgColor_000000 }} />

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        onRefresh={this.props.onRefresh}
        onEndReached={this.props.onEndReached}
        refreshing={this.props.refreshing}
      />
    )
  }
}

NewsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(NewsRowTypes)),
  onRefresh: PropTypes.func,
  onEndReached: PropTypes.func,
  onRowPress: PropTypes.func,
  refreshing: PropTypes.bool,
}

NewsList.defaultProps = {
  data: [],
  onRefresh: null,
  onEndReached: null,
  onRowPress: null,
  refreshing: false,
}

export default NewsList
