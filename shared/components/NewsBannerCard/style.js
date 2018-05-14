import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'

export const styles = StyleSheet.create({
  card: {
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: Colors.textColor_FFFFEE,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    color: Colors.textColor_149_149_149
  },
  background: {
    position: 'absolute',
    height: 140,
    width: '100%',
    top: 0,
    left: 0,
  }
})
