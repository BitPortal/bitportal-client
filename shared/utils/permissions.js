import Permissions from 'react-native-permissions'
import Dialog from 'components/Dialog'

const checkCameraAuthorized = response => response === 'authorized'

const checkCamera = () => new Promise((resolve) => {
  Permissions.check('camera').then((response) => {
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    if (checkCameraAuthorized(response)) {
      resolve(checkCameraAuthorized(response))
    }
    if (response === 'undetermined') {
      Permissions.request('camera').then((response) => {
        // Returns once the user has chosen to 'allow' or to 'not allow' access
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        resolve(checkCameraAuthorized(response))
      })
    } else if (response === 'denied') {
      Dialog.alert('请前往设置开启摄像权限！')
      resolve(false)
    }
  })
})

const checkPhoto = () => new Promise((resolve) => {
  Permissions.check('photo').then((response) => {
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    if (checkCameraAuthorized(response)) {
      resolve(checkCameraAuthorized(response))
    }
    if (response === 'undetermined') {
      Permissions.request('photo').then((response) => {
        // Returns once the user has chosen to 'allow' or to 'not allow' access
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        resolve(checkCameraAuthorized(response))
      })
    } else if (response === 'denied') {
      Dialog.alert('请前往设置开启访问相册权限！')
      resolve(false)
    }
  })
})

export {
  checkCamera,
  checkPhoto
}
