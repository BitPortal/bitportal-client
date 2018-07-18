import { hot } from 'react-hot-loader'
import { asyncComponent } from 'components/DynamicComponent'

export const Home = hot(module)(asyncComponent(() => import('pages/Home'/* webpackChunkName: 'Home' */)))
