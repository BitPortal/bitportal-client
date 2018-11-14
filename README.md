# BitPortal Client

BitPortal client for web, ios, android, windows, macOS and browser extension

## teck stack
- [x] [React](https://facebook.github.io/react/)
- [x] [React Native](https://facebook.github.io/react-native/)
- [x] [Typescript](https://www.typescriptlang.org/)
- [x] [Redux](https://github.com/reactjs/redux)
- [x] [Immutable](http://facebook.github.io/immutable-js)
- [x] [React Router](https://reacttraining.com/react-router/)
- [x] [Redux Native Navigation](https://github.com/wix/react-native-navigation)
- [x] [React Intl](https://github.com/yahoo/react-intl)
- [x] [Redux Actions](https://github.com/acdlite/redux-actions)
- [x] [Redux Saga](https://github.com/yelouafi/redux-saga)
- [x] [Redux Form](http://redux-form.com)
- [x] [Reselect](https://github.com/reactjs/reselect)
- [x] [PostCSS](https://github.com/postcss/postcss)
- [x] [CSS modules](https://github.com/outpunk/postcss-modules)
- [x] [Enzyme](https://github.com/airbnb/enzyme)
- [x] [Webpack](https://webpack.js.org)
- [x] [Babel](https://babeljs.io/)
- [x] [Express](https://github.com/expressjs/express)
- [x] [Electron](https://github.com/electron/electron)

## get repo
```sh
$ git clone https://github.com/BitPortal/bitportal-client.git
```

## install mobile 
```sh
$ npm install -g full-icu
$ npm/yarn install
```
## IOS 
open Xcode and select 'Copy only when installing' in ReactNativeNavigation (see below)
![readme](https://cdn.bitportal.io/github/readme_1.jpg)


## run website
```sh
# run website in dev (http://dev.bitportal.io:3009)
$ yarn run web

# build website for production (it's served in ./static/web folder)
$ yarn run build:web

# run website with client rendering after build
$ yarn run browser

# run website with server rendering after build
$ yarn run server

```

## run mobile
```sh
# build and run ios
$ yarn run ios

# build and run android
$ yarn run android
```

## run desktop
```sh
# build desktop, it's served in ./static/desktop folder
$ yarn run build:desktop

# run desktop after build
$ yarn run desktop
```

## run test
```sh
$ yarn test
```

## run lint
```sh
# javascript lint
$ yarn run lint:js

# typescript lint
$ yarn run lint:ts

# javascript and typescript lint
$ yarn run lint
```

## typescript compile
```sh
yarn run tsc
```
