import 'react-native-navigation'

declare module 'react-native-navigation' {
  export namespace Navigation {
    function handleDeepLink(params?: { link: string; payload?: { method?: string, params?: Object }; }): void;
  }
}
