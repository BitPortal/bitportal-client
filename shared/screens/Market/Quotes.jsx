import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from 'resources/colors';
import styles from './styles';

export const Quotes = ({ quoteList, quote, onPress }) => (
  <View style={styles.quoteContainer}>
    {quoteList.map(item => (
      <TouchableOpacity
        key={item}
        onPress={() => {
          onPress(item);
        }}
        style={[
          styles.center,
          {
            flex: 1,
            borderBottomColor: Colors.borderColor_89_185_226,
            borderBottomWidth: quote === item ? StyleSheet.hairlineWidth * 6 : 0
          }
        ]}
      >
        <Text style={[styles.text16, { color: Colors.textColor_255_255_238 }]}>
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);
