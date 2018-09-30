import React, { Component } from 'react'
import {
  TouchableOpacity,
  Animated,
  View,
  Text
} from 'react-native' //Step 1
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

export default class AccordionPanel extends Component {
  state = {
    expanded: true,
  }

  toggle = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }))
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
            flex: 1
          }
        ]}
      >
        <View
          style={[
            styles.spaceBetween,
            { paddingVertical: 10, paddingHorizontal: 25 }
          ]}
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
          >
            {this.props.children}
          </View>
        )}
      </Animated.View>
    )
  }
}
