import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated
} from 'react-native'; //Step 1
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from 'resources/colors';
import styles from './styles';

class AccordionPanel extends Component {
  constructor(props) {
    super(props);

    // this.icons = {
    //   //Step 2
    //   up: require('./images/Arrowhead-01-128.png'),
    //   down: require('./images/Arrowhead-Down-01-128.png')
    // };

    this.state = {
      //Step 3
      expanded: true,
      animation: new Animated.Value(),
      maxHeight: '',
      minHeight: ''
    };
    this._setMaxHeight = this._setMaxHeight.bind(this);
    this._setMinHeight = this._setMinHeight.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    //Step 1
    let initialValue = this.state.expanded
        ? this.state.maxHeight + this.state.minHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight + this.state.minHeight;

    this.setState({
      expanded: !this.state.expanded //Step 2
    });

    this.state.animation.setValue(initialValue); //Step 3
    Animated.spring(
      //Step 4
      this.state.animation,
      {
        toValue: finalValue
      }
    ).start(); //Step 5
  }

  _setMaxHeight(event) {
    console.log('nativeEvent MAXheight', event.nativeEvent.layout.height);
    if (this.state.maxHeight === '') {
      this.setState({
        maxHeight: event.nativeEvent.layout.height
      });
    }
  }

  _setMinHeight(event) {
    console.log('nativeEvent MINheight', event.nativeEvent.layout.height);
    if (this.state.minHeight === '') {
      this.setState({
        minHeight: event.nativeEvent.layout.height
      });
    }
  }

  render() {
    const { expanded } = this.state;
    const { title } = this.props;

    //Step 5
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            backgroundColor: Colors.bgColor_41_41_44,
            marginTop: 10,
            paddingBottom: 20,
            height: this.state.animation
          }
        ]}
      >
        <View
          style={[
            styles.spaceBetween,
            { paddingVertical: 20, paddingHorizontal: 25 }
          ]}
          onLayout={this._setMinHeight}
        >
          <Text style={[styles.headerText]}> {title} </Text>
          <TouchableHighlight onPress={this.toggle} underlayColor="#f1f1f1">
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
        <View style={{}} onLayout={this._setMaxHeight}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}

export default AccordionPanel;
