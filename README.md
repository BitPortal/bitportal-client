# Bitportal Client

BitPortal client for web, ios, android, windows and macOS

## install dependencies
```sh
npm install -g full-icu
yarn install
```

## setup website
```sh
yarn start # run website (http://dev.bitportal.io:3009)
```
```sh
yarn run build # build website for production, it's served in ./static folder
```
```sh
yarn run build:staging # build website for staging
```
```sh
yarn run client # run website with client rendering after build
```
```sh
yarn run server # run website with server rendering after build
```
```sh
yarn test # run website test
```

## setup mobile
```sh
yarn run ios # build and run ios
```
```sh
yarn run android # build and run android
```
```sh
yarn run mobile # run mobile after build
```

## setup desktop
```sh
yarn run bundle:desktop # build desktop, it's served in ./bundle folder
```
```sh
yarn run desktop # run desktop after build
```

## typescript compile
```sh
yarn run tsc
```
