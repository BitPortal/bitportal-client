import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, View } from 'react-native'
import NewsRow, { NewsRowTypes } from 'components/NewsRow'
import Colors from 'resources/colors'

class NewsList extends React.PureComponent {
  keyExtractor = item => item.id

  renderItem = ({ item }) =>
    <NewsRow
      {...item}
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
      />
    )
  }
}

NewsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(NewsRowTypes))
}

NewsList.defaultProps = {
  data: []
}

export default NewsList
