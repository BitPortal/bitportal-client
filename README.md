# BitPortal Client

BitPortal's React Native client for iOS, Android. More clients support are under development: web, windows, macOS and browser extension.

## About BitPortal

BitPortal is a mobile multi-chain crypto wallet based on Bip32 Identity. It supports BTC, ETH, EOS and ChainX V1 (Substrate v1 based).

For ETH, it also provided support for ERC20 and dApp Browser. dApp Browser performances like a metamask wallet when access to a web pages.

(Right now ChainX v1 has been upgraded to newer version.)

## get repo
```sh
$ git clone https://github.com/BitPortal/bitportal-client.git
```

## install
```sh
$ yarn install
```

## run website
```sh
$ npm install -g full-icu

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
