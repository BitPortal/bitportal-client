/* @tsx */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router'
import classNames from 'classnames'
import { IntlProvider } from 'react-intl'
import 'normalize.css/normalize.css'
import 'resources/fonts/fonts.css'
import * as routerActions from 'actions/router'
import Title from 'components/DocumentTitle'
import style from './style.css'
import messages from './messages'

interface RouteComponent {
  key?: number
  path: string
  exact: boolean
  strict: boolean
  component: any
}

export interface Props extends RouteComponentProps<void> {
  actions: any
  router: any
  route: any,
  locale: string
}

interface State {
  showBrowserTip: boolean
}

const renderRoutes = (routes: RouteComponent[], extraProps = {}, switchProps = {}) => routes ? (
  <Switch {...switchProps}>
    {routes.map((route: RouteComponent, i: number) => (
       <Route
         key={route.key || i}
         path={route.path}
         exact={route.exact}
         strict={route.strict}
         render={props => (<route.component {...props} {...extraProps} route={route} />)}
       />
     ))}
  </Switch>
) : null

@withRouter

@connect(
  (state: any) => ({
    router: state.router,
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators(routerActions as any, dispatch)
  })
)

export default class App extends Component<Props, State> {
  previousLocation = this.props.location

  componentWillUpdate(nextProps: Props) {
    const { location } = this.props

    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location
    }
  }

  componentDidMount() {
    // this.props.actions.locationInit()
  }

  render() {
    const { route, location, locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.app}>
          <Title render="BitPortal" />
          <div className={style.appContainer}>
            <div className={classNames({ [style.transitionContext]: true, [style.showMobileMenu]: false })}>
              <div className={style.content}>
                {renderRoutes(route.routes, {}, { location })}
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    )
  }
}
