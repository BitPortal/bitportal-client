import { StyleSheet, Dimensions } from 'react-native'
const window = Dimensions.get('window')

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: window.width - 30,
    marginHorizontal: 15,
    overflow: 'visible',
  },
  card: {
    width: window.width - 40,
    marginHorizontal: 5,
  }
})
