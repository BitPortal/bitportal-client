/* @tsx */
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Colors from 'resources/colors'
import RNDialog from "react-native-dialog"

export default Dialog = ({ isVisible, onChange, tilte, content, handleCancel, handleConfirm }) => (
  <RNDialog.Container visible={isVisible}>
    <RNDialog.Title>{tilte}</RNDialog.Title>
    <RNDialog.Description>
      {content}
    </RNDialog.Description>
    <RNDialog.Input autoFocus={true} secureTextEntry={true} onChangeText={onChange} />
    <RNDialog.Button label="Cancel" onPress={handleCancel} />
    <RNDialog.Button label="OK" onPress={handleConfirm} />
  </RNDialog.Container>
)
