/* @tsx */

import React from 'react'
import RNDialog from 'react-native-dialog'

const DialogAndroid = ({ isVisible, onChange, tilte, content, positiveText, negativeText, handleCancel, handleConfirm, disableSecureText }) => (
  <RNDialog.Container visible={isVisible}>
    <RNDialog.Title>{tilte}</RNDialog.Title>
    <RNDialog.Description>
      {content}
    </RNDialog.Description>
    <RNDialog.Input autoFocus={true} secureTextEntry={!disableSecureText} onChangeText={onChange} />
    <RNDialog.Button label={negativeText} onPress={handleCancel} />
    <RNDialog.Button label={positiveText} onPress={handleConfirm} />
  </RNDialog.Container>
)

export default DialogAndroid
