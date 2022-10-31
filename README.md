# BitPortal Client

*NOT IN MAINTAINCE*

BitPortal's React Native client for iOS, Android. 

## About BitPortal

BitPortal is a mobile multi-chain crypto wallet based on [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) Identity. It supports BTC, ETH, EOS and ChainX V1 (Substrate v1 based) and has the potentiol to support all kinds of crypto currencies.

For ETH, it also provided the support for ERC20 Token Transfer and dApp Browser. dApp Browser performances like a metamask wallet when access to an dapp page.

(Right now ChainX v1 has been upgraded to newer version.)

BitPortal is developed by BitPortal Team between 2018-2020. The development of the mobile wallet has stopped just before DeFi Summer and the company has closed in the year of 2022.

The source code has been open sourced so that the other people can build based on it or learn from it.

* Official Website: https://www.bitportal.io/ (not in maintaince)

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
