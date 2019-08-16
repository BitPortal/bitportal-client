import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import Modal from 'react-native-modal'

const IndicatorModal = ({ isVisible, message, onModalHide, onModalShow }) => (
  <Modal
    isVisible={isVisible}
    backdropOpacity={0.6}
    useNativeDriver
    animationIn="fadeIn"
    animationInTiming={200}
    backdropTransitionInTiming={200}
    animationOut="fadeOut"
    animationOutTiming={200}
    backdropTransitionOutTiming={200}
    onModalHide={onModalHide}
    onModalShow={onModalShow}
  >
    {isVisible && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 4, alignItem: 'center', justifyContent: 'center', flexDirection: 'row', elevation: 4 }}>
        <ActivityIndicator size="small" color="#673AB7" />
        {message && <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: 'bold', color: 'black' }}>{message}</Text>}
      </View>
    </View>}
  </Modal>
)

export default IndicatorModal
