/* eslint-disable react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import {
  NativeModules,
  requireNativeComponent,
  EdgeInsetsPropType,
  PointPropType,
  findNodeHandle,
  View,
} from 'react-native'
import TableViewSection from './TableViewSection'
import TableViewCell from './TableViewCell'
import TableViewItem from './TableViewItem'
import RNTableViewConsts from './TableViewConsts'
import CollectionView from './CollectionView'
import ViewPropTypes from './util/ViewPropTypes'

const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')

const RNTableView = requireNativeComponent('RNTableView', null)

function extend(el, map) {
  for (const i in map) {
    if (typeof map[i] !== 'object') el[i] = map[i]
  }

  return el
}

const FontWeight = PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900, 'bold', 'normal'])
const FontStyle = PropTypes.oneOf(['italic', 'normal', 'oblique'])

class TableView extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    onAccessoryPress: PropTypes.func,
    onWillDisplayCell: PropTypes.func,
    onEndDisplayingCell: PropTypes.func,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // string or integer basically
    autoFocus: PropTypes.bool,
    autoFocusAnimate: PropTypes.bool,
    alwaysBounceVertical: PropTypes.bool,
    moveWithinSectionOnly: PropTypes.bool,
    json: PropTypes.string,
    tintColor: PropTypes.string,
    fontSize: PropTypes.number,
    fontWeight: FontWeight,
    fontStyle: FontStyle,
    fontFamily: PropTypes.string,
    textColor: PropTypes.string,
    detailTextColor: PropTypes.string,
    detailFontSize: PropTypes.number,
    detailFontWeight: FontWeight,
    detailFontStyle: FontStyle,
    detailFontFamily: PropTypes.string,
    headerTextColor: PropTypes.string,
    headerFontSize: PropTypes.number,
    headerFontWeight: FontWeight,
    headerFontStyle: FontStyle,
    headerFontFamily: PropTypes.string,
    footerTextColor: PropTypes.string,
    footerFontSize: PropTypes.number,
    footerFontWeight: FontWeight,
    footerFontStyle: FontStyle,
    footerFontFamily: PropTypes.string,
    separatorColor: PropTypes.string,
    separatorStyle: PropTypes.number,
    scrollEnabled: PropTypes.bool,
    sectionIndexTitlesEnabled: PropTypes.bool,
    showsHorizontalScrollIndicator: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    onScroll: PropTypes.func,
    onLoadMore: PropTypes.func,
    onChange: PropTypes.func,
    onLeadingSwipe: PropTypes.func,
    onTrailingSwipe: PropTypes.func,
    /**
     * The amount by which the content is inset from the edges
     * of the TableView. Defaults to `{0, 0, 0, 0}`.
     * @platform ios
     */
    contentInset: EdgeInsetsPropType,
    /**
     * Used to manually set the starting scroll offset.
     * The default value is `{x: 0, y: 0}`.
     * @platform ios
     */
    contentOffset: PointPropType,
    /**
     * The amount by which the scroll view indicators are inset from the
     * edges of the TableView. This should normally be set to the same
     * value as the `contentInset`. Defaults to `contentInset` or
     * `{0, 0, 0, 0}`.
     * @platform ios
     */
    scrollIndicatorInsets: EdgeInsetsPropType,
    tableViewStyle: PropTypes.number,
    tableViewCellStyle: PropTypes.number,
    tableViewCellEditingStyle: PropTypes.number,
    style: ViewPropTypes.style,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    canRefresh: PropTypes.bool,
    canLoadMore: PropTypes.bool,
    cellSeparatorInset: EdgeInsetsPropType,
    cellLayoutMargins: EdgeInsetsPropType,
  }

  static defaultProps = {
    tableViewStyle: RNTableViewConsts.Style.Plain,
    tableViewCellStyle: RNTableViewConsts.CellStyle.Subtitle,
    tableViewCellEditingStyle: RNTableViewConsts.CellEditingStyle.Delete,
    separatorStyle: RNTableViewConsts.SeparatorStyle.Line,
    autoFocusAnimate: true,
    autoFocus: false,
    alwaysBounceVertical: true,
    scrollEnabled: true,
    sectionIndexTitlesEnabled: false,
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    moveWithinSectionOnly: false,
    canRefresh: false,
    canLoadMore: false,
    refreshing: false,
    style: null,
    json: null,
    selectedValue: null,
    contentInset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    contentOffset: {
      x: 0,
      y: 0,
    },
    scrollIndicatorInsets: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    textColor: null,
    detailTextColor: null,
    tintColor: null,
    headerTextColor: null,
    footerTextColor: null,
    separatorColor: null,
    onChange: () => null,
    onLeadingSwipe: () => null,
    onTrailingSwipe: () => null,
    onScroll: () => null,
    onLoadMore: () => null,
    onPress: () => null,
    onRefresh: () => null,
    onAccessoryPress: () => null,
    onWillDisplayCell: () => null,
    onEndDisplayingCell: () => null,
  }

  constructor(props) {
    super(props)

    this.state = this._stateFromProps(props)
    this.scrollTo = this.scrollTo.bind(this)
    this.scrollToIndex = this.scrollToIndex.bind(this)
    this.scrollCollectonViewToItem = this.scrollCollectonViewToItem.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const state = this._stateFromProps(nextProps)
    this.setState(state)

    if (this.props.refreshing === false && nextProps.refreshing) {
      NativeModules.RNTableViewManager.startRefreshing(findNodeHandle(this.tableView))
    }

    if (this.props.refreshing && !nextProps.refreshing) {
      NativeModules.RNTableViewManager.stopRefreshing(findNodeHandle(this.tableView))
    }
  }

  // Translate TableView prop and children into stuff that RNTableView understands.
  _stateFromProps(props) {
    const sections = []
    const additionalItems = []
    const children = []
    const { json } = props

    // iterate over sections
    React.Children.forEach(props.children, (section, index) => {
      const items = []
      let count = 0

      if (section && section.type === TableViewSection) {
        let customCells = false

        React.Children.forEach(section.props.children, (child, itemIndex) => {
          // console.log(section.props.children)
          const el = {}
          extend(el, section.props)
          extend(el, child.props)

          if (
            el.containCollectionView
            && React.Children.only(child.props.children)
            // && React.Children.only(child.props.children).type === 'CollectionView'
          ) {
            el.collectionViewItems = []
            let collectionView = React.Children.only(child.props.children)

            React.Children.forEach(collectionView.props.children, (collectionViewItem, collectionViewIndex) => {
              // if (collectionViewItem.type === 'CollectionViewItem') {
              const collectionViewItemElement = {}
              extend(collectionViewItemElement, collectionViewItem.props)

              if (collectionViewItemElement.moreButtonImage && typeof collectionViewItemElement.moreButtonImage === 'number') {
                collectionViewItemElement.moreButtonImage = resolveAssetSource(collectionViewItemElement.moreButtonImage)
              }
                el.collectionViewItems.push(collectionViewItemElement)
              // }
            })
          } else if (el.children) {
            el.label = el.children
          }

          if (el.image && typeof el.image === 'number') {
            el.image = resolveAssetSource(el.image)
          }

          if (el.selectedAccessoryImage && typeof el.selectedAccessoryImage === 'number') {
            el.selectedAccessoryImage = resolveAssetSource(el.selectedAccessoryImage)
          }

          if (el.trailingImage && typeof el.trailingImage === 'number') {
            el.trailingImage = resolveAssetSource(el.trailingImage)
          }

          if (el.leadingImage && typeof el.leadingImage === 'number') {
            el.leadingImage = resolveAssetSource(el.leadingImage)
          }

          count++
          items.push(el)

          if (child.type === TableViewCell) {
            customCells = true
            count++

            const element = React.cloneElement(child, {
              key: `${index} ${itemIndex}`,
              section: index,
              row: itemIndex,
            })
            children.push(element)
          }
        })

        sections.push({
          customCells,
          label: section.props.label,
          footerLabel: section.props.footerLabel,
          footerHeight: section.props.footerHeight,
          headerHeight: section.props.headerHeight,
          headerButtonText: section.props.headerButtonText,
          headerButtonIcon: section.props.headerButtonIcon,
          items,
          count,
        })
      } else if (section && section.type === TableViewItem) {
        const el = extend({}, section.props)

        if (!el.label) {
          el.label = el.children
        }

        additionalItems.push(el)
      } else if (section) {
        children.push(section)
      }
    })

    this.sections = sections

    return {
      sections,
      additionalItems,
      children,
      json,
    }
  }

  scrollTo(x, y, animated) {
    NativeModules.RNTableViewManager.scrollTo(findNodeHandle(this.tableView), x, y, animated)
  }

  scrollToIndex({ index, section = 0, animated = true }) {
    NativeModules.RNTableViewManager.scrollToIndex(findNodeHandle(this.tableView), index, section, animated)
  }

  scrollCollectonViewToItem({ itemIndex, index = 0, section = 0, animated = false }) {
    NativeModules.RNTableViewManager.scrollCollectonViewToItem(findNodeHandle(this.tableView), itemIndex, index, section, animated)
  }

  _onScroll(event) {
    this.props.onScroll(event)
  }

  _onLoadMore(event) {
    this.props.onLoadMore(event)
  }

  _onPress(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex] &&
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex].onPress
    ) {
      this.sections[data.selectedSection] && this.sections[data.selectedSection].items[data.selectedIndex].onPress(data)
    }

    this.props.onPress(data)
    event.stopPropagation()
  }

  _onAccessoryPress(event) {
    const data = event.nativeEvent

    this.props.onAccessoryPress(data)

    if (this.sections) {
      const pressedItem = this.sections[data.accessorySection].items[data.accessoryIndex]

      pressedItem.onAccessoryPress && pressedItem.onAccessoryPress(data)
    }

    event.stopPropagation()
  }

  _onAddAccessoryPress(event) {
    const data = event.nativeEvent

    if (this.props.onAddAccessoryPress) {
      this.props.onAddAccessoryPress(data)
    } else if (this.sections) {
      const pressedItem = this.sections[data.accessorySection].items[data.accessoryIndex]

      pressedItem.onAddAccessoryPress && pressedItem.onAddAccessoryPress(data)
    }

    event.stopPropagation()
  }

  _onMoreAccessoryPress(event) {
    const data = event.nativeEvent

    this.props.onMoreAccessoryPress && this.props.onMoreAccessoryPress(data)
    event.stopPropagation()
  }

  _onSwitchAccessoryChanged(event) {
    const data = event.nativeEvent

    this.props.onSwitchAccessoryChanged(data)

    if (this.sections) {
      const pressedItem = this.sections[data.accessorySection].items[data.accessoryIndex]
      pressedItem.onSwitchAccessoryChanged && pressedItem.onSwitchAccessoryChanged(data)
    }

    event.stopPropagation()
  }

  _onChange(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex] &&
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex].onChange
    ) {
      this.sections[data.selectedSection] &&
        this.sections[data.selectedSection].items[data.selectedIndex].onChange(data)
    }

    this.props.onChange(data)
    event.stopPropagation()
  }

  _onLeadingSwipe(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex] &&
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex].onLeadingSwipe
    ) {
      this.sections[data.selectedSection] &&
        this.sections[data.selectedSection].items[data.selectedIndex].onLeadingSwipe(data)
    }

    this.props.onLeadingSwipe(data)
    event.stopPropagation()
  }

  _onTrailingSwipe(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex] &&
      this.sections[data.selectedSection] &&
      this.sections[data.selectedSection].items[data.selectedIndex].onTrailingSwipe
    ) {
      this.sections[data.selectedSection] &&
        this.sections[data.selectedSection].items[data.selectedIndex].onTrailingSwipe(data)
    }

    this.props.onTrailingSwipe(data)
    event.stopPropagation()
  }

  _onWillDisplayCell(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.section] &&
      this.sections[data.section].items[data.row] &&
      this.sections[data.section].items[data.row].onWillDisplayCell
    ) {
      this.sections[data.section].items[data.row].onWillDisplayCell(data)
    }

    this.props.onWillDisplayCell(data)
    event.stopPropagation()
  }

  _onEndDisplayingCell(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.section] &&
      this.sections[data.section].items[data.row] &&
      this.sections[data.section].items[data.row].onEndDisplayingCell
    ) {
      this.sections[data.section].items[data.row].onEndDisplayingCell(data)
    }

    this.props.onEndDisplayingCell(data)
    event.stopPropagation()
  }

  _onItemNotification(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.section] &&
      this.sections[data.section].items[data.row] &&
      this.sections[data.section].items[data.row].onItemNotification
    ) {
      this.sections[data.section].items[data.row].onItemNotification(data)
    }

    this.props.onItemNotification(data)
    event.stopPropagation()
  }

  _onCollectionViewDidSelectItem(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.section] &&
      this.sections[data.section].items[data.row] &&
      this.sections[data.section].items[data.row].onCollectionViewDidSelectItem
    ) {
      this.sections[data.section].items[data.row].onCollectionViewDidSelectItem(data)
    }

    this.props.onCollectionViewDidSelectItem(data)
    event.stopPropagation()
  }

  _onScrollViewDidEndDecelerating(event) {
    const data = event.nativeEvent

    if (
      this.sections[data.section] &&
      this.sections[data.section].items[data.row] &&
      this.sections[data.section].items[data.row].onScrollViewDidEndDecelerating
    ) {
      this.sections[data.section].items[data.row].onScrollViewDidEndDecelerating(data)
    }

    if (this.props.onScrollViewDidEndDecelerating) {
      this.props.onScrollViewDidEndDecelerating(data)
      event.stopPropagation()
    }
  }

  render() {
    return (
        <RNTableView
          ref={(ref) => {
            this.tableView = ref
          }}
          style={this.props.style}
          sections={this.state.sections}
          additionalItems={this.state.additionalItems}
          tableViewStyle={this.props.tableViewStyle}
          tableViewCellStyle={this.props.tableViewCellStyle}
          tableViewCellEditingStyle={this.props.tableViewCellEditingStyle}
          separatorStyle={this.props.separatorStyle}
          scrollIndicatorInsets={this.props.contentInset}
          alwaysBounceVertical={this.props.alwaysBounceVertical}
          {...this.props}
          json={this.state.json}
          onScroll={(...args) => this._onScroll(...args)}
          onLoadMore={(...args) => this._onLoadMore(...args)}
          onPress={(...args) => this._onPress(...args)}
          onAccessoryPress={(...args) => this._onAccessoryPress(...args)}
          onAddAccessoryPress={(...args) => this._onAddAccessoryPress(...args)}
          onSwitchAccessoryChanged={(...args) => this._onSwitchAccessoryChanged(...args)}
          onChange={(...args) => this._onChange(...args)}
          onLeadingSwipe={(...args) => this._onLeadingSwipe(...args)}
          onTrailingSwipe={(...args) => this._onTrailingSwipe(...args)}
          onWillDisplayCell={(...args) => this._onWillDisplayCell(...args)}
          onEndDisplayingCell={(...args) => this._onEndDisplayingCell(...args)}
          onItemNotification={(...args) => this._onItemNotification(...args)}
          onScrollViewDidEndDecelerating={(...args) => this._onScrollViewDidEndDecelerating(...args)}
          onCollectionViewDidSelectItem={(...args) => this._onCollectionViewDidSelectItem(...args)}
          onMoreAccessoryPress={(...args) => this._onMoreAccessoryPress(...args)}
        >
          {this.state.children}
        </RNTableView>
    )
  }
}

export default TableView
