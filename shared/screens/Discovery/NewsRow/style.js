import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 14,
    backgroundColor: Colors.bgColor_48_49_59
  },
  image: {
    height: 44,
    width: 44,
    borderRadius: 4,
  },
  right: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: Colors.textColor_FFFFEE,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    color: Colors.textColor_149_149_149,
    fontSize: 13,
    marginBottom: 10,
  },
  infoArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default styles
