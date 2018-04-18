/* @tsx */
import React, { Component, Children } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'
import SearchItem from 'screens/Search/SearchItem'
import NavigationBar, { LeftButton, CommonButton } from 'components/NavigationBar'
import { Text, View, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'

@connect(
  (state) => ({
    market: state.drawer.get('selectedMarket')
  })
)

export default class Search extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true
  }

  state ={ 
    coinName: ''
  }

  openDrawer = () => {
    this.props.navigator.dismissModal({ animationType: 'fade' })
    this.props.navigator.toggleDrawer({ side: 'left', animated: true, to: 'open' })
  } 

  dismissModal = () => {
    this.props.navigator.pop({ animationType: 'fade' })
  }

  onChangeText = (text) => {
    this.setState({ coinName: text })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={
            <LeftButton iconName="md-menu" title={this.props.market} onPress={() => this.openDrawer()} />
          }
          rightButton={
            <CommonButton 
              onPress={() => this.dismissModal()} 
              Children={
                <Text style={[styles.text14]}> Cancel</Text>
              }
            />
          }
        />

        <SearchItem 
          coinName={this.state.coinName} 
          onChangeText={(text) => this.onChangeText(text)} 
        />

      </View>
    )
  }

}
