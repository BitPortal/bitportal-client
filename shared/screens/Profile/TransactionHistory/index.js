/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import ListItem from './ListItem'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight, SectionList } from 'react-native'

export default class TransationHistory extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    sections: [
      {timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]},
      {timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }]}
    ]
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title={'Transation History'}
        />
        <View style={styles.scrollContainer}>
          <SectionList
            renderItem={({item, index, section}) => <ListItem key={index} item={item} onPress={() => {}} />}
            renderSectionHeader={({ section: { timeStamp } }) => (
              <View style={styles.sectionHeader}>
                <Text style={[styles.text12, { marginLeft: 30 }]}>
                  { timeStamp }
                </Text>
              </View>
            )}
            sections={this.state.sections}
            keyExtractor={(item, index) => item + index}
          />        
        </View>
      </View>
    )
  }

}
