
import React from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import styles from './styles'

export default ({ Title, enableAssets }) => (
  <TouchableHighlight underlayColor={Colors.hoverColor} style={styles.addAssetsContainer} onPress={() => enableAssets()}>
    <View style={[styles.addAssetsContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.minorThemeColor }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text14}> { Title } </Text>
      </View>
      {/* <Ionicons name="ios-add-circle-outline" size={25} color={Colors.textColor_89_185_226} /> */}
    </View>
  </TouchableHighlight>
)
