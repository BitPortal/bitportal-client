import { asyncComponent } from 'components/DynamicComponent'

export const Home = asyncComponent(() => import('containers/App/Home'/* webpackChunkName: 'Home' */))
