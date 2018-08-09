import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableHighlight,
  Animated
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

class AccordionPanel extends Component {
  state = {
    expanded: true,
    animation: new Animated.Value(),
    maxHeight: '',
    minHeight: ''
  }

  toggle = () => {
    const initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight
    const finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight

    this.setState(prevState => ({ expanded: !prevState.expanded }))

    this.state.animation.setValue(initialValue)
    Animated.spring(
      this.state.animation,
      {
        toValue: finalValue
      }
    ).start()
  }

  _setMaxHeight = (event) => {
    if (this.state.maxHeight === '') {
      this.setState({
        maxHeight: event.nativeEvent.layout.height
      })
    }
  }

  _setMinHeight = (event) => {
    if (this.state.minHeight === '') {
      this.setState({
        minHeight: event.nativeEvent.layout.height
      })
    }
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
