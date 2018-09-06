import Permissions from 'react-native-permissions'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'

const checkCameraAuthorized = response => response === 'authorized'

const checkCamera = locale => new Promise((resolve) => {
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
      Dialog.permissionAlert(
        messages[locale].scan_popup_label_camera_disabled,
        messages[locale].scan_popup_text_camera_disabled,
        locale
      )
      resolve(false)
    }
  })
})

const checkPhoto = locale => new Promise((resolve) => {
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
      Dialog.permissionAlert(
        messages[locale].scan_popup_label_album_disabled,
        messages[locale].scan_popup_text_album_disabled,
        locale
      )
      resolve(false)
    }
  })
})

export {
  checkCamera,
  checkPhoto
}
