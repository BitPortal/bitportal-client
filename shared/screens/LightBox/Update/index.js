import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from './styles'

const NegativeBtn = ({ negativeText, onNegative }) => (
  <TouchableOpacity onPress={onNegative} style={[styles.btn, styles.center]}>
    <Text style={[styles.text16, styles.negativeText]}>{negativeText}</Text>
  </TouchableOpacity>
)

const PositiveBtn = ({ positiveText, onPositive }) => (
  <TouchableOpacity onPress={onPositive} style={[styles.btn, styles.center]}>
    <Text style={[styles.text16, styles.positiveText]}>{positiveText}</Text>
  </TouchableOpacity>
)

const Update = ({ title, content, negativeText, positiveText, onNegative, onPositive }) => (
  <View style={[styles.container, styles.center]}>
    <View style={[styles.content, styles.between]}>
      <View style={[styles.titleContainer, styles.center]}>
        <Text style={styles.text18}>{title}</Text>
      </View>
      <View style={styles.description}>
        <Text style={styles.text16}>{content}</Text>
      </View>
      <View style={styles.btnContainer}>
        {negativeText && <NegativeBtn negativeText={negativeText} onNegative={onNegative} />}
        {(negativeText && positiveText) && <View style={styles.line} /> }
        {positiveText && <PositiveBtn positiveText={positiveText} onPositive={onPositive} />}
      </View>
    </View>
  </View>
)

export default Update
