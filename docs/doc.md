<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#orgheadline1">1. Overview</a></li>
<li><a href="#orgheadline25">2. Features</a>
<ul>
<li><a href="#orgheadline2">2.1. Componnets</a></li>
<li><a href="#orgheadline6">2.2. State Management</a>
<ul>
<li><a href="#orgheadline3">2.2.1. action creator</a></li>
<li><a href="#orgheadline4">2.2.2. reducer</a></li>
<li><a href="#orgheadline5">2.2.3. connected component</a></li>
</ul>
</li>
<li><a href="#orgheadline9">2.3. Side Effects</a>
<ul>
<li><a href="#orgheadline7">2.3.1. async action</a></li>
<li><a href="#orgheadline8">2.3.2. create saga</a></li>
</ul>
</li>
<li><a href="#orgheadline10">2.4. API Requests</a></li>
<li><a href="#orgheadline14">2.5. LazyLoading</a>
<ul>
<li><a href="#orgheadline11">2.5.1. split by router</a></li>
<li><a href="#orgheadline12">2.5.2. split by componnet</a></li>
<li><a href="#orgheadline13">2.5.3. lazy load images</a></li>
</ul>
</li>
<li><a href="#orgheadline24">2.6. Server Rendering</a>
<ul>
<li><a href="#orgheadline15">2.6.1. react-router match the url</a></li>
<li><a href="#orgheadline16">2.6.2. redux-connect loadOnServer</a></li>
<li><a href="#orgheadline17">2.6.3. redux-saga rootTask</a></li>
<li><a href="#orgheadline18">2.6.4. universal cookie</a></li>
<li><a href="#orgheadline19">2.6.5. universal title</a></li>
<li><a href="#orgheadline20">2.6.6. redux preloaded state serialization</a></li>
<li><a href="#orgheadline21">2.6.7. react renderToString</a></li>
<li><a href="#orgheadline22">2.6.8. render the full page</a></li>
<li><a href="#orgheadline23">2.6.9. componnet caching</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</div>


# Overview<a id="orgheadline1"></a>

This project is built on top of react related stack. The main concern of the architecture is performance

# Features<a id="orgheadline25"></a>

## Componnets<a id="orgheadline2"></a>

