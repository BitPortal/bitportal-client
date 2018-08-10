import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableHighlight,
  Animated
} from 'react-native'
  Image,
  TouchableOpacity,
  Animated,
  LayoutAnimation
} from 'react-native' //Step 1
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

export default class AccordionPanel extends Component {
  state = {
    expanded: true,
    animation: new Animated.Value(),
    maxHeight: '',
    minHeight: ''
  }

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  toggle = () => {

    //Step 1
    // let initialValue = this.state.expanded
    //     ? this.state.maxHeight + this.state.minHeight
    //     : this.state.minHeight,
    //   finalValue = this.state.expanded
    //     ? this.state.minHeight
    //     : this.state.maxHeight + this.state.minHeight

    this.setState(prevState => ({ expanded: !prevState.expanded }))


    // this.state.animation.setValue(initialValue) //Step 3
    // Animated.spring(
    //   //Step 4
    //   this.state.animation,
    //   {
    //     toValue: finalValue
    //   }
    // ).start() //Step 5
  }

  _setMaxHeight = (event) => {
    // if (this.state.maxHeight === '') {
    //   this.setState({
    //     maxHeight: event.nativeEvent.layout.height
    //   })
    // }
  }

  _setMinHeight = (event) => {
    // if (this.state.minHeight === '') {
    //   this.setState({
    //     minHeight: event.nativeEvent.layout.height
    //   })
    // }
  }

  render() {
    const { expanded } = this.state
    const { title } = this.props

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            backgroundColor: Colors.bgColor_41_41_44,
            marginTop: 10,
            // paddingBottom: 40,
            // height: this.state.animation,
            flex: 1
          }
        ]}
      >
        <View
          style={[
            styles.spaceBetween,
            { paddingVertical: 10, paddingHorizontal: 25 }
          ]}
          onLayout={(event) => {
            this._setMinHeight(event)
          }}
        >
          <Text style={[styles.headerText]}> {title} </Text>
          <TouchableOpacity
            onPress={() => {
              this.toggle()
            }}
            underlayColor="#f1f1f1"
          >
            <View
              style={{
                height: 50,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center'
              }}
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
            </View>
          </TouchableOpacity>
        </View>
        {this.state.expanded && (
          <View
            style={{ paddingBottom: 20 }}
            onLayout={(event) => {
              this._setMaxHeight(event)
            }}
          >
            {this.props.children}
          </View>
        )}
      </Animated.View>
    )
  }
}
