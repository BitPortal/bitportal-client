
import React, { Component } from 'react'
import styles from './styles'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale } from 'utils/dimens'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

export default AlertList = ({ isEdited, dataArr, changeMode, deleteAlert }) => (
  <View style={{ paddingHorizontal: 15, marginTop: 25 }}>
    <View style={[styles.listHeader, styles.betweenStyle]}>
      <Text style={styles.text16}> Details </Text>
      <TouchableOpacity onPress={() => changeMode()}  style={{ alignItems: 'center', padding: 15 }} >
        <Text style={[styles.text14, { color: Colors.textColor_93_207_242 }]}> {isEdited ? "Cancel" : "Edit"} </Text>
      </TouchableOpacity>
    </View>
    {dataArr.map((item, index) => (
      <View key={index} style={[styles.listItemContainer, styles.betweenStyle]}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            {isEdited && 
              <TouchableOpacity onPress={() => deleteAlert()} style={{ marginRight: 15 }}>
                <Ionicons name="md-remove-circle" size={22} color={Colors.textColor_255_76_118} />
              </TouchableOpacity> 
            }
          </View>
          <Text style={[styles.text16, { color: Colors.textColor_255_255_238 }]}> Alert{index+1} </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            {item.high   && <Text style={[styles.text16, { textAlign: 'right', color: Colors.textColor_255_255_238 }]}> High: {item.high} </Text>}
            {item.low    && <Text style={[styles.text16, { textAlign: 'right', color: Colors.textColor_255_255_238 }]}> Low: {item.low} </Text>}
            {item.change && <Text style={[styles.text16, { textAlign: 'right', color: Colors.textColor_255_255_238 }]}> Change: {item.change} </Text>}
          </View>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <Ionicons name="md-create" size={22} color={Colors.textColor_93_207_242} />
          </TouchableOpacity>
        </View>
      </View>
     )) 
    }
  </View>
)
