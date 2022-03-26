# BitPortal Client

BitPortal's React Native client for iOS, Android. More clients support are under development: web, windows, macOS and browser extension.

## About BitPortal

BitPortal is a mobile multi-chain crypto wallet based on Bip32 Identity. It supports BTC, ETH, EOS and ChainX V1 (Substrate v1 based).

For ETH, it also provided support for ERC20 and dApp Browser. dApp Browser performances like a metamask wallet when access to a web pages.

(Right now ChainX v1 has been upgraded to newer version.)

## Get repo
```sh
$ git clone https://github.com/BitPortal/bitportal-client.git
```

## Install
```sh
$ yarn install
```

## Run Website
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

## Run Mobile
```sh
# build and run ios
$ yarn run ios

# build and run android
$ yarn run android
```

## Run Desktop
```sh
# build desktop, it's served in ./static/desktop folder
$ yarn run build:desktop

# run desktop after build
$ yarn run desktop
```

## Run Test
```sh
$ yarn test
```

## Run Lint
```sh
# javascript lint
$ yarn run lint:js

# typescript lint
$ yarn run lint:ts

# javascript and typescript lint
$ yarn run lint
```

## Typescript Compile
```sh
yarn run tsc
```
