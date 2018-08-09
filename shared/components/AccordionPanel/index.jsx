import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated
} from 'react-native' //Step 1
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

class AccordionPanel extends Component {
  state = {
    //Step 3
    expanded: true,
    animation: new Animated.Value(),
    maxHeight: '',
    minHeight: ''
  }

  toggle = () => {
    //Step 1
    let initialValue = this.state.expanded
        ? this.state.maxHeight + this.state.minHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight + this.state.minHeight

    this.setState({
      expanded: !this.state.expanded //Step 2
    })

    this.state.animation.setValue(initialValue) //Step 3
    Animated.spring(
      //Step 4
      this.state.animation,
      {
        toValue: finalValue
      }
    ).start() //Step 5
  }

  _setMaxHeight = (event) => {
    console.log('nativeEvent MAXheight', event.nativeEvent.layout.height)
    if (this.state.maxHeight === '') {
      this.setState({
        maxHeight: event.nativeEvent.layout.height
      })
    }
  }

  _setMinHeight = (event) => {
    // console.log('nativeEvent MINheight', event.nativeEvent.layout.height);
    if (this.state.minHeight === '') {
      this.setState({
        minHeight: event.nativeEvent.layout.height
      })
    }
  }

  render() {
    const { expanded } = this.state
    const { title } = this.props

    //Step 5
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            backgroundColor: Colors.bgColor_41_41_44,
            marginTop: 10,
            paddingBottom: 40,
            height: this.state.animation,
            flex: 1
          }
        ]}
      >
        <View
          style={[
            styles.spaceBetween,
            { paddingVertical: 20, paddingHorizontal: 25 }
          ]}
          onLayout={(event) => {
            this._setMinHeight(event)
          }}
        >
          <Text style={[styles.headerText]}> {title} </Text>
          <TouchableHighlight
            onPress={() => {
              this.toggle()
            }}
            underlayColor="#f1f1f1"
          >
            {expanded ? (
              <Ionicons
                name="ios-arrow-up"
                size={30}
                color={Colors.bgColor_FFFFFF}
              />
            ) : (
              <Ionicons
                name="ios-arrow-down"
                size={30}
                color={Colors.bgColor_FFFFFF}
              />
            )}
          </TouchableHighlight>
        </View>
        <View
          style={{ paddingBottom: 20 }}
          onLayout={(event) => {
            this._setMaxHeight(event)
          }}
        >
          {this.props.children}
        </View>
      </Animated.View>
    )
  }
}

export default AccordionPanel
