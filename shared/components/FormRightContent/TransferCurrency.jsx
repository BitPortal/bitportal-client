
/* eslint-disable */

import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import CurrencyText from 'components/CurrencyText'

const styles =  StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    marginRight: -25,
  }
})

export default ({ quantity }) => (
  <Text style={[styles.text14, { color: Colors.textColor_white_4 }]}>
    ≈ {' '}
    {
      quantity ? 
      <CurrencyText 
        value={quantity}    
        maximumFractionDigits={2}
        minimumFractionDigits={2} 
      />
      :
      <CurrencyText 
        value={0}    
        maximumFractionDigits={2}
        minimumFractionDigits={2} 
      />
    }
    
  </Text>
)

