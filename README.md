# BitPortal Client

BitPortal client for web, ios, android, windows and macOS

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
