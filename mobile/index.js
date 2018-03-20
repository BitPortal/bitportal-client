import { AsyncStorage } from 'react-native';
import { registerScreens } from 'screens';
import { startSingleApp, startTabBasedApp } from 'navigators';
import configure from 'store'
import Provider from 'components/Provider'
import sagas from 'sagas'

const store = configure()
store.runSaga(sagas)
registerScreens(store, Provider); // this is where you register all of your app's screens

AsyncStorage.getItem('Welcome', (err, result) => {
  let data = JSON.parse(result);
  if (data && data.isFirst) startTabBasedApp();
  else startSingleApp();
})

