import App from 'containers/App'
import NoMatch from 'components/NoMatch'
import {
  Home
} from 'routes/sync'

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home
      },
      {
        path: '*',
        component: NoMatch
      }
    ]
  }
]

export default routes
