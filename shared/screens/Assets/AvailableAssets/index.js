/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'

const AssetElement = ({ item, onValueChange }) => (
  <View style={[styles.listContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.bgColor_48_49_59 }]}>
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.text20}> { item.assetName } </Text>
    </View>
    <Switch value={item.value} onValueChange={(e) => onValueChange(e, item)} />
  </View>
)

export default class AvailableAssets extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    assetsList: [
      { assetName: 'EOS', value: true },
      { assetName: 'UIP', value: false }, 
      { assetName: 'OCT', value: false }, 
      { assetName: 'PRA', value: false }, 
      { assetName: 'DEW', value: false },
      { assetName: 'EOS', value: true },
      { assetName: 'UIP', value: false }, 
      { assetName: 'OCT', value: false }
    ]
  }

  // 激活或隐藏钱包
  onValueChange = (value, item) => {
    item.value = value
    this.setState({ assetsList: this.state.assetsList })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()}/>}
          title={"Assets List"}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              this.state.assetsList.map((item, index) => (
                <AssetElement key={index} item={item} onValueChange={(e, item) => this.onValueChange(e, item)} />
              ))
            }
          </ScrollView>  
        </View>
      </View>
    )
  }

}
