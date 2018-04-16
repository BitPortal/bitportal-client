/* @tsx */
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, TouchableOpacity } from 'react-native'
import NavigationBar from 'components/NavigationBar'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'
import SearchItem from 'screens/Search/SearchItem'

@connect(
  (state) => ({
    market: state.drawer.get('selectedMarket')
  })
)

export default class Search extends Component {

  state ={ 
    coinName: ''
  }

  openDrawer = () => {
    this.props.navigator.dismissModal({ animationType: 'fade' })
    this.props.navigator.toggleDrawer({ side: 'left', animated: true, to: 'open' })
  } 

  onChangeText = (text) => {
    this.setState({ coinName: text })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={(
            <TouchableOpacity
              onPress={() => this.openDrawer()}
              style={styles.navButton}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="md-menu" size={22} color={Colors.bgColor_FFFFFF} />
                <Text style={[styles.text20, {marginLeft: 10}]}>
                  {this.props.market}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          rightButton={(
            <TouchableOpacity
              onPress={() => { this.props.navigator.dismissModal({ animationType: 'fade' }) }}
              style={styles.navButton}
            >
              <Text style={[styles.text14]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        />

        <SearchItem 
          coinName={this.state.coinName} 
          onChangeText={(text) => this.onChangeText(text)} 
        />

      </View>
    )
  }

}
