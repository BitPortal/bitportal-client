# BitPortal Client

BitPortal client for web, ios, android, windows, macOS and browser extension

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
