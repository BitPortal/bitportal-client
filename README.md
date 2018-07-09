# BitPortal Client

BitPortal client for web, ios, android, windows and macOS

## teck stack
- [x] [React](https://facebook.github.io/react/)
- [x] [React Native](https://facebook.github.io/react-native/)
- [x] [Typescript](https://www.typescriptlang.org/)
- [x] [Redux](https://github.com/reactjs/redux)
- [x] [Immutable](http://facebook.github.io/immutable-js)
- [x] [React Router 4](https://reacttraining.com/react-router/)
- [x] [Redux Native Navigation](https://wix.github.io/react-native-navigation/v2)
- [x] [React Intl](https://github.com/yahoo/react-intl)
- [x] [Redux Actions](https://github.com/acdlite/redux-actions)
- [x] [Redux Saga](https://github.com/yelouafi/redux-saga)
- [x] [Redux Form](http://redux-form.com)
- [x] [Reselect](https://github.com/reactjs/reselect)
- [x] [PostCSS](https://github.com/postcss/postcss)
- [x] [CSS modules](https://github.com/outpunk/postcss-modules)
- [x] [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [x] [React Testing Library](https://github.com/kentcdodds/react-testing-library)
- [x] [Webpack 4](https://webpack.js.org)
- [x] [Babel](https://babeljs.io/)
- [x] [Express](https://github.com/expressjs/express)
- [x] [Electron](https://github.com/electron/electron)

## get repo
```sh
$ git clone https://github.com/BitPortal/bitportal-client.git
$ git submodule update --init --recursive
```

## install
```sh
$ npm install -g full-icu
$ yarn install
```

## setup website
```sh
# run website (http://dev.bitportal.io:3009)
$ yarn start

# build website for production (it's served in ./static folder)
$ yarn run build

# build website for staging
$ yarn run build:staging

# run website with client rendering after build
$ yarn run client

# run website with server rendering after build
$ yarn run server

# run website test
$ yarn test
```

## setup mobile
```sh
# build and run ios
$ yarn run ios

# build and run android
$ yarn run android

# run mobile after build
$ yarn run mobile
```

## setup desktop
```sh
# build desktop, it's served in ./bundle folder
$ yarn run bundle:desktop

# run desktop after build
$ yarn run desktop
```

## typescript compile
```sh
yarn run tsc
```