All the reusable components are stored in the components folder.
Every component has a index.js file which is the entry point and
a style.css file for styles.

    // shared/components/spinner/index.js
    import React from 'react'
    import style from './style.css'

    const Spinner = () => (
      <div className={style.spinner} />
    )

    export default Spinner

    /* shared/components/spinner/style.css */
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .spinner {
      width: 0.875rem;
      height: 0.875rem;
      display: inline-block;
      vertical-align: middle;
      border: 2px solid white;
      border-right-color: transparent;
      border-radius: 50%;
      margin-left: 5px;
      animation-duration: 0.5s;
      animation-name: spin;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

## State Management<a id="orgheadline6"></a>

We use redux for state management. The basic idea is to
store all the app's states into a single store.The store data
is immutable, in order to change the store, we need to
dispatch an action, then the reducers will change the store
according to the action type and params. This approach makes
the data flow highly predictable and easy to debug. In this
project, we follow the flux standard action paradigm and
use the redux-actions library.

### action creator<a id="orgheadline3"></a>

    // shared/actions/intl.js
    import { createAction } from 'redux-actions'

    export const setLocale = createAction('intl/SET_LOCALE')

### reducer<a id="orgheadline4"></a>

    // shared/reducers/intl.js
    import { handleActions } from 'redux-actions'
    import { getInitialLang } from 'selectors/intl'
    import * as actions from 'actions/intl'

    export default handleActions({
      [actions.setLocale] (state, action) {
        return state.set('locale', action.payload)
      }
    }, getInitialLang())

### connected component<a id="orgheadline5"></a>

To connect component with redux, we use es7 decorator syntax.
It must be added before we create the react component.
Stateless function can not use this syntax. Once connected, we
can have access to the redux store and actions by props.

    // shared/components/footer/index.js
    import React, { Component } from 'react'
    import { bindActionCreators } from 'redux'
    import { connect } from 'react-redux'
    import * as intlActions from 'actions/intl'
    import LangSelector from 'component/LangSelector'

    @connect(
      state => ({
        locale: state.intl.get('locale')
      }),
      dispatch => ({
        actions: bindActionCreators(intlActions, dispatch)
      })
    )

    export default class Footer extends Component {
      render() {
        const { locale, actions } = this.props

        return (
          <div>
            <LangSelector locale={locale} setLocale={actions.setLocale} />
          </div>
        )
      }
    }

## Side Effects<a id="orgheadline9"></a>

Redux is great for synchronized actions. For asynchronized actions
(such as api requests) and some side effects, we use redux sagas
to handle that. Saga is a process running in the background
and listening to an action, when the action is triggered, it will
make some side effects related to the action.

### async action<a id="orgheadline7"></a>

    // shared/actions/balance.js
    import { createAction } from 'redux-actions'

    export const getBalanceRequested = createAction('balance/GET_REQUESTED')
    export const getBalanceSucceeded = createAction('balance/GET_SUCCEEDED')
    export const getBalanceFailed = createAction('balance/GET_FAILED')

### create saga<a id="orgheadline8"></a>

Here we defined a saga that listening to the 'getBalanceRequested'
action, once it triggered, it will run the function 'getBalance'
inside which we request the getBalance api and dispatch another
action according to the result.

    // shared/sagas/balance.js
    import { takeEvery } from 'redux-saga'
    import { call, put, fork } from 'redux-saga/effects'
    import * as api from 'utils/jsonrpc'
    import * as actions from 'actions/balance'

    function* getBalance(action) {
      try {
        const info = yield call(api.getBalance, action.payload)
        yield put(actions.getBalanceSucceeded(info))
      } catch (e) {
        yield put(actions.getBalanceFailed(e.message))
      }
    }

    export default function* balanceSaga() {
      yield fork(takeEvery, String(actions.getBalanceRequested), getBalance)
    }

## API Requests<a id="orgheadline10"></a>

The api files are in the utils folder. jsonrpc.js is for the
old jsonrpc api and api.js is for the new restful api. For
clearity, every new api will be defined by fetchBase(endpoint, method, params).

    // shared/utils/api.js
    export const login = ({ identity, password }) => fetchBase('/auth/login', 'POST', { identity, password })

## LazyLoading<a id="orgheadline14"></a>

In a large single page application, it's inefficient to load
all the files in the first view. For example, in the landing
page, we don't need anything about faq info, loading them at
once will slow down the page speed. We should embrace the
strategy of loading by demand, which is to load only what we
needed at first, then the user switch to other page, just
load content of that page, and if that content is already
loaded, just use the content in cache. Here comes the demand
of code splitting.

### split by router<a id="orgheadline11"></a>

react-router api supports code spliting by webpack. Anything
imported by System.import will be extracted into a single
chuck file and will be lazyloaded by default.

    // shared/routes/index.js

    export default {
      component: App,
      childRoutes: [
        {
          path: '/',
          getComponent(location, cb) {
            System.import('containers/App/Home')
              .then(loadRoute(cb))
              .catch(errorLoading)
          }
        },
        {
          path: 'loan',
          getComponent(location, cb) {
            System.import('containers/App/Trade/Loan')
              .then(loadRoute(cb))
              .catch(errorLoading)
          }
        },
        {
          path: 'register',
          getComponent(location, cb) {
            System.import('containers/App/Register')
              .then(loadRoute(cb))
              .catch(errorLoading)
          }
        }
    ...
      ]
    }

### split by componnet<a id="orgheadline12"></a>

If a component is large and not necessary to load in the
first view, we can also do code splitting for that.

    // shared/componnets/Form/RegisterForm/index.js
    ...
    showServiceAgreementModal() {
      if (!ServiceAgreementModal) {
        System.import('components/Modal/ServiceAgreementModal')
          .then((module) => {
            ServiceAgreementModal = module.default
            this.setState({ showServiceAgreementModal: true })
          }).catch(errorLoading)
      } else {
        this.setState({ showServiceAgreementModal: true })
      }
    }
    ...

### lazy load images<a id="orgheadline13"></a>

react-lazy-load can help you lazyload the images, only when
we scroll to the image position, it will be loaded.

    // shared/containers/App/Home/index.js
    import LazyLoad from 'react-lazy-load'
    ...
    <LazyLoad debounce={false}>
      <img role="presentation" src={QrAndroidImg} />
    </LazyLoad>
    ...

## Server Rendering<a id="orgheadline24"></a>

This project supports server rendering which improves first
view speed and search engine optimization. The basic process is
very simple: using React's renderToString method to generate
the html string from componnets and sending back to the client.
Given we are using some third party libraries such as redux,
react-router and redux-saga, we need to take them into
consideration in server side. Fortunately these libraries
already have some buildin functions to support that.

### react-router match the url<a id="orgheadline15"></a>

When we receive a url request, The "match" function can figure out
which page to render.

    // server/index.js
    match({ history, routes, location: req.url },
      (error, redirectLocation, renderProps) => { ... })

### redux-connect loadOnServer<a id="orgheadline16"></a>

Before we render the page, we might need to prefetch some data
from api and update the store.

    // server/index.js
    loadOnServer({ ...renderProps, store }).then(() => { ... })

### redux-saga rootTask<a id="orgheadline17"></a>

if we need to request multiple apis, we have to make sure all
of them are finished before render the page.

    // server/index.js
    const rootTask = store.runSaga(sagas)
    loadOnServer({ ...renderProps, store }).then(() => {
      store.close()
      rootTask.done.then(() => { ... })
    })

### universal cookie<a id="orgheadline18"></a>

react-cookie is universal. It is useful when we need to
generate content by the user's locale config, we can have
access to it through cookie in the server.

    // server/index.js
    ...
    app.use(cookieParser())
    ...
    cookie.plugToRequest(req, res)
    const store = configure({ intl: getInitialLang(), ... })

### universal title<a id="orgheadline19"></a>

You may have different titles for different url, and you want
to render it in the server. react-title-component provides the
feature.

    // server/index.js
    const title = flushTitle()

### redux preloaded state serialization<a id="orgheadline20"></a>

Once the store is ready, we need to serialize the states into
string, send back to the client and boot the app there.
The simple version of the serialization can be
JSON.stringify(state). For we are using immutablejs data type
which isn't normal object, we have to use
transit-immutable-js to transit the states to json. Then in
order to prevent xss attack, we use serialize-javascript to
convert the json to string.

    // server/index.js
    const preloadedState = store.getState()
    ...
    serialize(Transit.toJSON(preloadedState), { isJSON: true })

### react renderToString<a id="orgheadline21"></a>

render the root componnet by store, router and prefetched data

    // server/index.js
    const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <ReduxAsyncConnect {...renderProps} />
    </Provider>
    )

