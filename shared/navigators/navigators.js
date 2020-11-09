import { Navigation as Nav, LayoutComponent, Options } from 'components/Navigation'
import options from 'react-native-actionsheet/lib/options';
import { Platform } from 'react-native';

const androidDefaultLeftButtons = {}
const iosDefaultLeftButtons = {}

const defaultLeftButtons = Platform.select({
  ios: iosDefaultLeftButtons,
  android: androidDefaultLeftButtons
});

// Nav.prototype.getComponent = function () {
//   console.warn(this.store);
//   // this.store.getPropsForId('');
// }

export default class Navigators {

  static _show = (showFunc = Nav.push, componentId, componentName, { passProps, title, showLeft, options = {} }, otherOptions = {}) => {

    let component = {
      name: componentName,
      passProps,
      ...options
    };
    if (title) {
      options.topBar.title.text = title;
    }
    if (showLeft) {
      options.topBar.leftButtons = defaultLeftButtons;
    }
    const layoutOptions = { ...component, ...otherOptions };
    showFunc(componentId, layoutOptions);
  }

  static push = (componentId, componentName, { passProps, title, showLeft, options = {} }, otherOptions = {}) => {
    Navigators._show(Nav.push, componentId, componentName, {
      passProps,
      title,
      showLeft,
      options
    }, otherOptions = {});
  }

  static pop = Nav.pop;
  static popTo = Nav.popTo;
  static popToRoot = Nav.popToRoot;

  static showModal = (componentId, componentName, { passProps, title, showLeft, options = {} }, otherOptions = {}) => {
    Navigators._show(Nav.showModal, componentId, componentName, {
      passProps,
      title,
      showLeft,
      options
    }, otherOptions = {});
  }

  static dissmissModal = Nav.dismissModal;
  static dismissAllModals = Nav.dismissAllModals;

  // static navigate = (component) => {
  //   console.log('Nav:',Nav.store.propsById.keys,Nav.store.propsById.values);
  //   console.log('Nav Array:',Array.from(Nav.store.propsById));
  //
  //   // Nav.popTo();
  //   console.log('Nav: popTo:',Nav);
  // }
}
