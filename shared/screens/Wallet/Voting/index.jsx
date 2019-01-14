import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Dimensions, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import FastImage from 'react-native-fast-image'
import { producerListSelector } from 'selectors/producer'
import * as producerActions from 'actions/producer'
import * as votingActions from 'actions/voting'
import styles from './styles'

@connect(
  state => ({
    producerList: producerListSelector(state),
    selectedProducerList: state.producer.get('selected')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...producerActions,
      ...votingActions
    }, dispatch)
  })
)

export default class Voting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '节点投票'
        },
        subtitle: {
          text: '0 / 30 已选'
        },
        drawBehind: false,
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        largeTitle: {
          visible: false
        },
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ],
        rightButtons: [
          {
            id: 'vote',
            text: '投票'
          }
        ]
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedProducerList.count() !== prevState.selected) {
      return { selected: nextProps.selectedProducerList.count() }
    } else {
      return null
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { selected: 0 }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  searchBarUpdated() {
    // this.setState({ searching: isFocused })
  }

  onRefresh = () => {
    this.props.actions.getEOSAssetRequested()
  }

  onPress = (data) => {
    const name = data.owner
    this.props.actions.toggleSelect(name)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProducerList && prevProps.selectedProducerList.count() !== this.props.selectedProducerList.count()) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          subtitle: {
            text: `${this.props.selectedProducerList.count()} / 30 已选`
          }
        }
      })

      if (prevProps.selectedProducerList.count() < this.props.selectedProducerList.count() && this.props.selectedProducerList.count() > 4) {
        this.scrollView.scrollTo({ x: (Dimensions.get('window').width / 4) * this.props.selectedProducerList.count() - Dimensions.get('window').width, animated: true })
      }
    }

    LayoutAnimation.easeInEaseOut()
  }

  componentDidAppear() {

  }

  componentDidMount() {
    this.props.actions.getProducersWithInfoRequested({ json: true, limit: 500 })
  }

  render() {
    const { producerList, selectedProducerList } = this.props
    console.log(selectedProducerList)

    return (
      <View style={styles.container}>
        <View style={[styles.selected, { marginTop: Navigation.constants().topBarHeight, height: selectedProducerList.count() ? 80 : 0 }]}>
          <ScrollView
            style={{ height: selectedProducerList.count() ? 80 : 0 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={(ref) => { this.scrollView = ref; return null }}
          >
            {selectedProducerList.map(item => <View key={item} style={{ height: 66, width: Dimensions.get('window').width / 4, backgroundColor: 'white', marginTop: 7, flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
              <FastImage
                  source={require('resources/images/producer.png')}
                  style={{ width: 40, height: 40 }}
              />
              <Text style={{ color: 'black', fontSize: 11 }}>{item}</Text>
            </View>
            )}
          </ScrollView>
        </View>
        <TableView
          style={styles.tableView}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          detailTextColor="#666666"
          canRefresh
          showsVerticalScrollIndicator={false}
          cellSeparatorInset={{ left: 46 }}
          reactModuleForCell="ProducerTableViewCell"
          headerBackgroundColor="#F7F7F7"
        >
          <TableView.Section label="当前出块节点">
            {producerList.map(item => (
              <TableView.Item
                 key={item.get('owner')}
                 height={60}
                 selectionStyle={TableView.Consts.CellSelectionStyle.None}
                 logo={item.getIn(['info', 'org', 'branding', 'logo'])}
                 owner={item.get('owner')}
                 isSelected={item.get('selected')}
                 teamName={item.getIn(['info', 'org', 'name'])}
                 max_supply={item.get('max_supply')}
                 rank_url={item.get('rank_url')}
                 onPress={this.onPress}
                 accessoryType={TableView.Consts.AccessoryType.DetailButton}
              />
            ))}
          </TableView.Section>
        </TableView>
      </View>
    )
  }
}