### render the full page<a id="orgheadline22"></a>

generate the full page by component string, title and preloadedState

    // server/index.js
    const renderFullPage = (root, title, state) => `
      <!DOCTYPE html>
      <!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->
      <!--[if IE 7 ]>    <html class="ie7"> <![endif]-->
      <!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
      <!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
      <!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
      <head>
        <meta charset="utf-8">
        <meta name="baidu-site-verification" content="N8vizo3tHN" />
        <meta name="msvalidate.01" content="9AF7EC0788061709CD0F93CA3405739C" />
        <meta name="google-site-verification" content="OYoKXw_MYGcd_rEoQsdShwerXX27jVovSdMZJ_Hx7ps" />
        <meta name="alexaVerifyID" content="HpFu_7to9HKjSKllCnKQYUimZCE" />
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
        <link rel="shortcut icon" href="https://static.btcc.com/assets/favicon.png">
        <link href="/pstyles/bundle.css?v=${__webpack_hash__}" rel="stylesheet">
    ...
      </head>
      <body>
    ...
        <div id="app">${root}</div>
        <script>window.__PRELOADED_STATE__ = ${serialize(Transit.toJSON(state), { isJSON: true })}</script>
    ...
      </body>
      </html>
    `
    ...
    res.status(200).send(renderFullPage(html, title, preloadedState))
    ...

### componnet caching<a id="orgheadline23"></a>

We can optimize ssr performance by componnet caching.
electrode-react-ssr-caching can patch the react code and let
you cache the component by props and states.

    // server/cacheConfig.js
    export default {
      components: {
        Header: {
          strategy: 'simple',
          enable: true
        },
        Footer: {
          strategy: 'simple',
          enable: true
        }
      }
    }

    // server/index.js
    import SSRCaching from 'electrode-react-ssr-caching'
    import React from 'react'
    import ReactDOMServer from 'react-dom/server'
    import cacheConfig from './cacheConfig'
    ...
    SSRCaching.enableCaching()
    SSRCaching.setCachingConfig(cacheConfig)
    ...
