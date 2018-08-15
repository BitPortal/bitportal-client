import Toast from 'react-native-root-toast'

export default (msg, duration, position=Toast.positions.CENTER, color, options = {
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  position,
  visible: true
}) => Toast.show(msg, { duration: duration, backgroundColor: color || '#000', ...options })

