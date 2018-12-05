import React, { Component } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils/dimens'
import { TabView, TabBar } from 'react-native-tab-view'
import messages from 'resources/messages'
import DappElement from '../DappElement'
import DappGroupScene from './DappGroupScene'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.dApp.get('loading'),
    dAppList: parsedDappListSelector(state),
    eosAccountName: eosAccountNameSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...dAppActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class DappGrouping extends Component {
  state = {
    /*eslint-disable*/
    index: 0,
    routes: [{ key: 'first', title: '' }, { key: 'second', title: '' }, { key: 'third', title: '' }]
  }

  componentDidMount() {
    const length = this.props.items.size
    if (length <= 3) this.setState({ routes: [{ key: 'first', title: '' }] })
    if (length > 3 && length <= 6)
      this.setState({ routes: [{ key: 'first', title: '' }, { key: 'second', title: '' }] })
  }

  renderScene = ({ route }) => {
    const { items, componentId } = this.props
    const pageOneContent = items.slice(0, 3)
    const pageTwoContent = items.slice(3, 6)
    const pageThreeContent = items.slice(6, 9)

    switch (route.key) {
      case 'first':
        return <DappGroupScene items={pageOneContent} componentId={componentId} pageStyle={'first'} />
      case 'second':
        return <DappGroupScene items={pageTwoContent} componentId={componentId} pageStyle={'middle'} />
      case 'third':
        return <DappGroupScene items={pageThreeContent} componentId={componentId} pageStyle={'end'} />
      default:
        return null
    }
  }

  render() {
    return (
      <View style={styles.sceneContainer}>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={index => {
            /*eslint-disable*/
            this.setState({ index })
          }}
          initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          renderTabBar={() => {}}
        />
      </View>
    )
  }
}
