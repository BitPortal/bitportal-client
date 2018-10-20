import React from 'react'
import { View, Text, TextInput } from 'react-native'
import Colors from 'resources/colors'
import styles from './styles'

export default ({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ backgroundColor: Colors.mainThemeColor }}>
      <TextInput
        editable={false}
        multiline={true}
        numberOfLines={4}
        style={styles.areaInput}
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor={Colors.textColor_107_107_107}
        underlineColorAndroid="transparent"
        selectionColor={Colors.textColor_181_181_181}
        keyboardAppearance={Colors.keyboardTheme}
        value={value}
      />
    </View>
  </View>
)
