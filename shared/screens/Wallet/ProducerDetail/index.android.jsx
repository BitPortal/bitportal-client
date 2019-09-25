import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated, SectionList, Image } from 'react-native'
import { Navigation } from 'components/Navigation'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import styles from './styles'

export default class ProducerDetail extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: '节点详情'
        },
        backButton: {
          title: '返回'
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2, height: 48 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{item.text}</Text>
          </View>
          <View style={{ position: 'absolute', right: 16 }}>
            {item.type === 'avatar' && <Image source={require('resources/images/profile_placeholder_android.png')} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.12)' }} />}
            {item.type !== 'avatar' && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', maxWidth: 300, textAlign: 'right' }}>{item.detail}</Text>}
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { owner, info, producer_key } = this.props
    const title = info && info.title
    const location = info && info.org && info.org.location

    const items = []
    items.push({
      text: 'Logo',
      type: 'avatar',
      key: 'avatar',
      logo: info && info.org && info.org.branding && info.org.branding.logo
    })

    if (title) {
      items.push({
        text: '节点名称',
        type: 'title',
        key: 'title',
        detail: title
      })
    }

    items.push({
      text: '合约帐号',
      key: 'owner',
      type: 'owner',
      detail: owner
    })

    if (location) {
      items.push({
        text: '节点位置',
        key: 'location',
        type: 'location',
        detail: location
      })
    }

    items.push({
      text: '节点公钥',
      type: 'identifier',
      key: 'identifier',
      detail: producer_key
    })

    const sections = []
    sections.push({ data: items })
    sections[0].isFirst = true

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SectionList
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          sections={sections}
          keyExtractor={(item, index) => item.key}
        />
      </View>
    )
  }
}
